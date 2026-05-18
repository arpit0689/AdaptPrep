import { Router } from 'express';
import { completeTask, listTasks, recoverRoadmap, regenerateRoadmap, rescheduleTask, skipTask, todayFocus } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import { completeTaskValidator, rescheduleTaskValidator, taskIdValidator } from '../validators/taskValidators.js';

const router = Router();
router.use(protect);
router.get('/', listTasks);
router.get('/today-focus', todayFocus);
router.post('/regenerate', regenerateRoadmap);
router.post('/recover', recoverRoadmap);
router.patch('/:id/complete', completeTaskValidator, validate, completeTask);
router.patch('/:id/skip', taskIdValidator, validate, skipTask);
router.patch('/:id/reschedule', rescheduleTaskValidator, validate, rescheduleTask);
export default router;
