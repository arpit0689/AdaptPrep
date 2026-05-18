import Task from '../models/Task.js';
import TopicProgress from '../models/TopicProgress.js';
import { addDays, daysBetween } from '../utils/date.js';
import { flattenSyllabus, getExamSyllabus, priorityWeight } from './syllabusEngineService.js';

const splitDuration = (dailyStudyHours) => {
  const minutes = Math.max(60, Math.min(480, dailyStudyHours * 60));
  if (minutes <= 120) return [minutes];
  if (minutes <= 240) return [75, minutes - 75];
  return [90, 75, Math.min(120, minutes - 165)];
};

export const generateRoadmapForUser = async (user) => {
  const syllabus = getExamSyllabus(user.examName);
  const topics = flattenSyllabus(syllabus).sort((a, b) => {
    const bw = priorityWeight(b.subject, user.weakSubjects, user.subjectPriorities);
    const aw = priorityWeight(a.subject, user.weakSubjects, user.subjectPriorities);
    return bw - aw;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const remainingDays = Math.max(7, daysBetween(today, user.examDate || addDays(today, 180)));
  const studyDays = Array.from({ length: remainingDays }, (_, index) => addDays(today, index));
  const durations = splitDuration(user.dailyStudyHours);
  const tasks = [];

  let topicIndex = 0;
  for (const day of studyDays) {
    if (day.getDay() === 0) {
      tasks.push({
        userId: user._id,
        subject: 'Integrated Revision',
        chapter: 'Weekly Consolidation',
        topic: 'Mock Test and Reflection',
        subtopic: 'Review accuracy trends and calm corrections',
        taskType: 'Mock Test',
        duration: Math.min(120, user.dailyStudyHours * 60),
        plannedDate: day,
        priority: 4,
        sourceEngine: 'roadmapService',
        difficultyLevel: 'Medium'
      });
      continue;
    }

    for (const duration of durations) {
      const item = topics[topicIndex % topics.length];
      const weak = user.weakSubjects?.includes(item.subject);
      tasks.push({
        userId: user._id,
        ...item,
        taskType: weak ? 'Weak Area Focus' : topicIndex % 3 === 0 ? 'Practice' : 'Study',
        duration,
        plannedDate: day,
        priority: weak ? 5 : 3,
        sourceEngine: 'roadmapService',
        difficultyLevel: weak ? 'Needs Attention' : 'Medium'
      });
      topicIndex += 1;
    }
  }

  await Task.bulkWrite(
    tasks.map((task) => ({
      updateOne: {
        filter: {
          userId: task.userId,
          subject: task.subject,
          chapter: task.chapter,
          topic: task.topic,
          taskType: task.taskType,
          revisionStage: task.revisionStage || 0,
          plannedDate: task.plannedDate
        },
        update: { $setOnInsert: task },
        upsert: true
      }
    })),
    { ordered: false }
  ).catch((error) => {
    if (error.code !== 11000) throw error;
  });

  await TopicProgress.bulkWrite(
    topics.map((topic) => ({
      updateOne: {
        filter: { userId: user._id, subject: topic.subject, chapter: topic.chapter, topic: topic.topic },
        update: { $setOnInsert: { userId: user._id, ...topic } },
        upsert: true
      }
    })),
    { ordered: false }
  );

  return { generatedTasks: tasks.length, syllabus };
};

export const getTodayFocus = async (userId, date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = addDays(start, 1);
  const tasks = await Task.find({
    userId,
    completed: false,
    skipped: false,
    plannedDate: { $gte: start, $lt: end }
  })
    .sort({ priority: -1, duration: -1 })
    .limit(3);

  return tasks;
};

export const rebalanceFutureTasks = async (user, missedDate = new Date()) => {
  const overdue = await Task.find({
    userId: user._id,
    completed: false,
    skipped: false,
    plannedDate: { $lt: missedDate }
  }).sort({ priority: -1, plannedDate: 1 });

  if (!overdue.length) return { moved: 0 };

  const dailyRecoveryCap = Math.max(30, Math.min(90, user.dailyStudyHours * 12));
  let offset = 1;
  let bucket = 0;
  const ops = overdue.map((task) => {
    bucket += Math.min(task.duration, dailyRecoveryCap);
    if (bucket > dailyRecoveryCap) {
      offset += 1;
      bucket = task.duration;
    }
    return {
      updateOne: {
        filter: { _id: task._id },
        update: {
          $set: {
            adjustedDate: addDays(new Date(), offset),
            taskType: 'Recovery',
            sourceEngine: 'recoveryService'
          }
        }
      }
    };
  });

  await Task.bulkWrite(ops);
  return { moved: overdue.length };
};
