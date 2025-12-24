import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'mood' | 'therapy' | 'game' | 'meditation' | 'breathing' | 'exercise' | 'journal';
  name: string;
  description?: string;
  timestamp: Date;
  duration?: number; // in minutes
  completed: boolean;
  moodScore?: number; // 0-100
  moodNote?: string;
  metadata?: Record<string, any>;
}

const ActivitySchema = new Schema<IActivity>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['mood', 'therapy', 'game', 'meditation', 'breathing', 'exercise', 'journal'],
    required: true 
  },
  name: { type: String, required: true },
  description: String,
  timestamp: { type: Date, default: Date.now },
  duration: Number,
  completed: { type: Boolean, default: true },
  moodScore: { type: Number, min: 0, max: 100 },
  moodNote: String,
  metadata: Schema.Types.Mixed,
}, { timestamps: true });

// Index for faster queries
ActivitySchema.index({ userId: 1, timestamp: -1 });
ActivitySchema.index({ userId: 1, type: 1, timestamp: -1 });

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
