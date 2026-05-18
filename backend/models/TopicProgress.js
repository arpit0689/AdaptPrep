import mongoose from 'mongoose';

const topicProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true },
    chapter: { type: String, required: true },
    topic: { type: String, required: true },
    completed: { type: Boolean, default: false },
    difficultyLevel: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Needs Attention'], default: 'Medium' },
    retentionScore: { type: Number, default: 50, min: 0, max: 100 },
    revisionCompletionRate: { type: Number, default: 0, min: 0, max: 100 },
    classification: { type: String, enum: ['Strong', 'Average', 'Weak', 'Critical'], default: 'Average' }
  },
  { timestamps: true }
);

topicProgressSchema.index({ userId: 1, subject: 1, chapter: 1, topic: 1 }, { unique: true });

export default mongoose.model('TopicProgress', topicProgressSchema);
