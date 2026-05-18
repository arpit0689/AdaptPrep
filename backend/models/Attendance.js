import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    dateKey: { type: String, required: true },
    date: { type: Date, required: true },
    studiedHours: { type: Number, default: 0, min: 0, max: 24 },
    plannedHours: { type: Number, required: true, min: 1, max: 16 },
    attendanceStatus: { type: String, enum: ['Present', 'Grace', 'Needs Attention'], default: 'Needs Attention' },
    focusScore: { type: Number, default: 0, min: 0, max: 100 },
    source: { type: String, enum: ['manual', 'auto', 'cron'], default: 'manual' }
  },
  { timestamps: true }
);

attendanceSchema.index({ userId: 1, dateKey: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
