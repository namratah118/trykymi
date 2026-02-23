import { useEffect, useState, FormEvent } from 'react';
import { Plus, Edit2, Trash2, Bell, CheckCircle2, Calendar } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { ReminderIllustration } from '../components/ui/Illustrations';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Reminder } from '../types/database';

const EMPTY_FORM = {
  title: '',
  description: '',
  reminder_date: new Date().toISOString().split('T')[0],
  reminder_time: '',
};

export default function Reminders() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');

  useEffect(() => {
    if (!user) return;
    fetchReminders();

    const channel = supabase
      .channel('reminders-channel')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'reminders',
        filter: `user_id=eq.${user.id}`,
      }, () => fetchReminders())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const fetchReminders = async () => {
    const { data } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user!.id)
      .order('reminder_date')
      .order('reminder_time');
    setReminders(data || []);
    setLoading(false);
  };

  const filtered = reminders.filter(r => {
    if (filter === 'upcoming') return !r.completed;
    if (filter === 'completed') return r.completed;
    return true;
  });

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (reminder: Reminder) => {
    setEditingId(reminder.id);
    setForm({
      title: reminder.title,
      description: reminder.description,
      reminder_date: reminder.reminder_date,
      reminder_time: reminder.reminder_time || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      description: form.description,
      reminder_date: form.reminder_date,
      reminder_time: form.reminder_time || null,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      await supabase.from('reminders').update(payload).eq('id', editingId);
    } else {
      await supabase.from('reminders').insert({ ...payload, user_id: user!.id });
    }

    setSaving(false);
    setModalOpen(false);
    fetchReminders();
  };

  const toggleComplete = async (reminder: Reminder) => {
    await supabase.from('reminders').update({ completed: !reminder.completed, updated_at: new Date().toISOString() }).eq('id', reminder.id);
    fetchReminders();
  };

  const deleteReminder = async (id: string) => {
    await supabase.from('reminders').delete().eq('id', id);
    fetchReminders();
  };

  const isOverdue = (r: Reminder) => {
    const today = new Date().toISOString().split('T')[0];
    return !r.completed && r.reminder_date < today;
  };

  return (
    <AppLayout title="Reminders">
      <div className="space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-1 rounded-xl p-1 overflow-x-auto" style={{ background: 'rgba(131,153,88,0.12)' }}>
            {(['upcoming', 'all', 'completed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-body font-medium transition-all whitespace-nowrap"
                style={filter === f
                  ? { background: 'rgba(211,150,140,0.20)', color: '#D3968C' }
                  : { color: 'rgba(247,244,213,0.60)' }
                }
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={openAdd} className="btn-primary w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Add Reminder
          </button>
        </div>

        {loading ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <EmptyState
            illustration={<ReminderIllustration className="w-20 h-20" opacity={0.5} />}
            title="No reminders"
            description="Stay on top of important dates and tasks by adding reminders."
            action={
              <button onClick={openAdd} className="btn-primary">
                <Plus className="w-4 h-4" />
                Add Reminder
              </button>
            }
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((reminder) => (
              <div
                key={reminder.id}
                className="group flex items-start gap-4 p-4 transition-all duration-200"
                style={reminder.completed
                  ? { background: 'rgba(131,153,88,0.08)', border: '1px solid rgba(247,244,213,0.08)', borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }
                  : isOverdue(reminder)
                  ? { background: 'rgba(211,150,140,0.12)', border: '1px solid rgba(211,150,140,0.18)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }
                  : { background: 'rgba(131,153,88,0.12)', border: '1px solid rgba(247,244,213,0.10)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }
                }
              >
                <button
                  onClick={() => toggleComplete(reminder)}
                  className="mt-0.5 flex-shrink-0 transition-colors"
                  style={{ color: reminder.completed ? '#839958' : isOverdue(reminder) ? '#D3968C' : 'rgba(247,244,213,0.40)' }}
                >
                  {reminder.completed
                    ? <CheckCircle2 className="w-5 h-5" />
                    : <Bell className="w-5 h-5" />
                  }
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs sm:text-sm lg:text-base font-body font-semibold"
                    style={reminder.completed
                      ? { textDecoration: 'line-through', color: 'rgba(247,244,213,0.40)' }
                      : { color: '#F7F4D5' }
                    }
                  >
                    {reminder.title}
                  </p>
                  {reminder.description && (
                    <p className="text-xs font-body mt-0.5" style={{ color: 'rgba(247,244,213,0.55)' }}>{reminder.description}</p>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" style={{ color: 'rgba(247,244,213,0.45)' }} />
                    <p
                      className="text-xs font-body"
                      style={isOverdue(reminder) ? { color: '#D3968C', fontWeight: 600 } : { color: 'rgba(247,244,213,0.45)' }}
                    >
                      {new Date(reminder.reminder_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {reminder.reminder_time ? ` at ${reminder.reminder_time.slice(0, 5)}` : ''}
                      {isOverdue(reminder) ? ' (Overdue)' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(reminder)} className="btn-ghost p-2">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteReminder(reminder.id)}
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Reminder' : 'Add Reminder'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-body font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>Title</label>
            <input
              className="input-field"
              placeholder="Reminder title..."
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
              <label className="block text-sm font-body font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>Date</label>
              <input
                type="date"
                className="input-field"
                value={form.reminder_date}
                onChange={e => setForm(f => ({ ...f, reminder_date: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-body font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>Time (optional)</label>
              <input
                type="time"
                className="input-field"
                value={form.reminder_time}
                onChange={e => setForm(f => ({ ...f, reminder_time: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add reminder'}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
