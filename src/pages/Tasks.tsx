import { useEffect, useState, FormEvent } from 'react';
import { Plus, Trash2, CheckSquare, CheckCircle2, Circle, Calendar } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import PriorityBadge from '../components/ui/PriorityBadge';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { ChecklistIllustration } from '../components/ui/Illustrations';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Task } from '../types/database';

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'medium' as Task['priority'],
  due_date: '',
};

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    if (!user) return;
    fetchTasks();

    const channel = supabase
      .channel('tasks-channel')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'tasks',
        filter: `user_id=eq.${user.id}`,
      }, () => fetchTasks())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    setTasks(data || []);
    setLoading(false);
  };

  const filtered = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    await supabase.from('tasks').insert({
      user_id: user!.id,
      title: form.title,
      description: form.description,
      priority: form.priority,
      due_date: form.due_date || null,
    });

    setSaving(false);
    setModalOpen(false);
    setForm(EMPTY_FORM);
    fetchTasks();
  };

  const toggleComplete = async (task: Task) => {
    await supabase.from('tasks').update({ completed: !task.completed, updated_at: new Date().toISOString() }).eq('id', task.id);
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id);
    fetchTasks();
  };

  const pending = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;

  return (
    <AppLayout title="Tasks">
      <div className="space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-1 rounded-xl p-1 overflow-x-auto" style={{ background: 'rgba(247,244,213,0.05)', border: '1px solid rgba(247,244,213,0.10)' }}>
            {(['all', 'pending', 'completed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-body font-medium transition-all whitespace-nowrap"
                style={filter === f
                  ? { background: '#D3968C', color: '#F7F4D5' }
                  : { color: 'rgba(247,244,213,0.60)' }
                }
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'pending' && pending > 0 && (
                  <span
                    className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full"
                    style={{ background: '#D3968C', color: '#F7F4D5' }}
                  >
                    {pending}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button onClick={() => { setForm(EMPTY_FORM); setModalOpen(true); }} className="btn-primary w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        {tasks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="card text-center">
              <p className="font-heading text-2xl font-semibold" style={{ color: '#F7F4D5' }}>{tasks.length}</p>
              <p className="text-xs font-body mt-0.5" style={{ color: 'rgba(247,244,213,0.55)' }}>Total</p>
            </div>
            <div className="card text-center">
              <p className="font-heading text-2xl font-semibold" style={{ color: '#D3968C' }}>{pending}</p>
              <p className="text-xs font-body mt-0.5" style={{ color: 'rgba(247,244,213,0.55)' }}>Pending</p>
            </div>
            <div className="card text-center">
              <p className="font-heading text-2xl font-semibold" style={{ color: '#D3968C' }}>{completed}</p>
              <p className="text-xs font-body mt-0.5" style={{ color: 'rgba(247,244,213,0.55)' }}>Done</p>
            </div>
          </div>
        )}

        {loading ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <EmptyState
            illustration={<ChecklistIllustration className="w-20 h-20" opacity={0.5} />}
            title="No tasks"
            description={filter === 'completed' ? 'No completed tasks yet.' : 'Start adding tasks to stay organized.'}
            action={filter !== 'completed' ? (
              <button onClick={() => { setForm(EMPTY_FORM); setModalOpen(true); }} className="btn-primary">
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            ) : undefined}
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((task) => (
              <div
                key={task.id}
                className="group flex items-start gap-4 p-4 transition-all duration-200"
                style={task.completed
                  ? { background: 'rgba(247,244,213,0.03)', border: '1px solid rgba(247,244,213,0.08)', borderRadius: '8px' }
                  : { background: 'rgba(247,244,213,0.05)', border: '1px solid rgba(247,244,213,0.10)', borderRadius: '8px' }
                }
              >
                <button
                  onClick={() => toggleComplete(task)}
                  className="mt-0.5 flex-shrink-0 transition-colors"
                  style={{ color: task.completed ? '#D3968C' : 'rgba(247,244,213,0.40)' }}
                >
                  {task.completed
                    ? <CheckCircle2 className="w-5 h-5" />
                    : <Circle className="w-5 h-5" />
                  }
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className="text-sm font-body font-semibold"
                      style={task.completed
                        ? { textDecoration: 'line-through', color: 'rgba(247,244,213,0.40)' }
                        : { color: '#F7F4D5' }
                      }
                    >
                      {task.title}
                    </p>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  {task.description && (
                    <p className="text-xs font-body mt-0.5" style={{ color: 'rgba(247,244,213,0.55)' }}>{task.description}</p>
                  )}
                  {task.due_date && (
                    <p className="flex items-center gap-1 text-xs font-body mt-1" style={{ color: 'rgba(247,244,213,0.45)' }}>
                      <Calendar className="w-3 h-3" />
                      Due {new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="btn-ghost p-2"
                    style={{ color: 'rgba(247,244,213,0.65)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#D3968C'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(247,244,213,0.65)'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Task">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-body font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>Title</label>
            <input
              className="input-field"
              placeholder="Task name..."
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-body font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>Description</label>
            <textarea
              className="input-field resize-none h-20"
              placeholder="Optional notes..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-body font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>Priority</label>
              <select
                className="input-field"
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as Task['priority'] }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-body font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>Due date</label>
              <input
                type="date"
                className="input-field"
                value={form.due_date}
                onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Adding...' : 'Add task'}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
