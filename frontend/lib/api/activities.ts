const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export interface Activity {
  _id: string;
  userId: string;
  type: 'mood' | 'therapy' | 'game' | 'meditation' | 'breathing' | 'exercise' | 'journal';
  name: string;
  description?: string;
  timestamp: Date;
  duration?: number;
  completed: boolean;
  moodScore?: number;
  moodNote?: string;
  metadata?: Record<string, any>;
}

export async function createActivity(data: Partial<Activity>): Promise<Activity> {
  const response = await fetch(`${API_URL}/api/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Failed to create activity');
  return response.json();
}

export async function getUserActivities(userId: string, filters?: {
  startDate?: string;
  endDate?: string;
  type?: string;
}): Promise<Activity[]> {
  const params = new URLSearchParams();
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  if (filters?.type) params.append('type', filters.type);

  const response = await fetch(
    `${API_URL}/api/activities/user/${userId}?${params.toString()}`
  );

  if (!response.ok) throw new Error('Failed to fetch activities');
  return response.json();
}

export async function getTodayActivities(userId: string): Promise<Activity[]> {
  const response = await fetch(`${API_URL}/api/activities/user/${userId}/today`);
  if (!response.ok) throw new Error('Failed to fetch today activities');
  return response.json();
}

export async function getActivityStats(userId: string, days: number = 7) {
  const response = await fetch(
    `${API_URL}/api/activities/user/${userId}/stats?days=${days}`
  );
  if (!response.ok) throw new Error('Failed to fetch activity stats');
  return response.json();
}
