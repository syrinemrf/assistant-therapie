'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/hooks/useChat';
import { useSession } from '@/hooks/useSession';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Sparkles, Loader2 } from 'lucide-react';

interface ChatInterfaceProps {
  userId: string;
  sessionId?: string;
  initialMessages?: any[];
}

export default function ChatInterface({ userId, sessionId: propSessionId, initialMessages = [] }: ChatInterfaceProps) {
  const [mounted, setMounted] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(propSessionId);
  const { currentSession, createSession, isLoading } = useSession(userId);
  
  const {
    messages,
    isTyping,
    isConnected,
    sendMessage
  } = useChat(sessionId || currentSession?._id || '', userId);

  useEffect(() => {
    setMounted(true);
    // Utiliser la session passée en prop ou créer une nouvelle
    if (propSessionId) {
      setSessionId(propSessionId);
    } else if (!currentSession && !isLoading) {
      createSession().then(session => {
        if (session) {
          setSessionId(session._id);
        }
      });
    }
  }, [propSessionId, currentSession, isLoading]);

  const handleSendMessage = async (content: string) => {
    const activeSessionId = sessionId || currentSession?._id;
    
    if (!activeSessionId) {
      const session = await createSession();
      if (session) {
        setSessionId(session._id);
        sendMessage(content);
      }
    } else {
      sendMessage(content);
    }
  };

  if (isLoading || !mounted) {
    return (
      <div className="flex items-center justify-center h-full bg-transparent">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-violet-600" />
          <p className="text-gray-600">Initialisation de votre session...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Messages Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-100/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl" />
        </div>
        
        <MessageList messages={messages} isTyping={isTyping} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-violet-100">
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={!isConnected} 
        />
      </div>

      {/* Floating AI Indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-8 right-8 bg-white/80 backdrop-blur-xl rounded-full px-4 py-2 shadow-lg border border-violet-200 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-violet-600 animate-pulse" />
            <span className="text-sm text-gray-900">Aura réfléchit...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}