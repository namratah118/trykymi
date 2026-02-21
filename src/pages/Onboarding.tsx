import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface OnboardingData {
  focus_areas: string[];
  time_wasters: string[];
  main_goal: string;
  day_start_time: string;
  custom_focus: string;
  custom_waster: string;
}

const FOCUS_OPTIONS = [
  { label: 'Career', icon: '💼', value: 'career' },
  { label: 'Fitness', icon: '💪', value: 'fitness' },
  { label: 'Mental health', icon: '🧠', value: 'mental_health' },
  { label: 'Productivity', icon: '⚡', value: 'productivity' },
  { label: 'Sleep', icon: '🌙', value: 'sleep' },
  { label: 'Focus', icon: '🎯', value: 'focus' },
  { label: 'Reduce phone usage', icon: '📵', value: 'phone_usage' },
];

const WASTER_OPTIONS = [
  { label: 'Instagram', icon: '📸', value: 'instagram' },
  { label: 'YouTube', icon: '▶️', value: 'youtube' },
  { label: 'Overthinking', icon: '💭', value: 'overthinking' },
  { label: 'Procrastination', icon: '😅', value: 'procrastination' },
  { label: 'Netflix', icon: '🎬', value: 'netflix' },
];

const TOTAL_STEPS = 4;

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    focus_areas: [],
    time_wasters: [],
    main_goal: '',
    day_start_time: '07:00',
    custom_focus: '',
    custom_waster: '',
  });
  const [saving, setSaving] = useState(false);

  const toggleFocus = (value: string) => {
    setData(d => ({
      ...d,
      focus_areas: d.focus_areas.includes(value)
        ? d.focus_areas.filter(v => v !== value)
        : [...d.focus_areas, value],
    }));
  };

  const toggleWaster = (value: string) => {
    setData(d => ({
      ...d,
      time_wasters: d.time_wasters.includes(value)
        ? d.time_wasters.filter(v => v !== value)
        : [...d.time_wasters, value],
    }));
  };

  const canProceed = () => {
    if (step === 0) return data.focus_areas.length > 0 || data.custom_focus.trim().length > 0;
    if (step === 1) return data.time_wasters.length > 0 || data.custom_waster.trim().length > 0;
    if (step === 2) return data.main_goal.trim().length > 0;
    if (step === 3) return data.day_start_time.length > 0;
    return false;
  };

  const handleFinish = async () => {
    setSaving(true);
    const focusAreas = [...data.focus_areas];
    if (data.custom_focus.trim()) focusAreas.push(data.custom_focus.trim());
    const timeWasters = [...data.time_wasters];
    if (data.custom_waster.trim()) timeWasters.push(data.custom_waster.trim());

    await supabase.from('users').update({
      onboarding_completed: true,
      focus_areas: focusAreas,
      time_wasters: timeWasters,
      main_goal: data.main_goal,
      day_start_time: data.day_start_time,
    }).eq('id', user!.id);

    navigate('/dashboard');
  };

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: '#0A3323', backgroundAttachment: 'fixed' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8 animate-slide-down">
            <div className="inline-flex items-center mb-5">
              <img src="/image.png" alt="kymi" style={{ height: '36px', objectFit: 'contain' }} />
            </div>
            <p className="text-xs font-body font-semibold uppercase tracking-widest" style={{ color: 'rgba(247,244,213,0.50)' }}>
              Step {step + 1} of {TOTAL_STEPS}
            </p>
          </div>

          <div className="w-full rounded-full h-1.5 mb-8" style={{ background: 'rgba(247,244,213,0.14)' }}>
            <div
              className="h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: '#D3968C' }}
            />
          </div>

          <div
            className="rounded-3xl p-8 animate-scale-in"
            style={{
              background: 'rgba(247,244,213,0.05)',
              border: '1px solid rgba(247,244,213,0.10)',
            }}
            key={step}
          >
            {step === 0 && (
              <>
                <div className="mb-6">
                  <h2 className="font-heading text-2xl font-semibold mb-2" style={{ color: '#F7F4D5' }}>
                    What areas of your life do you want to improve?
                  </h2>
                  <p className="text-sm font-body leading-relaxed" style={{ color: 'rgba(247,244,213,0.60)' }}>
                    Kymi will personalize your entire experience around these goals.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {FOCUS_OPTIONS.map((option) => {
                    const selected = data.focus_areas.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => toggleFocus(option.value)}
                        className="flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all duration-200"
                        style={selected
                          ? { background: 'rgba(211,150,140,0.20)', border: '2px solid rgba(211,150,140,0.50)' }
                          : { background: 'rgba(247,244,213,0.04)', border: '2px solid rgba(247,244,213,0.10)' }
                        }
                      >
                        <span className="text-base flex-shrink-0">{option.icon}</span>
                        <span className="text-sm font-body font-medium flex-1" style={{ color: selected ? '#D3968C' : 'rgba(247,244,213,0.80)' }}>{option.label}</span>
                        <div
                          className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                          style={selected
                            ? { borderColor: '#D3968C', background: '#D3968C' }
                            : { borderColor: 'rgba(247,244,213,0.25)', background: 'transparent' }
                          }
                        >
                          {selected && <Check className="w-3 h-3" style={{ color: '#0A3323' }} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Other (type your own)"
                    value={data.custom_focus}
                    onChange={e => setData(d => ({ ...d, custom_focus: e.target.value }))}
                  />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="mb-6">
                  <h2 className="font-heading text-2xl font-semibold mb-2" style={{ color: '#F7F4D5' }}>
                    Where do you lose most of your time?
                  </h2>
                  <p className="text-sm font-body leading-relaxed" style={{ color: 'rgba(247,244,213,0.60)' }}>
                    Kymi will help you become aware of these patterns and reduce them.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {WASTER_OPTIONS.map((option) => {
                    const selected = data.time_wasters.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => toggleWaster(option.value)}
                        className="flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all duration-200"
                        style={selected
                          ? { background: 'rgba(211,150,140,0.15)', border: '2px solid rgba(211,150,140,0.30)' }
                          : { background: 'rgba(247,244,213,0.04)', border: '2px solid rgba(247,244,213,0.10)' }
                        }
                      >
                        <span className="text-base flex-shrink-0">{option.icon}</span>
                        <span className="text-sm font-body font-medium flex-1" style={{ color: selected ? '#D3968C' : 'rgba(247,244,213,0.80)' }}>{option.label}</span>
                        <div
                          className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                          style={selected
                            ? { borderColor: '#D3968C', background: '#D3968C' }
                            : { borderColor: 'rgba(247,244,213,0.25)', background: 'transparent' }
                          }
                        >
                          {selected && <Check className="w-3 h-3" style={{ color: '#0A3323' }} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Other (type your own)"
                    value={data.custom_waster}
                    onChange={e => setData(d => ({ ...d, custom_waster: e.target.value }))}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-6">
                  <h2 className="font-heading text-2xl font-semibold mb-2" style={{ color: '#F7F4D5' }}>
                    What is your main goal right now?
                  </h2>
                  <p className="text-sm font-body leading-relaxed" style={{ color: 'rgba(247,244,213,0.60)' }}>
                    This is your north star. Kymi uses this to guide everything you do.
                  </p>
                </div>
                <textarea
                  className="input-field resize-none h-36 text-base leading-relaxed"
                  placeholder="e.g. Build a morning routine and stop wasting time on social media so I can focus on my passion project"
                  value={data.main_goal}
                  onChange={e => setData(d => ({ ...d, main_goal: e.target.value }))}
                  autoFocus
                />
                <p className="text-xs font-body mt-2" style={{ color: 'rgba(247,244,213,0.45)' }}>
                  Be specific — the more detail you give, the better Kymi can guide you.
                </p>
              </>
            )}

            {step === 3 && (
              <>
                <div className="mb-6">
                  <h2 className="font-heading text-2xl font-semibold mb-2" style={{ color: '#F7F4D5' }}>
                    What time does your day start?
                  </h2>
                  <p className="text-sm font-body leading-relaxed" style={{ color: 'rgba(247,244,213,0.60)' }}>
                    Kymi will schedule reminders and plans around your natural rhythm.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-4 py-4">
                  <input
                    type="time"
                    className="input-field text-center text-2xl font-heading font-semibold py-4"
                    value={data.day_start_time}
                    onChange={e => setData(d => ({ ...d, day_start_time: e.target.value }))}
                    autoFocus
                  />
                  <div className="grid grid-cols-3 gap-2 w-full mt-2">
                    {[{ label: 'Early bird', time: '05:00' }, { label: 'Morning', time: '07:00' }, { label: 'Mid-morning', time: '09:00' }].map(opt => (
                      <button
                        key={opt.time}
                        onClick={() => setData(d => ({ ...d, day_start_time: opt.time }))}
                        className="py-2 px-3 rounded-xl text-sm font-body font-medium transition-all"
                        style={data.day_start_time === opt.time
                          ? { background: 'rgba(211,150,140,0.20)', border: '2px solid rgba(211,150,140,0.50)', color: '#D3968C' }
                          : { background: 'rgba(247,244,213,0.04)', border: '2px solid rgba(247,244,213,0.10)', color: 'rgba(247,244,213,0.65)' }
                        }
                      >
                        {opt.label}
                        <div className="text-xs mt-0.5 opacity-70">{opt.time}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center gap-3 mt-8">
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="btn-ghost flex items-center gap-2 px-4 py-2.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                onClick={step === TOTAL_STEPS - 1 ? handleFinish : () => setStep(s => s + 1)}
                disabled={!canProceed() || saving}
                className="btn-sage flex-1"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="rounded-full animate-spin"
                      style={{ width: '16px', height: '16px', display: 'inline-block', border: '2px solid rgba(10,51,35,0.30)', borderTopColor: '#0A3323' }}
                    />
                    Setting up your Kymi...
                  </span>
                ) : step === TOTAL_STEPS - 1 ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Start my journey
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

          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={i === step
                  ? { width: '24px', height: '8px', background: '#D3968C' }
                  : i < step
                  ? { width: '8px', height: '8px', background: 'rgba(211,150,140,0.50)' }
                  : { width: '8px', height: '8px', background: 'rgba(247,244,213,0.18)' }
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
