import { Router } from 'express';
import { login, me, register } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import { loginValidator, registerValidator } from '../validators/authValidators.js';

const router = Router();
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.get('/me', protect, me);
export default router;
