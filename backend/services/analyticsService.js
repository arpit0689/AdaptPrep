import Attendance from '../models/Attendance.js';
import Task from '../models/Task.js';
import TopicProgress from '../models/TopicProgress.js';
import { daysBetween } from '../utils/date.js';

export const getDashboardAnalytics = async (user) => {
  const [tasks, attendance, topics] = await Promise.all([
    Task.find({ userId: user._id }),
    Attendance.find({ userId: user._id }).sort({ date: 1 }).limit(90),
    TopicProgress.find({ userId: user._id })
  ]);

  const completed = tasks.filter((task) => task.completed).length;
  const overdue = tasks.filter((task) => !task.completed && !task.skipped && new Date(task.adjustedDate || task.plannedDate) < new Date()).length;
  const remainingDays = user.examDate ? daysBetween(new Date(), user.examDate) : 0;
  const weakSubjects = topics.filter((topic) => ['Weak', 'Critical'].includes(topic.classification));
  const status = overdue > 25 ? 'Critical' : user.recoveryMode || overdue > 8 ? 'Recovery Needed' : completed > tasks.length * 0.45 ? 'Ahead' : 'On Track';

  const subjectDistribution = Object.values(
    tasks.reduce((acc, task) => {
      acc[task.subject] ||= { subject: task.subject, minutes: 0, completed: 0 };
      acc[task.subject].minutes += task.duration;
      if (task.completed) acc[task.subject].completed += 1;
      return acc;
    }, {})
  );

  return {
    remainingSyllabus: Math.max(0, tasks.length - completed),
    remainingDays,
    requiredStudyPace: remainingDays ? Math.ceil((tasks.length - completed) / remainingDays) : tasks.length - completed,
    completionRate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    backlogCount: overdue,
    recoveryStatus: user.recoveryMode,
    readinessLevel: Math.min(100, Math.round(((completed / Math.max(1, tasks.length)) * 70) + ((user.attendancePercentage || 0) * 0.3))),
    status,
    weakSubjects,
    subjectDistribution,
    attendanceTrend: attendance.map((item) => ({ date: item.dateKey, hours: item.studiedHours, focus: item.focusScore })),
    revisionAnalytics: {
      due: tasks.filter((task) => task.taskType === 'Revision' && !task.completed).length,
      completed: tasks.filter((task) => task.taskType === 'Revision' && task.completed).length
    }
  };
};
