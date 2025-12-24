'use client';

import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Paperclip, Mic, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const newRows = Math.min(Math.max(Math.ceil(scrollHeight / 24), 1), 5);
      setRows(newRows);
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      setRows(1);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  };

  return (
    <div className="border-t border-violet-100 bg-white/90 backdrop-blur-xl">
      <div className="p-4 max-w-4xl mx-auto">
        {/* Main Input Area */}
        <div className="flex items-end gap-3">
          {/* Left Actions */}
          <div className="flex items-center gap-1 pb-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-500 hover:text-violet-600 hover:bg-violet-50"
              disabled={disabled}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <motion.div
              animate={{ 
                boxShadow: message.trim() 
                  ? "0 0 0 2px rgba(139, 92, 246, 0.3)" 
                  : "0 0 0 1px rgba(229, 231, 235, 1)"
              }}
              className="rounded-2xl bg-white border border-violet-100 overflow-hidden shadow-sm"
            >
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isRecording ? "Enregistrement en cours..." : "Écris ton message..."}
                disabled={disabled || isRecording}
                rows={rows}
                className="w-full resize-none bg-transparent px-5 py-3 text-sm focus:outline-none disabled:opacity-50 text-gray-900 placeholder:text-gray-400 max-h-32"
                style={{ lineHeight: '1.5rem' }}
              />
            </motion.div>

            {/* Emoji Button (inside input) */}
            <button
              className="absolute right-3 bottom-3 text-gray-400 hover:text-violet-600 transition-colors"
              disabled={disabled}
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          {/* Right Actions - Send/Voice */}
          <div className="flex items-center gap-2 pb-2">
            <AnimatePresence mode="wait">
              {message.trim() ? (
                <motion.div
                  key="send"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <Button
                    onClick={handleSend}
                    disabled={disabled}
                    size="icon"
                    className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="voice"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <Button
                    onClick={toggleRecording}
                    disabled={disabled}
                    size="icon"
                    className={`h-11 w-11 rounded-xl transition-all ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
                        : 'bg-gradient-to-br from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/30'
                    }`}
                  >
                    {isRecording ? (
                      <StopCircle className="w-5 h-5 text-white animate-pulse" />
                    ) : (
                      <Mic className="w-5 h-5 text-white" />
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center justify-between text-xs"
        >
          <p className="text-gray-500">
            <span className="hidden sm:inline">Aura AI ne remplace pas un professionnel de santé mentale • </span>
            <span className="text-violet-600">Conversations privées et sécurisées</span>
          </p>
          
          {message.length > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`font-medium ${
                message.length > 500 
                  ? 'text-red-500' 
                  : message.length > 400 
                  ? 'text-orange-500' 
                  : 'text-gray-400'
              }`}
            >
              {message.length}/1000
            </motion.span>
          )}
        </motion.div>
      </div>
    </div>
  );
}