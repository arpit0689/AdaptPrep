import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true, index: true },
    chapter: { type: String, required: true },
    topic: { type: String, required: true },
    subtopic: { type: String, default: '' },
    taskType: { type: String, enum: ['Study', 'Revision', 'Mock Test', 'Practice', 'Recovery', 'Weak Area Focus'], required: true },
    duration: { type: Number, required: true, min: 15, max: 240 },
    plannedDate: { type: Date, required: true, index: true },
    adjustedDate: { type: Date, index: true },
    completed: { type: Boolean, default: false, index: true },
    skipped: { type: Boolean, default: false },
    completionDate: { type: Date },
    revisionStage: { type: Number, enum: [0, 1, 7, 30], default: 0 },
    notes: { type: String, default: '', maxlength: 1000 },
    priority: { type: Number, default: 3, min: 1, max: 5 },
    sourceEngine: { type: String, default: 'roadmapService' },
    difficultyLevel: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Needs Attention'], default: 'Medium' },
    studyMinutesLogged: { type: Number, default: 0 }
  },
  { timestamps: true }
);

taskSchema.index({ userId: 1, subject: 1, chapter: 1, topic: 1, taskType: 1, revisionStage: 1, plannedDate: 1 }, { unique: true });

export default mongoose.model('Task', taskSchema);
