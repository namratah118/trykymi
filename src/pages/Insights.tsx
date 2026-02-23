import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { TrendingUp, TrendingDown, CheckSquare, Target } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DayData {
  date: string;
  label: string;
  habitsCompleted: number;
  plansCompleted: number;
  timeLost: number;
  timeWon: number;
}

interface HabitData {
  name: string;
  streak: number;
  color: string;
}

const CHART_COLORS = {
  pink: '#D3968C',
  sage: '#839958',
  success: '#839958',
  error: '#D3968C',
  warning: '#D3968C',
};

const TOOLTIP_STYLE = {
  background: 'rgba(10,51,35,0.95)',
  border: '1px solid rgba(247,244,213,0.14)',
  borderRadius: '12px',
  fontSize: '12px',
  fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
  color: '#F7F4D5',
};

const TICK_STYLE = { fontSize: 12, fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif', fill: 'rgba(247,244,213,0.45)' };

export default function Insights() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [habitData, setHabitData] = useState<HabitData[]>([]);
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [habitStats, setHabitStats] = useState({ total: 0, avgStreak: 0, bestStreak: 0 });
  const [timeStats, setTimeStats] = useState({ totalLost: 0, totalWon: 0 });

  useEffect(() => {
    if (!user) return;
    fetchInsights();
  }, [user]);

  const fetchInsights = async () => {
    setLoading(true);

    const days: DayData[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        habitsCompleted: 0,
        plansCompleted: 0,
        timeLost: 0,
        timeWon: 0,
      });
    }

    const startDate = days[0].date;
    const endDate = days[6].date;

    const [tasksRes, habitsRes, habitCompRes, plansRes, timeRes] = await Promise.all([
      supabase.from('tasks').select('completed').eq('user_id', user!.id),
      supabase.from('habits').select('*').eq('user_id', user!.id),
      supabase.from('habit_completions').select('habit_id, completed_date').eq('user_id', user!.id).gte('completed_date', startDate).lte('completed_date', endDate),
      supabase.from('plans').select('completed, plan_date').eq('user_id', user!.id).gte('plan_date', startDate).lte('plan_date', endDate),
      supabase.from('time_entries').select('type, duration_minutes, entry_date').eq('user_id', user!.id).gte('entry_date', startDate).lte('entry_date', endDate),
    ]);

    const tasks = tasksRes.data || [];
    const habits = habitsRes.data || [];
    const completions = habitCompRes.data || [];
    const plans = plansRes.data || [];
    const timeEntries = timeRes.data || [];

    days.forEach(day => {
      day.habitsCompleted = completions.filter(c => c.completed_date === day.date).length;
      day.plansCompleted = plans.filter(p => p.plan_date === day.date && p.completed).length;
      day.timeLost = timeEntries.filter(e => e.entry_date === day.date && e.type === 'lost')
        .reduce((s, e) => s + Math.round(e.duration_minutes / 60 * 10) / 10, 0);
      day.timeWon = timeEntries.filter(e => e.entry_date === day.date && e.type === 'won')
        .reduce((s, e) => s + Math.round(e.duration_minutes / 60 * 10) / 10, 0);
    });

    const totalLost = timeEntries.filter(e => e.type === 'lost').reduce((s, e) => s + e.duration_minutes, 0);
    const totalWon = timeEntries.filter(e => e.type === 'won').reduce((s, e) => s + e.duration_minutes, 0);

    setWeekData(days);
    setHabitData(habits.map(h => ({ name: h.name, streak: h.current_streak, color: h.color || CHART_COLORS.pink })));
    setTaskStats({
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
    });
    setHabitStats({
      total: habits.length,
      avgStreak: habits.length > 0 ? Math.round(habits.reduce((a, h) => a + h.current_streak, 0) / habits.length) : 0,
      bestStreak: habits.length > 0 ? Math.max(...habits.map(h => h.longest_streak)) : 0,
    });
    setTimeStats({ totalLost, totalWon });
    setLoading(false);
  };

  const taskPieData = [
    { name: 'Completed', value: taskStats.completed, color: CHART_COLORS.success },
    { name: 'Pending', value: taskStats.pending, color: CHART_COLORS.warning },
  ].filter(d => d.value > 0);

  const lifeScore7Day = weekData.reduce((score, day) => {
    const dayTotal = day.timeLost + day.timeWon;
    if (dayTotal === 0) return score;
    return score + (day.timeWon / dayTotal) * 100;
  }, 0) / Math.max(1, weekData.filter(d => d.timeLost + d.timeWon > 0).length);

  if (loading) return <AppLayout><PageLoader /></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: 'rgba(211,150,140,0.15)', color: '#D3968C' }}
            >
              <CheckSquare className="w-5 h-5" />
            </div>
            <p className="font-heading text-2xl font-semibold" style={{ color: '#F7F4D5' }}>{taskStats.completed}</p>
            <p className="text-xs font-body mt-0.5" style={{ color: 'rgba(247,244,213,0.65)' }}>Tasks Done</p>
            <p className="text-xs font-body" style={{ color: 'rgba(247,244,213,0.45)' }}>of {taskStats.total} total</p>
          </div>
          <div className="card">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: 'rgba(211,150,140,0.15)', color: '#D3968C' }}
            >
              <Target className="w-5 h-5" />
            </div>
            <p className="font-heading text-2xl font-semibold" style={{ color: '#F7F4D5' }}>{habitStats.total}</p>
            <p className="text-xs font-body mt-0.5" style={{ color: 'rgba(247,244,213,0.65)' }}>Active Habits</p>
            <p className="text-xs font-body" style={{ color: 'rgba(247,244,213,0.45)' }}>avg {habitStats.avgStreak}d streak</p>
          </div>
          <div className="card">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: 'rgba(211,150,140,0.15)', color: '#D3968C' }}
            >
              <TrendingDown className="w-5 h-5" />
            </div>
            <p className="font-heading text-2xl font-semibold" style={{ color: '#F7F4D5' }}>{Math.floor(timeStats.totalLost / 60)}h {timeStats.totalLost % 60}m</p>
            <p className="text-xs font-body mt-0.5" style={{ color: 'rgba(247,244,213,0.65)' }}>Time Lost (7d)</p>
            <p className="text-xs font-body" style={{ color: 'rgba(247,244,213,0.45)' }}>unproductive hours</p>
          </div>
          <div className="card">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: '#D3968C', color: '#F7F4D5' }}
            >
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="font-heading text-2xl font-semibold" style={{ color: '#F7F4D5' }}>{Math.floor(timeStats.totalWon / 60)}h {timeStats.totalWon % 60}m</p>
            <p className="text-xs font-body mt-0.5" style={{ color: 'rgba(247,244,213,0.65)' }}>Time Won (7d)</p>
            <p className="text-xs font-body" style={{ color: 'rgba(247,244,213,0.45)' }}>reclaimed hours</p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-heading text-base font-semibold" style={{ color: '#F7F4D5' }}>Time Intelligence — Last 7 Days</h3>
              <p className="text-xs font-body mt-0.5" style={{ color: 'rgba(247,244,213,0.45)' }}>Hours lost vs. won per day</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-body" style={{ color: 'rgba(247,244,213,0.45)' }}>7-day avg life score</p>
              <p
                className="font-heading text-xl font-semibold"
                style={{ color: lifeScore7Day >= 70 ? '#839958' : lifeScore7Day >= 40 ? '#D3968C' : '#D3968C' }}
              >
                {Math.round(lifeScore7Day)}
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weekData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" tick={TICK_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} unit="h" />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(val: number) => [`${val}h`, '']} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif', color: 'rgba(247,244,213,0.65)' }} />
              <Area type="monotone" dataKey="timeWon" name="Time Won" stroke={CHART_COLORS.success} strokeWidth={2} fill={CHART_COLORS.success} fillOpacity={0.15} dot={false} />
              <Area type="monotone" dataKey="timeLost" name="Time Lost" stroke={CHART_COLORS.error} strokeWidth={2} fill={CHART_COLORS.error} fillOpacity={0.15} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card">
            <h3 className="font-heading text-base font-semibold mb-5" style={{ color: '#F7F4D5' }}>Habits Completed (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(247,244,213,0.06)' }} />
                <Bar dataKey="habitsCompleted" fill={CHART_COLORS.pink} radius={[6, 6, 0, 0]} name="Habits" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="font-heading text-base font-semibold mb-5" style={{ color: '#F7F4D5' }}>Plans Completed (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={TICK_STYLE} axisLine={false} tickLine={false} />
                <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line
                  type="monotone"
                  dataKey="plansCompleted"
                  stroke={CHART_COLORS.sage}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: CHART_COLORS.sage, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: CHART_COLORS.sage, strokeWidth: 0 }}
                  name="Plans"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {taskPieData.length > 0 && (
            <div className="card">
              <h3 className="font-heading text-base font-semibold mb-5" style={{ color: '#F7F4D5' }}>Task Completion Rate</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={taskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {taskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif', color: 'rgba(247,244,213,0.65)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {habitData.length > 0 && (
            <div className="card">
              <h3 className="font-heading text-base font-semibold mb-5" style={{ color: '#F7F4D5' }}>Habit Streaks</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={habitData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                >
                  <XAxis type="number" tick={TICK_STYLE} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ ...TICK_STYLE, fill: 'rgba(247,244,213,0.65)' }}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(247,244,213,0.06)' }} />
                  <Bar dataKey="streak" radius={[0, 6, 6, 0]} name="Streak (days)">
                    {habitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS.pink} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
