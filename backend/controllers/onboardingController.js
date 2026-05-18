import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getExamSyllabus } from '../services/syllabusEngineService.js';
import { generateRoadmapForUser } from '../services/roadmapService.js';
import { scheduleExamCountdown } from '../services/notificationService.js';

export const previewSyllabus = asyncHandler(async (req, res) => {
  res.json(getExamSyllabus(req.query.examName || 'JEE'));
});

export const completeOnboarding = asyncHandler(async (req, res) => {
  const syllabus = getExamSyllabus(req.body.examName);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      examType: syllabus.type,
      examName: syllabus.key,
      examDate: req.body.examDate,
      dailyStudyHours: req.body.dailyStudyHours,
      weakSubjects: req.body.weakSubjects || [],
      subjectPriorities: req.body.subjectPriorities || syllabus.subjects.map((subject) => subject.name),
      topicDifficulties: req.body.topicDifficulties || {},
      studyTiming: req.body.studyTiming || 'Flexible',
      preferredTheme: req.body.preferredTheme || req.user.preferredTheme,
      onboardingCompleted: true
    },
    { new: true }
  );
  const roadmap = await generateRoadmapForUser(user);
  await scheduleExamCountdown(user);
  res.json({ user: user.publicProfile(), roadmap });
});
