import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  startedAt: Date;
  endedAt?: Date;
  status: 'active' | 'completed' | 'paused';
  summary?: string;
  initialMood?: string;
  finalMood?: string;
}

const SessionSchema = new Schema<ISession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Nouvelle session' },
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
  status: { 
    type: String, 
    enum: ['active', 'completed', 'paused'], 
    default: 'active' 
  },
  summary: String,
  initialMood: String,
  finalMood: String
}, { timestamps: true });

export default mongoose.model<ISession>('Session', SessionSchema);