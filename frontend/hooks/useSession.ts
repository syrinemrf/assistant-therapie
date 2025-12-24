'use client';

import { useState, useEffect } from 'react';
import { Session } from '@/types/chat';

export const useSession = (userId: string) => {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createSession = async (initialMood?: string) => {
    setIsLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, initialMood })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newSession = await response.json();
      setCurrentSession(newSession);
      return newSession;
    } catch (error) {
      console.error('Erreur création session:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentSession,
    isLoading,
    createSession,
    setCurrentSession
  };
};