import Attendance from '../models/Attendance.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { toDateKey } from '../utils/date.js';
import { updateStreakForAttendance } from './streakService.js';

export const upsertAttendance = async ({ user, date = new Date(), studiedHours, source = 'manual' }) => {
  const dateKey = toDateKey(date);
  const plannedHours = user.dailyStudyHours || 3;
  const attendanceStatus = studiedHours >= plannedHours * 0.7 ? 'Present' : studiedHours >= plannedHours * 0.45 ? 'Grace' : 'Needs Attention';
  const focusScore = Math.min(100, Math.round((studiedHours / plannedHours) * 100));

  const attendance = await Attendance.findOneAndUpdate(
    { userId: user._id, dateKey },
    { userId: user._id, dateKey, date, studiedHours, plannedHours, attendanceStatus, focusScore, source },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await updateStreakForAttendance(user, attendance);
  return attendance;
};

export const autoMarkAttendanceForUser = async (userId, date = new Date()) => {
  const user = await User.findById(userId);
  if (!user) return null;
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const tasks = await Task.find({ userId, completionDate: { $gte: start, $lt: end } });
  const studiedHours = tasks.reduce((sum, task) => sum + (task.studyMinutesLogged || task.duration || 0), 0) / 60;
  return upsertAttendance({ user, date, studiedHours, source: 'auto' });
};

export const getAttendanceSummary = async (userId, days = 30) => {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const records = await Attendance.find({ userId, date: { $gte: since } }).sort({ date: 1 });
  const present = records.filter((item) => ['Present', 'Grace'].includes(item.attendanceStatus)).length;
  return {
    records,
    attendancePercentage: records.length ? Math.round((present / records.length) * 100) : 0,
    weeklyConsistency: records.slice(-7).filter((item) => ['Present', 'Grace'].includes(item.attendanceStatus)).length
  };
};
