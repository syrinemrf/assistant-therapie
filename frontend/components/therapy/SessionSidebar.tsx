'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, Calendar, Clock, ChevronRight, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';

interface Session {
  _id: string;
  title: string;
  startedAt: string;
  status: string;
  initialMood?: string;
  messageCount?: number;
  messages?: any[];
}

interface SessionSidebarProps {
  sessions: Session[];
  currentSessionId?: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  isLoading?: boolean;
}

export default function SessionSidebar({ 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onNewSession,
  isLoading 
}: SessionSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || session.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Mes sessions
          </h2>
          <Button
            onClick={onNewSession}
            size="sm"
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nouveau
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2 mt-3">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f === 'all' ? 'Toutes' : f === 'active' ? 'Actives' : 'Terminées'}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Aucune session trouvée' : 'Aucune session encore'}
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            <AnimatePresence>
              {filteredSessions.map((session, index) => (
                <motion.button
                  key={session._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectSession(session._id)}
                  className={`w-full p-3 rounded-lg text-left transition-all hover:bg-gray-50 dark:hover:bg-gray-800 group ${
                    currentSessionId === session._id
                      ? 'bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700'
                      : 'border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className={`w-4 h-4 flex-shrink-0 ${
                          currentSessionId === session._id
                            ? 'text-violet-600 dark:text-violet-400'
                            : 'text-gray-400'
                        }`} />
                        <h3 className={`font-medium text-sm truncate ${
                          currentSessionId === session._id
                            ? 'text-violet-900 dark:text-violet-100'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {session.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(session.startedAt), { 
                            addSuffix: true,
                            locale: fr 
                          })}
                        </span>
                        {session.messageCount !== undefined && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {session.messageCount}
                          </span>
                        )}
                      </div>

                      {session.initialMood && (
                        <div className="mt-1">
                          <span className="text-xs text-gray-400">
                            Humeur: {session.initialMood}
                          </span>
                        </div>
                      )}
                    </div>

                    <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${
                      currentSessionId === session._id
                        ? 'text-violet-600 dark:text-violet-400'
                        : 'text-gray-300 group-hover:translate-x-1'
                    }`} />
                  </div>

                  {/* Status Badge */}
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      session.status === 'active'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {session.status === 'active' ? '● Active' : '✓ Terminée'}
                    </span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
              {sessions.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total sessions
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {sessions.filter(s => s.status === 'active').length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Actives
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
