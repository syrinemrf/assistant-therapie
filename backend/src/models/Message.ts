import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sessionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    mood?: string;
    sentiment?: number;
  };
}

const MessageSchema = new Schema<IMessage>({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: {
    mood: String,
    sentiment: Number
  }
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', MessageSchema);