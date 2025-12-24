import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthSession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  deviceInfo?: string;
}

const AuthSessionSchema = new Schema<IAuthSession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  deviceInfo: String,
}, { timestamps: true });

export const AuthSession = mongoose.model<IAuthSession>('AuthSession', AuthSessionSchema);
