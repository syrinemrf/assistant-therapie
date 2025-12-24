'use client';

import { useState } from 'react';

const moods = [
  { emoji: '😊', label: 'Joyeux', value: 'joyeux', color: 'from-yellow-400 to-orange-400' },
  { emoji: '😢', label: 'Triste', value: 'triste', color: 'from-blue-400 to-indigo-400' },
  { emoji: '😰', label: 'Anxieux', value: 'anxieux', color: 'from-purple-400 to-pink-400' },
  { emoji: '😠', label: 'En colère', value: 'colere', color: 'from-red-400 to-rose-400' },
  { emoji: '😐', label: 'Neutre', value: 'neutre', color: 'from-gray-400 to-slate-400' },
  { emoji: '😕', label: 'Confus', value: 'confus', color: 'from-teal-400 to-cyan-400' },
];

interface MoodSelectorProps {
  onSelect: (mood: string) => void;
}

export default function MoodSelector({ onSelect }: MoodSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    setTimeout(() => onSelect(value), 300);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
      <h3 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
        Comment te sens-tu aujourd'hui ?
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
        Sélectionne l'émotion qui te correspond le mieux
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleSelect(mood.value)}
            className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
              selected === mood.value
                ? `border-violet-500 bg-gradient-to-br ${mood.color} shadow-lg`
                : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
            }`}
          >
            <div className="text-5xl mb-3">{mood.emoji}</div>
            <div className={`text-sm font-semibold ${
              selected === mood.value ? 'text-white' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {mood.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}