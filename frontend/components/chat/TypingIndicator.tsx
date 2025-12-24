'use client';

import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-end gap-3 mb-6"
    >
      {/* Avatar */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg"
      >
        <BrainCircuit className="w-5 h-5 text-white" />
      </motion.div>

      {/* Typing Animation */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md px-6 py-4 shadow-md border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                y: [-2, -8, -2],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              className="w-2.5 h-2.5 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full"
            />
          ))}
        </div>
        
        {/* Decorative corner */}
        <div className="absolute -left-1 bottom-0 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 -z-10" />
      </div>
    </motion.div>
  );
}