import Task from '../models/Task.js';
import TopicProgress from '../models/TopicProgress.js';

export const refreshWeakAreaClassifications = async (userId) => {
  const topics = await TopicProgress.find({ userId });
  const updates = await Promise.all(
    topics.map(async (topic) => {
      const tasks = await Task.find({ userId, subject: topic.subject, chapter: topic.chapter, topic: topic.topic });
      const completed = tasks.filter((task) => task.completed).length;
      const skipped = tasks.filter((task) => task.skipped).length;
      const completionRate = tasks.length ? completed / tasks.length : 0;
      const retention = topic.retentionScore || 50;
      const classification = skipped > 2 || retention < 35 ? 'Critical' : completionRate < 0.45 ? 'Weak' : completionRate < 0.75 ? 'Average' : 'Strong';
      return TopicProgress.updateOne({ _id: topic._id }, { classification });
    })
  );
  return { updated: updates.length };
};
