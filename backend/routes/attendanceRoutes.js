import { Router } from 'express';
import { body } from 'express-validator';
import { attendanceSummary, markAttendance } from '../controllers/attendanceController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';

const router = Router();
router.use(protect);
router.post('/', [body('studiedHours').isFloat({ min: 0, max: 24 })], validate, markAttendance);
router.get('/summary', attendanceSummary);
export default router;
