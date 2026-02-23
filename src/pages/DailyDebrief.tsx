import { useState, FormEvent } from 'react';
import { Moon, Sparkles, CheckCircle2, TrendingDown, TrendingUp, RotateCcw } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ExtractedEntry {
  type: 'lost' | 'won';
  activity: string;
  duration_minutes: number;
}

interface DebriefResult {
  summary: string;
  entries: ExtractedEntry[];
}

const MOODS = [
  { label: 'Happy', emoji: '😊', value: 'happy' },
  { label: 'Productive', emoji: '⚡', value: 'productive' },
  { label: 'Stressed', emoji: '😰', value: 'stressed' },
  { label: 'Tired', emoji: '😴', value: 'tired' },
  { label: 'Low', emoji: '😔', value: 'low' },
];

export default function DailyDebrief() {
  const { user } = useAuth();
  const [mood, setMood] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DebriefResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'mood' | 'text' | 'result'>('mood');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setSaved(false);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const { data: { session } } = await supabase.auth.getSession();

      const moodContext = mood ? `My mood today: ${mood}. ` : '';

      const response = await fetch(`${supabaseUrl}/functions/v1/ai-assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token || supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'debrief',
          message: moodContext + text,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.debrief) {
          setResult(data.debrief);
          setStep('result');
        } else {
          setError('TryKymi AI is getting ready for you.');
        }
      } else {
        setError('TryKymi AI is getting ready for you.');
      }
    } catch {
      setError('TryKymi AI is getting ready for you.');
    }

    setLoading(false);
  };

  const saveEntries = async () => {
    if (!result || !user) return;

    const inserts = result.entries.map(entry => ({
      user_id: user.id,
      type: entry.type,
      activity: entry.activity,
      duration_minutes: entry.duration_minutes,
      entry_date: today,
    }));

    await supabase.from('time_entries').insert(inserts);
    setSaved(true);
  };

  const reset = () => {
    setText('');
    setMood('');
    setResult(null);
    setSaved(false);
    setError('');
    setStep('mood');
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const totalWon = result?.entries.filter(e => e.type === 'won').reduce((s, e) => s + e.duration_minutes, 0) || 0;
  const totalLost = result?.entries.filter(e => e.type === 'lost').reduce((s, e) => s + e.duration_minutes, 0) || 0;

  return (
    <AppLayout title="Daily Debrief" subtitle={todayFormatted}>
      <div className="max-w-2xl mx-auto space-y-5">

        <div className="card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl" style={{ background: 'rgba(211,150,140,0.10)' }} />
          <div className="flex items-start gap-4 relative">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(211,150,140,0.15)', border: '1px solid rgba(211,150,140,0.25)' }}
            >
              <Moon className="w-5 h-5" style={{ color: '#D3968C' }} />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold mb-1" style={{ color: '#F7F4D5' }}>How was your day?</h2>
              <p className="text-sm font-body" style={{ color: 'rgba(247,244,213,0.60)' }}>
                Tell Kymi about your day in plain language. AI will extract time data, calculate your life score, and give you insights.
              </p>
            </div>
          </div>
        </div>

        {step === 'mood' && (
          <div className="card animate-scale-in">
            <h3 className="font-heading text-base font-semibold mb-4" style={{ color: '#F7F4D5' }}>How do you feel right now?</h3>
            <div className="grid grid-cols-5 gap-3 mb-6">
              {MOODS.map(m => (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className="flex flex-col items-center gap-2 p-3 transition-all duration-200"
                  style={mood === m.value
                    ? { background: 'rgba(211,150,140,0.15)', border: '2px solid rgba(211,150,140,0.40)', borderRadius: '14px' }
                    : { background: 'rgba(247,244,213,0.04)', border: '2px solid rgba(247,244,213,0.08)', borderRadius: '14px' }
                  }
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-xs font-body font-medium" style={{ color: 'rgba(247,244,213,0.75)' }}>{m.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep('text')}
              className="btn-sage w-full"
              disabled={!mood}
            >
              Continue
            </button>
            <button onClick={() => setStep('text')} className="btn-ghost w-full mt-2 text-xs" style={{ color: 'rgba(247,244,213,0.45)' }}>
              Skip and continue
            </button>
          </div>
        )}

        {step === 'text' && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-scale-in">
            {mood && (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ background: 'rgba(211,150,140,0.12)', border: '1px solid rgba(211,150,140,0.20)' }}
              >
                <span className="text-base">{MOODS.find(m => m.value === mood)?.emoji}</span>
                <span className="text-sm font-body" style={{ color: 'rgba(247,244,213,0.80)' }}>
                  Feeling <strong style={{ color: '#D3968C' }}>{MOODS.find(m => m.value === mood)?.label}</strong> today
                </span>
              </div>
            )}

            <div className="card p-0 overflow-hidden">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                className="w-full p-5 font-body text-sm resize-none focus:outline-none min-h-[220px]"
                style={{
                  background: '#105666',
                  color: '#F7F4D5',
                  border: 'none',
                }}
                placeholder="Tell me about your day... What did you accomplish? What distracted you? Any wins or setbacks?&#10;&#10;e.g. I spent 2 hours on deep work this morning, finished the project report. But lost about 1.5 hours scrolling Instagram. Had a great workout (45 min) and did 1 hour of reading..."
                autoFocus
              />
              {error && (
                <div
                  className="px-5 pb-4 text-sm font-body"
                  style={{ color: '#D3968C', background: 'rgba(211,150,140,0.12)', borderTop: '1px solid rgba(211,150,140,0.18)' }}
                >
                  {error}
                </div>
              )}
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderTop: '1px solid rgba(247,244,213,0.08)', background: 'rgba(247,244,213,0.03)' }}
              >
                <p className="text-xs font-body" style={{ color: 'rgba(247,244,213,0.40)' }}>{text.length} characters</p>
                <button
                  type="submit"
                  disabled={loading || !text.trim()}
                  className="btn-primary py-2 px-5 text-sm"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span
                        className="rounded-full animate-spin"
                        style={{ width: '16px', height: '16px', display: 'inline-block', border: '2px solid rgba(10,51,35,0.30)', borderTopColor: '#0A3323' }}
                      />
                      Kymi is analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Analyze with Kymi
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="font-heading text-sm font-semibold mb-3" style={{ color: '#F7F4D5' }}>Example prompts</h3>
              <div className="space-y-2">
                {[
                  "I had a productive morning — 2 hours of focused coding. But wasted 1.5h on social media after lunch...",
                  "Completed the presentation, had 3 meetings (2 unnecessary). 30 min workout. Lost 2h to Netflix.",
                  "Great day overall! Deep work 3 hours, gym 1 hour. Only wasted 30 min on mindless scrolling.",
                ].map((example, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setText(example)}
                    className="w-full text-left px-3 py-2.5 rounded-xl transition-all text-xs font-body"
                    style={{ background: 'rgba(247,244,213,0.04)', border: '1px solid rgba(247,244,213,0.08)', color: 'rgba(247,244,213,0.65)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(211,150,140,0.08)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(211,150,140,0.20)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(247,244,213,0.04)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(247,244,213,0.08)';
                    }}
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {step === 'result' && result && (
          <div className="space-y-4 animate-fade-in">
            <div
              className="card relative overflow-hidden"
              style={{ background: 'rgba(247,244,213,0.05)' }}
            >
              <div className="absolute right-0 top-0 w-32 h-32 rounded-full blur-2xl" style={{ background: 'rgba(247,244,213,0.05)' }} />
              <div className="relative flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(211,150,140,0.20)' }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: '#D3968C' }} />
                </div>
                <div>
                  <p className="text-xs font-body font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(247,244,213,0.50)' }}>Kymi's Summary</p>
                  <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(247,244,213,0.90)' }}>{result.summary}</p>
                </div>
              </div>
            </div>

            {result.entries.length > 0 && (
              <div className="card">
                <h3 className="font-heading text-base font-semibold mb-4" style={{ color: '#F7F4D5' }}>Time Intelligence</h3>
                <div className="space-y-2 mb-5">
                  {result.entries.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3.5 rounded-xl"
                      style={entry.type === 'won'
                        ? { background: 'rgba(131,153,88,0.15)', border: '1px solid rgba(131,153,88,0.25)' }
                        : { background: 'rgba(211,150,140,0.15)', border: '1px solid rgba(211,150,140,0.20)' }
                      }
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={entry.type === 'won'
                          ? { background: 'rgba(131,153,88,0.20)', color: '#839958' }
                          : { background: 'rgba(211,150,140,0.18)', color: '#D3968C' }
                        }
                      >
                        {entry.type === 'won'
                          ? <TrendingUp style={{ width: '18px', height: '18px' }} />
                          : <TrendingDown style={{ width: '18px', height: '18px' }} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-body font-semibold" style={{ color: '#F7F4D5' }}>{entry.activity}</p>
                        <p
                          className="text-xs font-body"
                          style={{ color: entry.type === 'won' ? '#839958' : '#D3968C' }}
                        >
                          {entry.type === 'won' ? 'Time Won' : 'Time Lost'} &middot; {Math.floor(entry.duration_minutes / 60) > 0 ? `${Math.floor(entry.duration_minutes / 60)}h ` : ''}{entry.duration_minutes % 60}m
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="grid grid-cols-2 gap-3 p-4 rounded-xl mb-4"
                  style={{ background: 'rgba(247,244,213,0.04)' }}
                >
                  <div>
                    <p className="text-xs font-body mb-1" style={{ color: 'rgba(247,244,213,0.45)' }}>Total Won</p>
                    <p className="font-heading text-xl font-semibold" style={{ color: '#839958' }}>
                      {Math.floor(totalWon / 60)}h {totalWon % 60}m
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-body mb-1" style={{ color: 'rgba(247,244,213,0.45)' }}>Total Lost</p>
                    <p className="font-heading text-xl font-semibold" style={{ color: '#D3968C' }}>
                      {Math.floor(totalLost / 60)}h {totalLost % 60}m
                    </p>
                  </div>
                </div>

                {saved ? (
                  <div
                    className="flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-body font-semibold"
                    style={{ background: 'rgba(131,153,88,0.15)', color: '#839958' }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Saved to your dashboard!
                  </div>
                ) : (
                  <button onClick={saveEntries} className="btn-sage w-full">
                    <CheckCircle2 className="w-4 h-4" />
                    Save to Dashboard
                  </button>
                )}
              </div>
            )}

            <button
              onClick={reset}
              className="btn-ghost w-full"
              style={{ border: '1px solid rgba(247,244,213,0.10)' }}
            >
              <RotateCcw className="w-4 h-4" />
              New debrief
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
