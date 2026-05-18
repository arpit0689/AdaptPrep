import Task from '../models/Task.js';
import TopicProgress from '../models/TopicProgress.js';
import { addDays } from '../utils/date.js';

const revisionStages = [1, 7, 30];

export const scheduleRevisionsForTask = async (task) => {
  if (!task.completed || task.taskType === 'Revision') return [];
  const ops = revisionStages.map((stage) => ({
    updateOne: {
      filter: {
        userId: task.userId,
        subject: task.subject,
        chapter: task.chapter,
        topic: task.topic,
        taskType: 'Revision',
        revisionStage: stage,
        plannedDate: addDays(task.completionDate || new Date(), stage)
      },
      update: {
        $setOnInsert: {
          userId: task.userId,
          subject: task.subject,
          chapter: task.chapter,
          topic: task.topic,
          subtopic: `${task.topic} spaced recall`,
          taskType: 'Revision',
          duration: Math.max(25, Math.round(task.duration * 0.45)),
          plannedDate: addDays(task.completionDate || new Date(), stage),
          revisionStage: stage,
          priority: stage === 1 ? 5 : 4,
          sourceEngine: 'revisionService',
          difficultyLevel: task.difficultyLevel
        }
      },
      upsert: true
    }
  }));

  await Task.bulkWrite(ops, { ordered: false }).catch((error) => {
    if (error.code !== 11000) throw error;
  });

  await TopicProgress.updateOne(
    { userId: task.userId, subject: task.subject, chapter: task.chapter, topic: task.topic },
    { $set: { completed: true }, $inc: { retentionScore: 8 } },
    { upsert: true }
  );

  return ops;
};
