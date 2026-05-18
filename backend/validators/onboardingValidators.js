import { body } from 'express-validator';

export const onboardingValidator = [
  body('examName').trim().notEmpty(),
  body('examDate').isISO8601().toDate(),
  body('dailyStudyHours').isFloat({ min: 1, max: 16 }),
  body('weakSubjects').optional().isArray(),
  body('subjectPriorities').optional().isArray(),
  body('studyTiming').optional().isIn(['Morning', 'Afternoon', 'Night', 'Flexible']),
  body('preferredTheme').optional().isIn(['light', 'dark', 'system'])
];
