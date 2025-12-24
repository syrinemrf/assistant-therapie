const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export interface Session {
  _id: string;
  userId: string;
  title: string;
  initialMood?: string;
  finalMood?: string;
  status: 'active' | 'completed';
  startedAt: string;
  endedAt?: string;
  summary?: string;
  messages?: Message[];
  messageCount?: number;
}

export interface Message {
  _id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Récupérer toutes les sessions d'un utilisateur
export async function getUserSessions(userId: string): Promise<Session[]> {
  const response = await fetch(`${API_URL}/api/sessions/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sessions');
  }

  return response.json();
}

// Récupérer l'historique complet avec messages
export async function getSessionsHistory(userId: string, limit = 50): Promise<Session[]> {
  const response = await fetch(`${API_URL}/api/sessions/user/${userId}/history?limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sessions history');
  }

  return response.json();
}

// Récupérer une session spécifique avec ses messages
export async function getSessionById(sessionId: string): Promise<Session> {
  const response = await fetch(`${API_URL}/api/sessions/${sessionId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch session');
  }

  return response.json();
}

// Créer une nouvelle session
export async function createSession(userId: string, initialMood?: string): Promise<Session> {
  const response = await fetch(`${API_URL}/api/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ userId, initialMood })
  });

  if (!response.ok) {
    throw new Error('Failed to create session');
  }

  return response.json();
}

// Terminer une session
export async function endSession(sessionId: string, finalMood?: string, summary?: string): Promise<Session> {
  const response = await fetch(`${API_URL}/api/sessions/${sessionId}/end`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ finalMood, summary })
  });

  if (!response.ok) {
    throw new Error('Failed to end session');
  }

  return response.json();
}
