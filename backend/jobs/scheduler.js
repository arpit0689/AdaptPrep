import cron from 'node-cron';
import User from '../models/User.js';
import Task from '../models/Task.js';
import { autoMarkAttendanceForUser } from '../services/attendanceService.js';
import { activateRecoveryMode } from '../services/recoveryService.js';
import { scheduleRevisionsForTask } from '../services/revisionService.js';
import { refreshWeakAreaClassifications } from '../services/weakAreaService.js';

export const startSchedulers = () => {
  cron.schedule('15 23 * * *', async () => {
    const users = await User.find({ onboardingCompleted: true });
    await Promise.all(users.map((user) => autoMarkAttendanceForUser(user._id)));
  }, { timezone: 'Asia/Kolkata' });

  cron.schedule('30 23 * * *', async () => {
    const users = await User.find({ onboardingCompleted: true, recoveryMode: true });
    await Promise.all(users.map((user) => activateRecoveryMode(user._id, 'nightly-rebalance')));
  }, { timezone: 'Asia/Kolkata' });

  cron.schedule('10 4 * * *', async () => {
    const completedWithoutRevisions = await Task.find({ completed: true, taskType: { $ne: 'Revision' } }).limit(1000);
    await Promise.all(completedWithoutRevisions.map(scheduleRevisionsForTask));
  }, { timezone: 'Asia/Kolkata' });

  cron.schedule('45 4 * * 1', async () => {
    const users = await User.find({ onboardingCompleted: true });
    await Promise.all(users.map((user) => refreshWeakAreaClassifications(user._id)));
  }, { timezone: 'Asia/Kolkata' });
};
