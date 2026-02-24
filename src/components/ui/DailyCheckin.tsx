import { useState } from 'react';
import { X, ArrowRight, Loader, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface DailyCheckinProps {
  onClose: () => void;
  onComplete: () => void;
}

type Step = {
  id: string;
  question: string;
  subtext: string;
  options: { value: string; label: string; icon?: string }[];
  multi?: boolean;
};

const STEPS: Step[] = [
  {
    id: 'priority',
    question: 'What matters most today?',
    subtext: 'Choose everything that feels true right now.',
    multi: true,
    options: [
      { value: 'career', label: 'Career' },
      { value: 'health', label: 'Health' },
      { value: 'peace', label: 'Peace' },
      { value: 'growth', label: 'Growth' },
      { value: 'relationships', label: 'Relationships' },
      { value: 'creativity', label: 'Creativity' },
      { value: 'finances', label: 'Finances' },
      { value: 'family', label: 'Family' },
    ],
  },
  {
    id: 'energy',
    question: 'How is your energy right now?',
    subtext: 'Be honest — this helps Kymi plan your day better.',
    options: [
      { value: 'low', label: 'Low', icon: '🔋' },
      { value: 'medium', label: 'Medium', icon: '⚡' },
      { value: 'high', label: 'High', icon: '🔥' },
    ],
  },
  {
    id: 'mood',
    question: 'How are you feeling?',
    subtext: 'There are no wrong answers here.',
    options: [
      { value: 'calm', label: 'Calm', icon: '😌' },
      { value: 'happy', label: 'Happy', icon: '😊' },
      { value: 'focused', label: 'Focused', icon: '🎯' },
      { value: 'anxious', label: 'Anxious', icon: '😟' },
      { value: 'stressed', label: 'Stressed', icon: '😰' },
      { value: 'tired', label: 'Tired', icon: '😴' },
    ],
  },
  {
    id: 'sleep',
    question: 'How did you sleep?',
    subtext: 'Sleep shapes everything. Let Kymi adapt your day.',
    options: [
      { value: 'poor', label: 'Poor', icon: '😣' },
      { value: 'okay', label: 'Okay', icon: '😐' },
      { value: 'good', label: 'Good', icon: '😴' },
      { value: 'great', label: 'Great', icon: '✨' },
    ],
  },
];

const scoreMap: Record<string, number> = {
  calm: 78, happy: 85, focused: 90, anxious: 42, stressed: 35, tired: 48,
};
const energyBoost: Record<string, number> = { low: -15, medium: 0, high: 10 };
const sleepBoost: Record<string, number> = { poor: -15, okay: 0, good: 8, great: 12 };

export default function DailyCheckin({ onClose, onComplete }: DailyCheckinProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ message: string; score: number } | null>(null);

  const currentStep = STEPS[step];
  const isMulti = !!currentStep.multi;
  const currentAnswer = answers[currentStep.id];
  const selected: string[] = isMulti
    ? (currentAnswer as string[] | undefined) || []
    : currentAnswer ? [currentAnswer as string] : [];

  const canAdvance = selected.length > 0;

  const toggle = (value: string) => {
    if (isMulti) {
      const arr = (answers[currentStep.id] as string[] | undefined) || [];
      setAnswers(prev => ({
        ...prev,
        [currentStep.id]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      }));
    } else {
      setAnswers(prev => ({ ...prev, [currentStep.id]: value }));
    }
  };

  const next = async () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
      return;
    }
    await submit();
  };

  const submit = async () => {
    setLoading(true);
    const mood = answers.mood as string || 'calm';
    const energy = answers.energy as string || 'medium';
    const sleep = answers.sleep as string || 'okay';
    const priorities = answers.priority as string[] || [];

    const base = scoreMap[mood] ?? 65;
    const score = Math.max(10, Math.min(100, base + (energyBoost[energy] ?? 0) + (sleepBoost[sleep] ?? 0)));
    const timeLost = mood === 'stressed' ? 120 : mood === 'anxious' ? 90 : mood === 'tired' ? 75 : 30;

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const prompt = `Daily check-in for someone feeling ${mood}, energy is ${energy}, sleep was ${sleep}, priorities today: ${priorities.join(', ')}.
Write a warm 2-sentence personal message: first acknowledge how they feel, then offer one gentle, specific suggestion for today. Speak directly to them. No emojis. Be human.`;

      const res = await fetch(`${supabaseUrl}/functions/v1/ai-assistant`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${supabaseAnonKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', message: prompt, history: [] }),
      });

      const data = await res.json();
      const aiMessage = data.message || 'Today is a new opportunity. Take it one step at a time.';

      await supabase.from('daily_checkins').upsert({
        user_id: user!.id,
        checkin_date: new Date().toISOString().split('T')[0],
        mood,
        message: JSON.stringify({ priorities, energy, sleep }),
        ai_response: aiMessage,
        productivity_score: score,
        time_lost_minutes: timeLost,
      }, { onConflict: 'user_id,checkin_date' });

      setResult({ message: aiMessage, score });
    } catch {
      setResult({ message: 'Today is yours. Make it count.', score });
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
        style={{ cursor: result ? 'default' : 'pointer' }}
        onClick={result ? undefined : onClose}
      />

      <div className="relative w-full sm:max-w-lg sm:mx-4 overflow-hidden animate-slide-up shadow-modal sm:rounded-3xl" style={{ maxHeight: '95vh', background: '#F7F4D5' }}>
        <div className="h-0.5 w-full" style={{ background: 'rgba(131,153,88,0.15)' }}>
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{ width: `${result ? 100 : progress}%`, background: '#839958' }}
          />
        </div>

        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(131,153,88,0.15)' }}>
              <Sparkles className="w-3.5 h-3.5" style={{ color: '#839958' }} />
            </div>
            <span className="text-sm font-body font-semibold" style={{ color: '#0A3323' }}>Daily check-in</span>
          </div>
          <div className="flex items-center gap-3">
            {!result && (
              <span className="section-label">{step + 1} of {STEPS.length}</span>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-text-muted" />
            </button>
          </div>
        </div>

        <div className="px-6 pb-8" style={{ overflowY: 'auto', maxHeight: 'calc(95vh - 80px)' }}>
          {!result ? (
            <div className="animate-fade-in">
              <div className="mb-7">
                <h2 className="font-heading text-2xl font-semibold mb-2" style={{ letterSpacing: '-0.025em', color: '#111827' }}>
                  {currentStep.question}
                </h2>
                <p className="text-sm font-body" style={{ color: '#6B7280' }}>{currentStep.subtext}</p>
              </div>

              <div className={`grid gap-2.5 mb-8 ${currentStep.options.length <= 3 ? 'grid-cols-3' : currentStep.options.length <= 4 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                {currentStep.options.map((opt) => {
                  const isSelected = selected.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggle(opt.value)}
                      className="relative flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-2xl border-2 text-sm font-body font-medium transition-all duration-150 active:scale-95"
                      style={{
                        background: isSelected ? '#839958' : '#F7F4D5',
                        borderColor: isSelected ? '#839958' : 'rgba(131,153,88,0.20)',
                        color: isSelected ? '#FFFFFF' : '#374151',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {opt.icon && (
                        <span className="text-xl leading-none">{opt.icon}</span>
                      )}
                      <span className={opt.icon ? 'text-xs' : 'text-sm'}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 items-center">
                {step > 0 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="w-10 h-10 rounded-xl border flex items-center justify-center transition-colors flex-shrink-0"
                    style={{ borderColor: 'rgba(131,153,88,0.20)', color: '#839958' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(131,153,88,0.08)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                )}
                <button
                  onClick={next}
                  disabled={!canAdvance || loading}
                  className="btn-primary flex-1 py-3"
                  style={{ color: '#839958' }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Kymi is reflecting...
                    </span>
                  ) : step === STEPS.length - 1 ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      See Kymi's reflection
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(131,153,88,0.15)" strokeWidth="6" />
                    <circle
                      cx="40" cy="40" r="32" fill="none"
                      stroke={result.score >= 70 ? '#839958' : result.score >= 45 ? '#D3968C' : '#D3968C'}
                      strokeWidth="6"
                      strokeDasharray={`${(result.score / 100) * 2 * Math.PI * 32} ${2 * Math.PI * 32}`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading text-xl font-semibold" style={{ letterSpacing: '-0.03em', color: '#839958' }}>{result.score}</span>
                  </div>
                </div>
                <div>
                  <p className="section-label mb-1" style={{ color: '#839958' }}>Today's readiness score</p>
                  <p className="font-heading text-2xl font-semibold" style={{ letterSpacing: '-0.025em', color: '#839958' }}>
                    {result.score >= 70 ? 'You\'re ready' : result.score >= 45 ? 'Steady start' : 'Be gentle today'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(131,153,88,0.10)', border: '1px solid rgba(131,153,88,0.20)' }}>
                <p className="text-sm font-body leading-relaxed" style={{ fontStyle: 'italic', color: '#839958' }}>
                  "{result.message}"
                </p>
                <p className="text-xs font-body mt-3 font-semibold" style={{ color: '#839958' }}>— Kymi</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-6">
                {[
                  { label: 'Focus', value: answers.priority ? (answers.priority as string[]).slice(0, 2).join(', ') : '—' },
                  { label: 'Mood', value: answers.mood as string || '—' },
                  { label: 'Energy', value: answers.energy as string || '—' },
                  { label: 'Sleep', value: answers.sleep as string || '—' },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl px-4 py-3" style={{ background: 'rgba(131,153,88,0.08)', border: '1px solid rgba(131,153,88,0.15)' }}>
                    <p className="section-label mb-1" style={{ color: '#839958' }}>{item.label}</p>
                    <p className="text-sm font-body font-semibold" style={{ color: '#839958' }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <button onClick={onComplete} className="btn-primary w-full py-3" style={{ color: '#839958' }}>
                Start my day
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
