export interface Message {
  _id?: string;
  sessionId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    mood?: string;
    sentiment?: number;
  };
}

export interface Session {
  _id: string;
  userId: string;
  title: string;
  startedAt: Date;
  endedAt?: Date;
  status: 'active' | 'completed' | 'paused';
  summary?: string;
  initialMood?: string;
  finalMood?: string;
}