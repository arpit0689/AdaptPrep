import { Router } from 'express';
import { completeOnboarding, previewSyllabus } from '../controllers/onboardingController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import { onboardingValidator } from '../validators/onboardingValidators.js';

const router = Router();
router.get('/syllabus', protect, previewSyllabus);
router.post('/complete', protect, onboardingValidator, validate, completeOnboarding);
export default router;
