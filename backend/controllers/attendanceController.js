import { asyncHandler } from '../utils/asyncHandler.js';
import { getAttendanceSummary, upsertAttendance } from '../services/attendanceService.js';

export const markAttendance = asyncHandler(async (req, res) => {
  const attendance = await upsertAttendance({
    user: req.user,
    date: req.body.date ? new Date(req.body.date) : new Date(),
    studiedHours: Number(req.body.studiedHours || 0),
    source: 'manual'
  });
  res.json({ attendance, message: attendance.attendanceStatus === 'Needs Attention' ? "Let's keep it gentle and recover tomorrow." : 'Consistency logged.' });
});

export const attendanceSummary = asyncHandler(async (req, res) => {
  res.json(await getAttendanceSummary(req.user._id, Number(req.query.days || 30)));
});
