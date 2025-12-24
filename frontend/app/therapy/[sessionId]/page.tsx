'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ChatInterface from '@/components/chat/ChatInterface';
import SessionHistory from '@/components/therapy/SessionHistory';
import { getSessionById, Session } from '@/lib/api/sessions';
import { Loader2 } from 'lucide-react';

export default function TherapySessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  
  const [userId, setUserId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setUserId(user._id);
    } catch (error) {
      console.error('Erreur lors de la lecture des données utilisateur:', error);
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (sessionId && userId) {
      loadSession();
    }
  }, [sessionId, userId]);

  const loadSession = async () => {
    try {
      setIsLoading(true);
      const sessionData = await getSessionById(sessionId);
      setSession(sessionData);
    } catch (error) {
      console.error('Erreur chargement session:', error);
      router.push('/therapy');
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-violet-600" />
          <p className="text-gray-600">Chargement de la session...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 pt-16">
      {/* Session History Sidebar */}
      {showHistory && (
        <div className="w-80 border-r border-white/40 bg-white/60 backdrop-blur-xl flex-shrink-0 shadow-xl">
          <SessionHistory 
            currentSessionId={sessionId}
            onToggle={() => setShowHistory(false)}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {session && userId && (
          <ChatInterface 
            userId={userId} 
            sessionId={session._id}
            initialMessages={session.messages}
          />
        )}
      </div>
    </div>
  );
}
