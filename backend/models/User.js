import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, minlength: 8, select: false },
    examType: { type: String, default: '' },
    examName: { type: String, default: '' },
    examDate: { type: Date },
    dailyStudyHours: { type: Number, default: 3, min: 1, max: 16 },
    streakCount: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    attendancePercentage: { type: Number, default: 0 },
    recoveryMode: { type: Boolean, default: false },
    onboardingCompleted: { type: Boolean, default: false },
    preferredTheme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{ type: String }],
    studyTiming: { type: String, enum: ['Morning', 'Afternoon', 'Night', 'Flexible'], default: 'Flexible' },
    weakSubjects: [{ type: String }],
    subjectPriorities: [{ type: String }],
    topicDifficulties: { type: Map, of: String },
    lastAttendanceDateKey: { type: String }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.publicProfile = function publicProfile() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model('User', userSchema);
