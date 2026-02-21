import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Bell, CheckSquare, Target, ArrowRight, Clock,
  Sparkles, Moon, Zap, X, TrendingUp, TrendingDown, Loader
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { PageLoader } from '../components/ui/LoadingSpinner';
import DailyCheckin from '../components/ui/DailyCheckin';
import { PlanIllustration, ReminderIllustration, ChecklistIllustration, HabitIllustration } from '../components/ui/Illustrations';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Plan, Reminder, Task, Habit, TimeEntry } from '../types/database';

interface Stats {
  totalTasks: number;
  completedTasks: number;
  totalHabits: number;
  completedHabitsToday: number;
  upcomingReminders: number;
  todayPlans: number;
  completedPlans: number;
}

const GLASS: React.CSSProperties = {
  background: 'rgba(247,244,213,0.05)',
  border: '1px solid rgba(247,244,213,0.10)',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Good night';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayCompletions, setTodayCompletions] = useState<Set<string>>(new Set());
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0, completedTasks: 0,
    totalHabits: 0, completedHabitsToday: 0,
    upcomingReminders: 0, todayPlans: 0, completedPlans: 0,
  });
  const [showCheckin, setShowCheckin] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [motivationDismissed, setMotivationDismissed] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) return;
    fetchData();
    checkDailyCheckin();
  }, [user]);

  const checkDailyCheckin = async () => {
    const { data } = await supabase
      .from('daily_checkins')
      .select('id')
      .eq('user_id', user!.id)
      .eq('checkin_date', today)
      .maybeSingle();
    if (!data) setTimeout(() => setShowCheckin(true), 800);
  };

  const fetchData = async () => {
    setLoading(true);
    const [plansRes, remindersRes, tasksRes, habitsRes, completionsRes, timeRes] = await Promise.all([
      supabase.from('plans').select('*').eq('user_id', user!.id).eq('plan_date', today).order('start_time'),
      supabase.from('reminders').select('*').eq('user_id', user!.id).eq('completed', false).gte('reminder_date', today).order('reminder_date').limit(5),
      supabase.from('tasks').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }),
      supabase.from('habits').select('*').eq('user_id', user!.id).order('created_at'),
      supabase.from('habit_completions').select('habit_id').eq('user_id', user!.id).eq('completed_date', today),
      supabase.from('time_entries').select('*').eq('user_id', user!.id).eq('entry_date', today),
    ]);

    const todayPlansData = plansRes.data || [];
    const remindersData = remindersRes.data || [];
    const tasksData = tasksRes.data || [];
    const habitsData = habitsRes.data || [];
    const completionsData = completionsRes.data || [];
    const timeData = timeRes.data || [];

    setPlans(todayPlansData);
    setReminders(remindersData);
    setTasks(tasksData.slice(0, 5));
    setHabits(habitsData);
    setTodayCompletions(new Set(completionsData.map(c => c.habit_id)));
    setTimeEntries(timeData);

    const completionSet = new Set(completionsData.map(c => c.habit_id));
    const newStats = {
      totalTasks: tasksData.length,
      completedTasks: tasksData.filter(t => t.completed).length,
      totalHabits: habitsData.length,
      completedHabitsToday: habitsData.filter(h => completionSet.has(h.id)).length,
      upcomingReminders: remindersData.length,
      todayPlans: todayPlansData.length,
      completedPlans: todayPlansData.filter(p => p.completed).length,
    };
    setStats(newStats);
    setLoading(false);
    fetchAiMessage(newStats, habitsData);
  };

  const fetchAiMessage = async (s: Stats, habitsData: Habit[]) => {
    setAiLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY;
      const firstName = (user?.user_metadata?.full_name as string || 'there').split(' ')[0];

      const prompt = `Generate a single warm, personal, encouraging message for ${firstName}'s dashboard. ${getGreeting()} context.
Stats: ${s.completedHabitsToday}/${s.totalHabits} habits done, ${s.completedTasks}/${s.totalTasks} tasks done, ${s.completedPlans}/${s.todayPlans} plans done.
Habits: ${habitsData.map(h => h.name).join(', ') || 'none yet'}.
Write 1-2 sentences. Be warm, human, calm, encouraging. No emojis. Speak directly to them.`;

      const res = await fetch(`${supabaseUrl}/functions/v1/ai-assistant`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', message: prompt, history: [] }),
      });
      const data = await res.json();
      if (data.message) setAiMessage(data.message);
    } catch {
      setAiMessage('');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <AppLayout><PageLoader /></AppLayout>;

  const firstName = (user?.user_metadata?.full_name as string || 'there').split(' ')[0];
  const timeLost = timeEntries.filter(e => e.type === 'lost').reduce((sum, e) => sum + e.duration_minutes, 0);
  const timeWon = timeEntries.filter(e => e.type === 'won').reduce((sum, e) => sum + e.duration_minutes, 0);
  const totalTime = timeLost + timeWon;

  const lifeScore = totalTime > 0
    ? Math.min(100, Math.round((timeWon / totalTime) * 100))
    : (() => {
        const h = stats.totalHabits > 0 ? (stats.completedHabitsToday / stats.totalHabits) * 40 : 0;
        const t = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 30 : 0;
        const p = stats.todayPlans > 0 ? (stats.completedPlans / stats.todayPlans) * 30 : 0;
        return Math.round(h + t + p);
      })();

  const scoreLabel = lifeScore >= 70 ? 'Thriving' : lifeScore >= 40 ? 'Building momentum' : 'Your journey begins';
  const todayFormatted = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const circumference = 2 * Math.PI * 38;
  const strokeDash = `${(lifeScore / 100) * circumference} ${circumference}`;

  return (
    <AppLayout>
      {showCheckin && (
        <DailyCheckin onClose={() => setShowCheckin(false)} onComplete={() => setShowCheckin(false)} />
      )}

      <div className="space-y-5">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 p-7 relative overflow-hidden" style={{ background: 'rgba(247,244,213,0.05)', border: '1px solid rgba(247,244,213,0.10)', borderRadius: '14px' }}>
            <div className="relative z-10">
              <p className="text-sm font-body font-medium mb-1" style={{ color: 'rgba(247,244,213,0.45)' }}>{getGreeting()} · {todayFormatted}</p>
              <h2 className="font-heading text-4xl font-semibold mb-4" style={{ letterSpacing: '-0.03em', color: '#F7F4D5' }}>{firstName}</h2>

              <div className="min-h-[2.5rem] mb-5">
                {aiLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-3.5 h-3.5 animate-spin" style={{ color: 'rgba(247,244,213,0.40)' }} />
                    <span className="text-sm font-body" style={{ color: 'rgba(247,244,213,0.40)' }}>trykymi is thinking...</span>
                  </div>
                ) : aiMessage ? (
                  <p className="text-base font-body leading-relaxed" style={{ color: 'rgba(247,244,213,0.78)', fontStyle: 'italic' }}>
                    "{aiMessage}"
                  </p>
                ) : (
                  <p className="text-base font-body leading-relaxed" style={{ color: 'rgba(247,244,213,0.60)' }}>
                    {stats.todayPlans > 0
                      ? `${stats.completedPlans} of ${stats.todayPlans} plans done today. Let's keep going.`
                      : 'A fresh start awaits. Let trykymi help you design your ideal day.'}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Link to="/assistant" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-semibold transition-all hover:opacity-90 active:scale-95" style={{ background: '#D3968C', color: '#0A3323' }}>
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask trykymi
                </Link>
                <Link to="/debrief" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-semibold transition-all active:scale-95" style={{ background: 'transparent', color: '#F7F4D5', border: '1px solid #839958' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(131,153,88,0.08)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <Moon className="w-3.5 h-3.5" />
                  Daily debrief
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-3xl flex flex-col items-center justify-center text-center p-7 gap-4" style={{ ...GLASS, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
            <p className="text-xs font-body font-semibold uppercase tracking-widest" style={{ color: 'rgba(247,244,213,0.45)' }}>Today's score</p>
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(247,244,213,0.10)" strokeWidth="8" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#D3968C" strokeWidth="8" strokeDasharray={strokeDash} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-heading text-4xl font-semibold" style={{ letterSpacing: '-0.04em', color: '#F7F4D5' }}>{lifeScore}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-body font-semibold" style={{ color: '#F7F4D5' }}>{scoreLabel}</p>
              <p className="text-xs font-body mt-0.5" style={{ color: 'rgba(247,244,213,0.45)' }}>Based on today's activity</p>
            </div>
          </div>
        </div>

        {!motivationDismissed && timeWon > 0 && (
          <div className="flex items-center gap-4 px-5 py-4 rounded-2xl" style={{ background: 'rgba(211,150,140,0.15)', border: '1px solid rgba(211,150,140,0.25)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(211,150,140,0.25)' }}>
              <Zap className="w-4 h-4" style={{ color: '#D3968C' }} />
            </div>
            <p className="text-sm font-body flex-1" style={{ color: '#F7F4D5' }}>
              <span className="font-semibold">You saved {Math.floor(timeWon / 60)}h {timeWon % 60}m today.</span>{' '}
              <span style={{ color: 'rgba(247,244,213,0.60)' }}>Keep building that momentum.</span>
            </p>
            <button onClick={() => setMotivationDismissed(true)} className="w-6 h-6 rounded-full flex items-center justify-center transition-colors flex-shrink-0" style={{ color: 'rgba(247,244,213,0.50)' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(247,244,213,0.08)'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: CalendarDays, label: "Today's Plans", value: `${stats.completedPlans}/${stats.todayPlans}`, link: '/plan' },
            { icon: Target, label: 'Habits Done', value: `${stats.completedHabitsToday}/${stats.totalHabits}`, link: '/habits' },
            { icon: CheckSquare, label: 'Tasks Done', value: `${stats.completedTasks}/${stats.totalTasks}`, link: '/tasks' },
            { icon: Bell, label: 'Reminders', value: String(stats.upcomingReminders), link: '/reminders' },
          ].map((stat, i) => (
            <Link
              key={i}
              to={stat.link}
              className="rounded-3xl p-7 transition-all duration-200"
              style={{ ...GLASS, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(247,244,213,0.08)'; el.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(247,244,213,0.05)'; el.style.transform = 'none'; }}
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(211,150,140,0.18)' }}>
                <stat.icon style={{ color: '#D3968C', width: '18px', height: '18px' }} />
              </div>
              <p className="font-heading text-3xl font-semibold text-center" style={{ letterSpacing: '-0.03em', color: '#F7F4D5' }}>{stat.value}</p>
              <p className="text-sm font-body mt-2 text-center" style={{ color: 'rgba(247,244,213,0.60)' }}>{stat.label}</p>
            </Link>
          ))}
        </div>

        {(timeLost > 0 || timeWon > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-3xl p-7 flex items-center gap-4" style={{ ...GLASS, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(211,150,140,0.15)' }}>
                <TrendingDown className="w-5 h-5" style={{ color: '#D3968C' }} />
              </div>
              <div>
                <p className="text-sm font-body mb-1" style={{ color: 'rgba(247,244,213,0.60)' }}>Time lost today</p>
                <p className="font-heading text-2xl font-semibold" style={{ letterSpacing: '-0.03em', color: '#F7F4D5' }}>{Math.floor(timeLost / 60)}h {timeLost % 60}m</p>
              </div>
            </div>
            <div className="rounded-3xl p-7 flex items-center gap-4" style={{ ...GLASS, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(211,150,140,0.15)' }}>
                <TrendingUp className="w-5 h-5" style={{ color: '#D3968C' }} />
              </div>
              <div>
                <p className="text-sm font-body mb-1" style={{ color: 'rgba(247,244,213,0.60)' }}>Time won today</p>
                <p className="font-heading text-2xl font-semibold" style={{ letterSpacing: '-0.03em', color: '#F7F4D5' }}>{Math.floor(timeWon / 60)}h {timeWon % 60}m</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassSectionCard title="Today's Plan" linkTo="/plan" icon={<CalendarDays className="w-4 h-4" />}>
            {plans.length === 0 ? (
              <GlassEmptyState text="No plans yet. Start your day with intention." linkTo="/plan" linkText="Create a plan" illustration={<PlanIllustration className="w-12 h-12" opacity={0.4} />} />
            ) : (
              <div className="space-y-1.5">
                {plans.slice(0, 5).map((plan) => (
                  <div key={plan.id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(247,244,213,0.04)', opacity: plan.completed ? 0.45 : 1 }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#D3968C' }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-body font-medium" style={{ color: 'rgba(247,244,213,0.85)', textDecoration: plan.completed ? 'line-through' : 'none' }}>{plan.title}</p>
                      {plan.start_time && (
                        <p className="text-xs font-body flex items-center gap-1 mt-0.5" style={{ color: 'rgba(247,244,213,0.40)' }}>
                          <Clock className="w-3 h-3" />
                          {plan.start_time.slice(0, 5)}{plan.end_time ? ` – ${plan.end_time.slice(0, 5)}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassSectionCard>

          <GlassSectionCard title="Upcoming Reminders" linkTo="/reminders" icon={<Bell className="w-4 h-4" />}>
            {reminders.length === 0 ? (
              <GlassEmptyState text="No reminders set. Add what matters." linkTo="/reminders" linkText="Add reminder" illustration={<ReminderIllustration className="w-12 h-12" opacity={0.4} />} />
            ) : (
              <div className="space-y-1.5">
                {reminders.slice(0, 5).map((reminder) => (
                  <div key={reminder.id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(247,244,213,0.04)' }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#D3968C' }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-body font-medium" style={{ color: 'rgba(247,244,213,0.85)' }}>{reminder.title}</p>
                      <p className="text-xs font-body mt-0.5" style={{ color: 'rgba(247,244,213,0.40)' }}>
                        {new Date(reminder.reminder_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {reminder.reminder_time ? ` · ${reminder.reminder_time.slice(0, 5)}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassSectionCard>

          <GlassSectionCard title="Habits" linkTo="/habits" icon={<Target className="w-4 h-4" />}>
            {habits.length === 0 ? (
              <GlassEmptyState text="Your journey begins here." linkTo="/habits" linkText="Create first habit" illustration={<HabitIllustration className="w-12 h-12" opacity={0.4} />} />
            ) : (
              <div className="space-y-2">
                {habits.slice(0, 4).map((habit) => {
                  const isDone = todayCompletions.has(habit.id);
                  return (
                    <div key={habit.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(247,244,213,0.04)', opacity: isDone ? 0.5 : 1 }}>
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-semibold" style={{ backgroundColor: habit.color || '#0A3323', color: '#0A3323', fontWeight: 600 }}>
                        {habit.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-body font-medium" style={{ color: 'rgba(247,244,213,0.85)', textDecoration: isDone ? 'line-through' : 'none' }}>{habit.name}</p>
                        <p className="text-xs font-body" style={{ color: 'rgba(247,244,213,0.40)' }}>{habit.current_streak}d streak</p>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={isDone ? { borderColor: '#D3968C', background: '#D3968C' } : { borderColor: 'rgba(247,244,213,0.25)' }}>
                        {isDone && (
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#0A3323" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassSectionCard>

          <GlassSectionCard title="Recent Tasks" linkTo="/tasks" icon={<CheckSquare className="w-4 h-4" />}>
            {tasks.length === 0 ? (
              <GlassEmptyState text="No tasks yet. Capture what needs doing." linkTo="/tasks" linkText="Add task" illustration={<ChecklistIllustration className="w-12 h-12" opacity={0.4} />} />
            ) : (
              <div className="space-y-1.5">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(247,244,213,0.04)', opacity: task.completed ? 0.45 : 1 }}>
                    <div className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0" style={task.completed ? { background: '#D3968C', borderColor: '#D3968C' } : { borderColor: 'rgba(247,244,213,0.30)' }}>
                      {task.completed && (
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#0A3323" strokeWidth="3.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm font-body flex-1 truncate font-medium" style={{ color: 'rgba(247,244,213,0.85)', textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </GlassSectionCard>
        </div>
      </div>
    </AppLayout>
  );
}

function GlassSectionCard({ title, linkTo, icon, children }: {
  title: string;
  linkTo: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="p-7" style={{ background: 'rgba(247,244,213,0.05)', border: '1px solid rgba(247,244,213,0.10)', borderRadius: '14px' }}>
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2">
          <span style={{ color: '#D3968C' }}>{icon}</span>
          <h3 className="font-heading text-lg font-semibold" style={{ color: '#F7F4D5' }}>{title}</h3>
        </div>
        <Link to={linkTo} className="inline-flex items-center gap-1 text-xs font-body font-semibold transition-colors hover:opacity-70" style={{ color: '#D3968C' }}>
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      {children}
    </div>
  );
}

function GlassEmptyState({ text, linkTo, linkText, illustration }: { text: string; linkTo: string; linkText: string; illustration?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {illustration && <div className="mb-3">{illustration}</div>}
      <p className="text-sm font-body mb-3 italic" style={{ color: 'rgba(247,244,213,0.42)' }}>{text}</p>
      <Link to={linkTo} className="text-xs font-body font-semibold transition-colors hover:opacity-70" style={{ color: '#D3968C' }}>{linkText} →</Link>
    </div>
  );
}
