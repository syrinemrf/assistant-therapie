'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { Brain, Sparkles, Heart, MessageCircle } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

export default function MessageList({ messages, isTyping }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-6 relative z-10 min-h-0">
      {messages.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center h-full text-center px-4"
        >
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative mb-8"
          >
            <div className="relative w-24 h-24">
              {/* Glow effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-br from-violet-400 to-purple-600 rounded-3xl blur-xl"
              />
              
              {/* Main icon */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Brain className="w-12 h-12 text-white" />
              </div>
              
              {/* Floating sparkles */}
              <motion.div
                animate={{ 
                  y: [-5, 5, -5],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-6 h-6 text-violet-500" />
              </motion.div>
            </div>
          </motion.div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-4 max-w-md"
          >
            <h3 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Bienvenue sur Aura
            </h3>
            
            <p className="text-gray-600 leading-relaxed text-lg">
              Je suis là pour t'écouter avec empathie et t'accompagner. 
              <br />
              Comment te sens-tu aujourd'hui ? 💜
            </p>
          </motion.div>

          {/* Quick starters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 space-y-3 w-full max-w-md"
          >
            <p className="text-sm text-gray-500 mb-4">Suggestions pour commencer :</p>
            
            <div className="grid gap-3">
              {[
                { icon: Heart, text: "Je me sens un peu anxieux/anxieuse", color: "rose" },
                { icon: MessageCircle, text: "J'ai besoin de parler", color: "blue" },
                { icon: Sparkles, text: "Je veux me sentir mieux", color: "violet" }
              ].map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:border-${suggestion.color}-300 hover:shadow-md transition-all group text-left`}
                >
                  <div className={`p-2 rounded-lg bg-${suggestion.color}-100 group-hover:bg-${suggestion.color}-200 transition-colors`}>
                    <suggestion.icon className={`w-4 h-4 text-${suggestion.color}-600`} />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {suggestion.text}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {messages.map((message, index) => (
            <MessageBubble 
              key={message._id || index} 
              message={message} 
              isLast={index === messages.length - 1}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}