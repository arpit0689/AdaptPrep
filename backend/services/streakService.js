import User from '../models/User.js';

export const updateStreakForAttendance = async (user, attendance) => {
  const successful = ['Present', 'Grace'].includes(attendance.attendanceStatus);
  const streakCount = successful ? (user.lastAttendanceDateKey === attendance.dateKey ? user.streakCount : user.streakCount + 1) : 0;
  const longestStreak = Math.max(user.longestStreak || 0, streakCount);

  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        streakCount,
        longestStreak,
        lastAttendanceDateKey: attendance.dateKey,
        recoveryMode: !successful
      },
      $inc: successful ? { xp: attendance.attendanceStatus === 'Present' ? 20 : 10 } : {}
    }
  );
};
