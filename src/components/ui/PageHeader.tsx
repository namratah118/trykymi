import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Stats {
  totalTasks: number;
  completedTasks: number;
  totalHabits: number;
  completedHabitsToday: number;
  todayPlans: number;
  completedPlans: number;
}

export default function PageHeader() {
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) return;
    calculateScore();
  }, [user]);

  const calculateScore = async () => {
    setLoading(true);
    const [tasksRes, habitsRes, plansRes, completionsRes] = await Promise.all([
      supabase.from('tasks').select('completed').eq('user_id', user!.id),
      supabase.from('habits').select('id').eq('user_id', user!.id),
      supabase.from('plans').select('completed').eq('user_id', user!.id).eq('plan_date', today),
      supabase.from('habit_completions').select('habit_id').eq('user_id', user!.id).eq('completed_date', today),
    ]);

    const tasksData = tasksRes.data || [];
    const habitsData = habitsRes.data || [];
    const plansData = plansRes.data || [];
    const completionsData = completionsRes.data || [];

    const stats: Stats = {
      totalTasks: tasksData.length,
      completedTasks: tasksData.filter(t => t.completed).length,
      totalHabits: habitsData.length,
      completedHabitsToday: habitsData.filter(h => completionsData.some(c => c.habit_id === h.id)).length,
      todayPlans: plansData.length,
      completedPlans: plansData.filter(p => p.completed).length,
    };

    const h = stats.totalHabits > 0 ? (stats.completedHabitsToday / stats.totalHabits) * 40 : 0;
    const t = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 30 : 0;
    const p = stats.todayPlans > 0 ? (stats.completedPlans / stats.todayPlans) * 30 : 0;
    const calculatedScore = Math.round(h + t + p);

    setScore(calculatedScore);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5" style={{ background: '#0A3323', borderBottom: '1px solid rgba(247,244,213,0.08)' }}>
      <div className="flex items-center gap-2">
        <img src="/image.png" alt="trykymi" style={{ height: '24px', objectFit: 'contain' }} />
        <span className="font-heading text-lg sm:text-xl font-semibold" style={{ color: '#F7F4D5', letterSpacing: '-0.02em' }}>trykymi</span>
      </div>
      <div className="text-sm sm:text-base font-body font-semibold" style={{ color: '#D3968C' }}>
        {loading ? 'Loading...' : `Score ${score}%`}
      </div>
    </div>
  );
}
