import { useEffect, useState, FormEvent } from 'react';
import { Plus, Trash2, Target, Flame, Trophy } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { HabitIllustration } from '../components/ui/Illustrations';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Habit } from '../types/database';

const COLORS = [
  '#0A3323', '#839958', '#D3968C', '#F7F4D5',
];

const EMPTY_FORM = {
  name: '',
  description: '',
  color: '#0A3323',
  frequency: 'daily' as 'daily' | 'weekly',
};

const today = new Date().toISOString().split('T')[0];

export default function Habits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    const [habitsRes, completionsRes] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', user!.id).order('created_at'),
      supabase.from('habit_completions').select('habit_id').eq('user_id', user!.id).eq('completed_date', today),
    ]);

    setHabits(habitsRes.data || []);
    setCompletions(new Set((completionsRes.data || []).map(c => c.habit_id)));
    setLoading(false);
  };

  const toggleHabit = async (habit: Habit) => {
    const isDone = completions.has(habit.id);

    if (isDone) {
      await supabase.from('habit_completions').delete().eq('habit_id', habit.id).eq('completed_date', today);
      const newStreak = Math.max(0, habit.current_streak - 1);
      await supabase.from('habits').update({ current_streak: newStreak, updated_at: new Date().toISOString() }).eq('id', habit.id);
    } else {
      await supabase.from('habit_completions').upsert({ habit_id: habit.id, user_id: user!.id, completed_date: today });
      const newStreak = habit.current_streak + 1;
      const longestStreak = Math.max(newStreak, habit.longest_streak);
      await supabase.from('habits').update({ current_streak: newStreak, longest_streak: longestStreak, updated_at: new Date().toISOString() }).eq('id', habit.id);
    }

    fetchData();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    await supabase.from('habits').insert({
      user_id: user!.id,
      name: form.name,
      description: form.description,
      color: form.color,
      frequency: form.frequency,
    });

    setSaving(false);
    setModalOpen(false);
    setForm(EMPTY_FORM);
    fetchData();
  };

  const deleteHabit = async (id: string) => {
    await supabase.from('habits').delete().eq('id', id);
    fetchData();
  };

  const completedToday = habits.filter(h => completions.has(h.id)).length;
  const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;
  const bestStreak = Math.max(...habits.map(h => h.current_streak), 0);

  return (
    <AppLayout title="Habits">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          {habits.length > 0 && (
            <p className="text-sm font-body text-text-muted">
              <span className="font-semibold text-text-primary">{completedToday}</span> of <span className="font-semibold text-text-primary">{habits.length}</span> habits done today
            </p>
          )}
          <div className="ml-auto">
            <button onClick={() => { setForm(EMPTY_FORM); setModalOpen(true); }} className="btn-primary">
              <Plus className="w-4 h-4" />
              New Habit
            </button>
          </div>
        </div>

        {habits.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="card text-center py-4">
              <p className="font-heading text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.03em' }}>{habits.length}</p>
              <p className="text-xs font-body text-text-muted mt-0.5">Total habits</p>
            </div>
            <div className="card text-center py-4">
              <p className="font-heading text-2xl font-semibold text-text-primary" style={{ letterSpacing: '-0.03em', color: '#D3968C' }}>{completedToday}</p>
              <p className="text-xs font-body text-text-muted mt-0.5">Done today</p>
            </div>
            <div className="card text-center py-4">
              <p className="font-heading text-2xl font-semibold" style={{ letterSpacing: '-0.03em', color: '#D3968C' }}>{bestStreak}</p>
              <p className="text-xs font-body text-text-muted mt-0.5">Best streak</p>
            </div>
            <div className="card text-center py-4">
              <p className="font-heading text-2xl font-semibold" style={{ letterSpacing: '-0.03em', color: '#D3968C' }}>{completionRate}%</p>
              <p className="text-xs font-body text-text-muted mt-0.5">Today's rate</p>
            </div>
          </div>
        )}

        {loading ? (
          <PageLoader />
        ) : habits.length === 0 ? (
          <EmptyState
            illustration={<HabitIllustration className="w-20 h-20" opacity={0.5} />}
            title="No habits yet"
            description="Build consistency by tracking daily habits. Start with something small and let momentum carry you forward."
            action={
              <button onClick={() => { setForm(EMPTY_FORM); setModalOpen(true); }} className="btn-primary">
                <Plus className="w-4 h-4" />
                Create your first habit
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {habits.map((habit) => {
              const isDone = completions.has(habit.id);
              return (
                <div
                  key={habit.id}
                  className="group relative border transition-all duration-200 cursor-pointer overflow-hidden"
                  style={isDone
                    ? { backgroundColor: 'rgba(247,244,213,0.07)', borderColor: 'rgba(247,244,213,0.12)', padding: '20px', borderRadius: '14px' }
                    : { backgroundColor: 'rgba(247,244,213,0.04)', borderColor: 'rgba(247,244,213,0.08)', padding: '20px', borderRadius: '14px' }
                  }
                  onClick={() => toggleHabit(habit)}
                  onMouseEnter={e => { if (!isDone) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(247,244,213,0.07)'; }}
                  onMouseLeave={e => { if (!isDone) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(247,244,213,0.04)'; }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold"
                      style={{ backgroundColor: habit.color, color: '#0A3323' }}
                    >
                      {habit.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2">
                      {isDone && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D3968C' }}>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: '#F7F4D5' }}>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteHabit(habit.id); }}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-body font-semibold text-text-primary text-sm mb-0.5">{habit.name}</h3>
                  {habit.description && (
                    <p className="text-xs font-body text-text-muted mb-3 truncate">{habit.description}</p>
                  )}

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5" style={{ color: '#D3968C' }} />
                      <span className="text-xs font-body font-semibold text-text-primary">{habit.current_streak}</span>
                      <span className="text-xs font-body text-text-muted">streak</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5" style={{ color: '#D3968C' }} />
                      <span className="text-xs font-body font-semibold text-text-primary">{habit.longest_streak}</span>
                      <span className="text-xs font-body text-text-muted">best</span>
                    </div>
                  </div>

                  <div
                    className="mt-3 text-xs font-body font-semibold text-center py-1.5 rounded-lg transition-colors"
                    style={isDone
                      ? { backgroundColor: '#D3968C', color: '#F7F4D5' }
                      : { backgroundColor: habit.color + '15', color: habit.color }
                    }
                  >
                    {isDone ? 'Done today' : 'Tap to complete'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Habit">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-body font-medium text-text-primary mb-1.5">Habit name</label>
            <input
              className="input-field"
              placeholder="e.g. Morning meditation"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-text-primary mb-1.5">Description <span className="text-text-muted font-normal">(optional)</span></label>
            <textarea
              className="input-field resize-none h-16"
              placeholder="Why is this habit important to you?"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-text-primary mb-1.5">Frequency</label>
            <select
              className="input-field"
              value={form.frequency}
              onChange={e => setForm(f => ({ ...f, frequency: e.target.value as 'daily' | 'weekly' }))}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-body font-medium text-text-primary mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, color }))}
                  className="w-8 h-8 rounded-xl transition-transform hover:scale-110"
                  style={{ backgroundColor: color, outline: form.color === color ? `3px solid ${color}` : 'none', outlineOffset: '2px' }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Creating...' : 'Create habit'}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
