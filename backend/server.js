import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { startSchedulers } from './jobs/scheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || 'https://adapt-prep.vercel.app', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 250, standardHeaders: true, legacyHeaders: false }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true, name: 'AdaptPrep API' }));
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/progress', progressRoutes);
app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`AdaptPrep API running on ${PORT}`));
    startSchedulers();
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit(1);
  });
