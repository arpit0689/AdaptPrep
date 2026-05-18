import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['revision', 'task', 'recovery', 'streak', 'exam'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    scheduledFor: { type: Date, required: true, index: true },
    read: { type: Boolean, default: false },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
