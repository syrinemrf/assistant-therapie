'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getSessionsHistory, createSession } from '@/lib/api/sessions';
import { Loader2, Brain } from 'lucide-react';

export default function TherapyPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

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
      redirectToSession(user._id);
    } catch (error) {
      console.error('Erreur lors de la lecture des données utilisateur:', error);
      router.push('/login');
    }
  }, [router]);

  const redirectToSession = async (uid: string) => {
    try {
      // Récupérer les sessions
      const sessions = await getSessionsHistory(uid);
      
      // Chercher une session active
      const activeSession = sessions.find(s => s.status === 'active');
      
      if (activeSession) {
        // Rediriger vers la session active
        router.push(`/therapy/${activeSession._id}`);
      } else {
        // Créer une nouvelle session
        const newSession = await createSession(uid);
        router.push(`/therapy/${newSession._id}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      // En cas d'erreur, créer une nouvelle session
      try {
        const newSession = await createSession(uid);
        router.push(`/therapy/${newSession._id}`);
      } catch (err) {
        console.error('Impossible de créer une session:', err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-violet-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto"
          >
            <div className="w-full h-full rounded-full border-4 border-violet-200 border-t-violet-600" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-8 h-8 text-violet-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Préparation de votre session
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Initialisation de l'espace thérapie...
        </p>
      </motion.div>
    </div>
  );
}
