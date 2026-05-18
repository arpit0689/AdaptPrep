import Task from '../models/Task.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { scheduleRevisionsForTask } from '../services/revisionService.js';
import { generateRoadmapForUser, getTodayFocus } from '../services/roadmapService.js';
import { activateRecoveryMode } from '../services/recoveryService.js';

export const listTasks = asyncHandler(async (req, res) => {
  const { date, page = 1, limit = 50 } = req.query;
  const query = { userId: req.user._id };
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    query.$or = [{ plannedDate: { $gte: start, $lt: end } }, { adjustedDate: { $gte: start, $lt: end } }];
  }
  const tasks = await Task.find(query)
    .sort({ plannedDate: 1, priority: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  res.json({ tasks });
});

export const todayFocus = asyncHandler(async (req, res) => {
  res.json({ tasks: await getTodayFocus(req.user._id) });
});

export const regenerateRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await generateRoadmapForUser(req.user);
  res.json({ roadmap, message: 'Your roadmap has been refreshed with the latest syllabus priorities.' });
});

export const recoverRoadmap = asyncHandler(async (req, res) => {
  const recovery = await activateRecoveryMode(req.user._id, 'manual-roadmap-recovery');
  res.json({ recovery, message: "Let's rebalance your roadmap gradually." });
});

export const completeTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
  if (!task) throw new ApiError(404, 'Task not found');
  task.completed = true;
  task.skipped = false;
  task.completionDate = new Date();
  task.notes = req.body.notes ?? task.notes;
  task.studyMinutesLogged = req.body.studyMinutesLogged ?? task.duration;
  task.difficultyLevel = req.body.difficultyLevel ?? task.difficultyLevel;
  await task.save();
  await scheduleRevisionsForTask(task);
  res.json({ task, message: 'Nice steady step. Revision reminders are ready.' });
});

export const skipTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { skipped: true }, { new: true });
  if (!task) throw new ApiError(404, 'Task not found');
  res.json({ task, message: "No guilt. We'll recover this gradually." });
});

export const rescheduleTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { adjustedDate: req.body.plannedDate, plannedDate: req.body.plannedDate },
    { new: true }
  );
  if (!task) throw new ApiError(404, 'Task not found');
  res.json({ task });
});
