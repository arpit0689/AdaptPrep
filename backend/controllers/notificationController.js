import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getUnreadNotifications } from '../services/notificationService.js';

export const listNotifications = asyncHandler(async (req, res) => {
  res.json({ notifications: await getUnreadNotifications(req.user._id) });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  await Notification.updateOne({ _id: req.params.id, userId: req.user._id }, { read: true });
  res.json({ ok: true });
});
