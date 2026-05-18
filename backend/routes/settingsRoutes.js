import { Router } from 'express';
import { updateSettings } from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.patch('/', protect, updateSettings);
export default router;
