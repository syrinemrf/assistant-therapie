'use client';

import { motion } from 'framer-motion';
import { Message } from '@/types/chat';
import { formatTime } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { User, BrainCircuit, Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isLast?: boolean;
}

export default function MessageBubble({ message, isLast = false }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}
    >
      <div className={`flex items-end gap-3 max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
            isUser 
              ? 'bg-gradient-to-br from-violet-600 to-purple-600' 
              : 'bg-gradient-to-br from-indigo-500 to-purple-500'
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <BrainCircuit className="w-5 h-5 text-white" />
          )}
        </motion.div>

        {/* Message Content */}
        <div className="flex flex-col gap-1">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15 }}
            className={`relative rounded-2xl px-5 py-3 shadow-md ${
              isUser 
                ? 'bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-br-md' 
                : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
            }`}
          >
            {/* Message text */}
            <div className={`prose prose-sm max-w-none ${
              isUser 
                ? 'prose-invert [&>*]:text-white' 
                : ''
            }`}>
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="my-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="my-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  code: ({ children }) => (
                    <code className={`px-1.5 py-0.5 rounded text-xs ${
                      isUser 
                        ? 'bg-white/20' 
                        : 'bg-gray-100'
                    }`}>
                      {children}
                    </code>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {/* Decorative corner */}
            {!isUser && (
              <div className="absolute -left-1 bottom-0 w-4 h-4 bg-white transform rotate-45 -z-10" />
            )}
            {isUser && (
              <div className="absolute -right-1 bottom-0 w-4 h-4 bg-gradient-to-br from-violet-600 to-purple-600 transform rotate-45 -z-10" />
            )}
          </motion.div>

          {/* Timestamp and status */}
          <div className={`flex items-center gap-1 px-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500">
              {formatTime(message.timestamp)}
            </span>
            {isUser && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {isLast ? (
                  <CheckCheck className="w-3.5 h-3.5 text-violet-600" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-gray-400" />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}