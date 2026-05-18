import TopicProgress from '../models/TopicProgress.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listProgress = asyncHandler(async (req, res) => {
  const topics = await TopicProgress.find({ userId: req.user._id }).sort({ subject: 1, chapter: 1, topic: 1 });
  const subjects = Object.values(
    topics.reduce((acc, topic) => {
      acc[topic.subject] ||= { subject: topic.subject, total: 0, completed: 0, chapters: {} };
      acc[topic.subject].total += 1;
      if (topic.completed) acc[topic.subject].completed += 1;
      acc[topic.subject].chapters[topic.chapter] ||= [];
      acc[topic.subject].chapters[topic.chapter].push(topic);
      return acc;
    }, {})
  );
  res.json({ subjects, topics });
});

export const updateTopicProgress = asyncHandler(async (req, res) => {
  const topic = await TopicProgress.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    {
      completed: req.body.completed,
      difficultyLevel: req.body.difficultyLevel,
      classification: req.body.classification
    },
    { new: true }
  );
  res.json({ topic });
});
