import Notification from '../models/Notification.js';

export const createNotification = (payload) => Notification.create(payload);

export const getUnreadNotifications = (userId) =>
  Notification.find({ userId, read: false, scheduledFor: { $lte: new Date() } }).sort({ scheduledFor: -1 }).limit(20);

export const scheduleExamCountdown = async (user) => {
  if (!user.examDate) return null;
  return createNotification({
    userId: user._id,
    type: 'exam',
    title: 'Exam countdown updated',
    message: 'Your plan is tuned around the remaining days. Small steady steps count.',
    scheduledFor: new Date(),
    metadata: { examDate: user.examDate }
  });
};
