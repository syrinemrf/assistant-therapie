'use client';

import { Session } from '@/types/chat';
import { formatDate } from '@/lib/utils';
import { Clock, Circle, Brain } from 'lucide-react';

interface SessionHeaderProps {
  session: Session | null;
  isConnected: boolean;
}

export default function SessionHeader({ session, isConnected }: SessionHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {session?.title || 'Serenity AI Session'}
            </h1>
            <p className="text-sm opacity-90 flex items-center gap-1">
              <Clock size={14} />
              {session ? formatDate(session.startedAt) : 'Nouvelle session'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
          <Circle 
            size={8} 
            className={`${isConnected ? 'fill-green-400 text-green-400' : 'fill-red-400 text-red-400'}`}
          />
          <span className="text-sm font-medium">
            {isConnected ? 'Connecté' : 'Déconnecté'}
          </span>
        </div>
      </div>
    </div>
  );
}