import { body, param } from 'express-validator';

export const taskIdValidator = [param('id').isMongoId()];

export const completeTaskValidator = [
  param('id').isMongoId(),
  body('notes').optional().trim().isLength({ max: 1000 }),
  body('studyMinutesLogged').optional().isInt({ min: 0, max: 600 }),
  body('difficultyLevel').optional().isIn(['Easy', 'Medium', 'Hard', 'Needs Attention'])
];

export const rescheduleTaskValidator = [param('id').isMongoId(), body('plannedDate').isISO8601().toDate()];
