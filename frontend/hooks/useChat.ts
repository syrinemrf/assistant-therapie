'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { Message } from '@/types/chat';

export const useChat = (sessionId: string, userId: string) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket || !sessionId) return;

    socket.emit('join_session', { userId, sessionId });

    socket.on('session_history', (history: Message[]) => {
      setMessages(history);
    });

    socket.on('receive_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
    });

    socket.on('error', (error: any) => {
      console.error('Erreur:', error);
      setIsTyping(false);
    });

    return () => {
      socket.off('session_history');
      socket.off('receive_message');
      socket.off('error');
    };
  }, [socket, sessionId, userId]);

  const sendMessage = useCallback((content: string) => {
    if (!socket || !content.trim() || !sessionId) {
      console.warn('Cannot send message: missing socket, content, or sessionId');
      return;
    }

    socket.emit('send_message', {
      message: content,
      userId,
      sessionId
    });

    setIsTyping(true);
  }, [socket, userId, sessionId]);

  return {
    messages,
    isTyping,
    isConnected,
    sendMessage
  };
};