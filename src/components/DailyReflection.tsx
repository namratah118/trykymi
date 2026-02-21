import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Modal from './ui/Modal';

interface DailyReflectionProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
}

export default function DailyReflection({ isOpen, userId, onClose }: DailyReflectionProps) {
  const [mood, setMood] = useState('okay');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    await supabase.from('daily_checkins').upsert({
      user_id: userId,
      checkin_date: today,
      mood,
      message,
      ai_response: `Great reflection! You've captured your day as "${mood}". Keep building momentum tomorrow.`
    }, { onConflict: 'user_id,checkin_date' });

    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#0A3323' }}>How was your day?</h2>

        <div className="space-y-4">
          <div className="flex gap-3">
            {['bad', 'okay', 'good'].map(m => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  mood === m
                    ? 'text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                style={mood === m ? { background: '#2F5D50' } : {}}
              >
                {m === 'bad' ? '😔' : m === 'okay' ? '😐' : '😊'} {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Any thoughts about your day? (optional)"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: '#E5D9C3', '--tw-ring-color': '#2F5D50' } as React.CSSProperties}
            rows={4}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: '#2F5D50' }}
          >
            {loading ? 'Saving...' : 'Save Reflection'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
