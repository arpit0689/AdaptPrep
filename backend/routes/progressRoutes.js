import { Router } from 'express';
import { body, param } from 'express-validator';
import { listProgress, updateTopicProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';

const router = Router();
router.use(protect);
router.get('/', listProgress);
router.patch(
  '/:id',
  [
    param('id').isMongoId(),
    body('completed').optional().isBoolean(),
    body('difficultyLevel').optional().isIn(['Easy', 'Medium', 'Hard', 'Needs Attention']),
    body('classification').optional().isIn(['Strong', 'Average', 'Weak', 'Critical'])
  ],
  validate,
  updateTopicProgress
);
export default router;
