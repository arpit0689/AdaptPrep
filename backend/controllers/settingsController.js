import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const updateSettings = asyncHandler(async (req, res) => {
  const allowed = ['preferredTheme', 'dailyStudyHours', 'studyTiming', 'weakSubjects', 'subjectPriorities'];
  const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
  res.json({ user: user.publicProfile() });
});
