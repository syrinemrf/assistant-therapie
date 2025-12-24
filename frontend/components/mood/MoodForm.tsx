'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { createActivity } from '@/lib/api/activities';
import { Loader2 } from 'lucide-react';

interface MoodFormProps {
  userId: string;
  onSuccess?: () => void;
}

const moodEmojis = [
  { value: 0, label: '😔', text: 'Very Low' },
  { value: 25, label: '😕', text: 'Low' },
  { value: 50, label: '😐', text: 'Neutral' },
  { value: 75, label: '🙂', text: 'Good' },
  { value: 100, label: '😊', text: 'Great' },
];

export function MoodForm({ userId, onSuccess }: MoodFormProps) {
  const [mood, setMood] = useState(50);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentMood = moodEmojis.reduce((prev, curr) =>
    Math.abs(curr.value - mood) < Math.abs(prev.value - mood) ? curr : prev
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createActivity({
        userId,
        type: 'mood',
        name: 'Mood Check',
        moodScore: mood,
        moodNote: note,
      });

      setNote('');
      setMood(50);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl">{currentMood.label}</div>
        <p className="text-lg font-medium">{currentMood.text}</p>
      </div>

      <div className="space-y-2">
        <Slider
          value={[mood]}
          onValueChange={(value) => setMood(value[0])}
          min={0}
          max={100}
          step={1}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground px-2">
          {moodEmojis.map((m) => (
            <span key={m.value}>{m.label}</span>
          ))}
        </div>
      </div>

      <div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How are you feeling? (optional)"
          className="w-full p-3 rounded-lg border bg-background resize-none"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Mood'
        )}
      </Button>
    </form>
  );
}
