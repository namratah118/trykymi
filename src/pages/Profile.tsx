import { useEffect, useState, FormEvent } from 'react';
import { User, Target, Clock, Zap, Save, CheckCircle2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const FOCUS_AREAS = [
  { value: 'productivity', label: 'Productivity' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'mental_health', label: 'Mental Health' },
  { value: 'career', label: 'Career Growth' },
  { value: 'routine', label: 'Daily Routine' },
];

const TIME_WASTERS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'netflix', label: 'Netflix' },
  { value: 'scrolling', label: 'Mindless Scrolling' },
  { value: 'procrastination', label: 'Procrastination' },
  { value: 'meetings', label: 'Unproductive Meetings' },
];

const REMINDER_TIMES = [
  { value: '07:00', label: '7:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '18:00', label: '6:00 PM' },
  { value: '21:00', label: '9:00 PM' },
];

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [timeWasters, setTimeWasters] = useState<string[]>([]);
  const [reminderTimes, setReminderTimes] = useState<string[]>([]);
  const [mainGoal, setMainGoal] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('users')
      .select('focus_areas, time_wasters, reminder_times, main_goal')
      .eq('id', user!.id)
      .maybeSingle();

    if (data) {
      setFocusAreas(data.focus_areas || []);
      setTimeWasters(data.time_wasters || []);
      setReminderTimes(data.reminder_times || []);
      setMainGoal(data.main_goal || '');
    }
    setLoading(false);
  };

  const toggleItem = (list: string[], setList: (v: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    await supabase.from('users').update({
      focus_areas: focusAreas,
      time_wasters: timeWasters,
      reminder_times: reminderTimes,
      main_goal: mainGoal,
    }).eq('id', user!.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const firstName = (user?.user_metadata?.full_name as string || 'User').split(' ')[0];

  if (loading) return <AppLayout title="Profile"><PageLoader /></AppLayout>;

  return (
    <AppLayout title="Profile">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="card">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center font-heading text-xl font-semibold flex-shrink-0"
              style={{ background: 'rgba(211,150,140,0.20)', color: '#D3968C' }}
            >
              {firstName.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h2 className="font-heading text-xl font-semibold" style={{ color: '#F7F4D5' }}>
                {user?.user_metadata?.full_name as string || 'User'}
              </h2>
              <p className="text-sm font-body" style={{ color: 'rgba(247,244,213,0.60)' }}>{user?.email}</p>
              <p className="text-xs font-body mt-0.5" style={{ color: 'rgba(247,244,213,0.45)' }}>
                Member since {new Date(user?.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4" style={{ color: '#D3968C' }} />
              <h3 className="font-heading text-base font-semibold" style={{ color: '#F7F4D5' }}>Focus Areas</h3>
            </div>
            <p className="text-xs font-body mb-3" style={{ color: 'rgba(247,244,213,0.45)' }}>What areas of your life do you want to improve?</p>
            <div className="flex flex-wrap gap-2">
              {FOCUS_AREAS.map(item => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleItem(focusAreas, setFocusAreas, item.value)}
                  className="px-3 py-1.5 rounded-full text-sm font-body font-medium transition-all"
                  style={focusAreas.includes(item.value)
                    ? { background: '#D3968C', color: '#0A3323', border: '1px solid #D3968C' }
                    : { background: 'transparent', color: 'rgba(247,244,213,0.65)', border: '1px solid #839958' }
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4" style={{ color: '#D3968C' }} />
              <h3 className="font-heading text-base font-semibold" style={{ color: '#F7F4D5' }}>Time Wasters</h3>
            </div>
            <p className="text-xs font-body mb-3" style={{ color: 'rgba(247,244,213,0.45)' }}>What tends to steal your time?</p>
            <div className="flex flex-wrap gap-2">
              {TIME_WASTERS.map(item => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleItem(timeWasters, setTimeWasters, item.value)}
                  className="px-3 py-1.5 rounded-full text-sm font-body font-medium transition-all"
                  style={timeWasters.includes(item.value)
                    ? { background: '#D3968C', color: '#0A3323', border: '1px solid #D3968C' }
                    : { background: 'transparent', color: 'rgba(247,244,213,0.65)', border: '1px solid #839958' }
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4" style={{ color: '#D3968C' }} />
              <h3 className="font-heading text-base font-semibold" style={{ color: '#F7F4D5' }}>Reminder Times</h3>
            </div>
            <p className="text-xs font-body mb-3" style={{ color: 'rgba(247,244,213,0.45)' }}>When would you like Kymi to check in with you?</p>
            <div className="flex flex-wrap gap-2">
              {REMINDER_TIMES.map(item => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleItem(reminderTimes, setReminderTimes, item.value)}
                  className="px-3 py-1.5 rounded-full text-sm font-body font-medium transition-all"
                  style={reminderTimes.includes(item.value)
                    ? { background: '#D3968C', color: '#0A3323', border: '1px solid #D3968C' }
                    : { background: 'transparent', color: 'rgba(247,244,213,0.65)', border: '1px solid #839958' }
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4" style={{ color: '#D3968C' }} />
              <h3 className="font-heading text-base font-semibold" style={{ color: '#F7F4D5' }}>Main Goal</h3>
            </div>
            <p className="text-xs font-body mb-3" style={{ color: 'rgba(247,244,213,0.45)' }}>What's your #1 goal right now?</p>
            <textarea
              className="input-field resize-none h-20"
              placeholder="e.g. Build consistent daily habits and reclaim 2 hours per day from distractions..."
              value={mainGoal}
              onChange={e => setMainGoal(e.target.value)}
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full py-3">
            {saved ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Saved!
              </span>
            ) : saving ? (
              <span className="flex items-center gap-2">
                <span
                  className="rounded-full animate-spin"
                  style={{ width: '16px', height: '16px', display: 'inline-block', border: '2px solid rgba(10,51,35,0.30)', borderTopColor: '#0A3323' }}
                />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Profile
              </span>
            )}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
