import { useEffect, useState, FormEvent } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Circle, Sparkles, Clock } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { PlanIllustration } from '../components/ui/Illustrations';
import PriorityBadge from '../components/ui/PriorityBadge';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Plan } from '../types/database';

const today = new Date().toISOString().split('T')[0];

const EMPTY_FORM = {
  title: '',
  description: '',
  start_time: '',
  end_time: '',
  priority: 'medium' as Plan['priority'],
};

export default function TodaysPlan() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchPlans();

    const channel = supabase
      .channel('plans-channel')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'plans',
        filter: `user_id=eq.${user.id}`,
      }, () => fetchPlans())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const fetchPlans = async () => {
    const { data } = await supabase
      .from('plans')
      .select('*')
      .eq('user_id', user!.id)
      .eq('plan_date', today)
      .order('start_time', { ascending: true, nullsFirst: false });
    setPlans(data || []);
    setLoading(false);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditingId(plan.id);
    setForm({
      title: plan.title,
      description: plan.description,
      start_time: plan.start_time || '',
      end_time: plan.end_time || '',
      priority: plan.priority,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      description: form.description,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      priority: form.priority,
      plan_date: today,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      await supabase.from('plans').update(payload).eq('id', editingId);
    } else {
      await supabase.from('plans').insert({ ...payload, user_id: user!.id });
    }

    setSaving(false);
    setModalOpen(false);
    fetchPlans();
  };

  const toggleComplete = async (plan: Plan) => {
    await supabase.from('plans').update({ completed: !plan.completed, updated_at: new Date().toISOString() }).eq('id', plan.id);
    fetchPlans();
  };

  const deletePlan = async (id: string) => {
    await supabase.from('plans').delete().eq('id', id);
    fetchPlans();
  };

  const generateAIPlan = async () => {
    setAiLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(`${supabaseUrl}/functions/v1/ai-assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token || supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_plan',
          message: 'Generate a productive daily plan with 5-6 activities for today. Include morning routine, focused work blocks, breaks, and evening wind-down. Return as JSON array with fields: title, description, start_time (HH:MM format), end_time (HH:MM format), priority (low/medium/high).',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.plan && Array.isArray(data.plan)) {
          const insertData = data.plan.map((item: Partial<Plan>) => ({
            user_id: user!.id,
            title: item.title || 'Untitled',
            description: item.description || '',
            plan_date: today,
            start_time: item.start_time || null,
            end_time: item.end_time || null,
            priority: item.priority || 'medium',
          }));
          await supabase.from('plans').insert(insertData);
          fetchPlans();
        }
      }
    } catch {
    }
    setAiLoading(false);
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const completedCount = plans.filter(p => p.completed).length;

  return (
    <AppLayout title="Today's Plan" subtitle={todayFormatted}>
      <div className="space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            {plans.length > 0 && (
              <p className="text-sm font-body" style={{ color: 'rgba(247,244,213,0.65)' }}>
                {completedCount} of {plans.length} completed
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={generateAIPlan}
              disabled={aiLoading}
              className="btn-secondary flex-1 sm:flex-none"
            >
              {aiLoading ? (
                <span
                  className="rounded-full animate-spin"
                  style={{
                    width: '16px',
                    height: '16px',
                    display: 'inline-block',
                    border: '2px solid rgba(211,150,140,0.20)',
                    borderTopColor: '#D3968C',
                  }}
                />
              ) : (
                <Sparkles className="w-4 h-4" style={{ color: '#D3968C' }} />
              )}
              <span className="hidden sm:inline">{aiLoading ? 'Generating...' : 'AI Plan'}</span>
              <span className="sm:hidden">{aiLoading ? '...' : 'AI'}</span>
            </button>
            <button onClick={openAdd} className="btn-primary flex-1 sm:flex-none">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Plan</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {loading ? (
          <PageLoader />
        ) : plans.length === 0 ? (
          <EmptyState
            illustration={<PlanIllustration className="w-20 h-20" opacity={0.5} />}
            title="No plans yet"
            description="Add your first plan for today or let AI generate one for you."
            action={
              <button onClick={openAdd} className="btn-primary">
                <Plus className="w-4 h-4" />
                Add Plan
              </button>
            }
          />
        ) : (
          <div className="space-y-2">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="group flex items-start gap-4 p-4 transition-all duration-200"
                style={plan.completed
                  ? { background: 'rgba(131,153,88,0.08)', border: '1px solid rgba(247,244,213,0.08)', borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }
                  : { background: 'rgba(131,153,88,0.12)', border: '1px solid rgba(247,244,213,0.10)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }
                }
              >
                <button
                  onClick={() => toggleComplete(plan)}
                  className="mt-0.5 flex-shrink-0 transition-colors"
                  style={{ color: plan.completed ? '#839958' : 'rgba(247,244,213,0.40)' }}
                >
                  {plan.completed
                    ? <CheckCircle2 className="w-5 h-5" />
                    : <Circle className="w-5 h-5" />
                  }
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className="text-sm font-body font-semibold"
                      style={plan.completed
                        ? { textDecoration: 'line-through', color: 'rgba(247,244,213,0.40)' }
                        : { color: '#F7F4D5' }
                      }
                    >
                      {plan.title}
                    </p>
                    <PriorityBadge priority={plan.priority} />
                  </div>
                  {plan.description && (
                    <p className="text-xs font-body mt-0.5 truncate" style={{ color: 'rgba(247,244,213,0.55)' }}>{plan.description}</p>
                  )}
                  {(plan.start_time || plan.end_time) && (
                    <p className="flex items-center gap-1 text-xs font-body mt-1" style={{ color: 'rgba(247,244,213,0.45)' }}>
                      <Clock className="w-3 h-3" />
                      {plan.start_time ? plan.start_time.slice(0, 5) : ''}
                      {plan.end_time ? ` – ${plan.end_time.slice(0, 5)}` : ''}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(plan)} className="btn-ghost p-2">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deletePlan(plan.id)}
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
        title={editingId ? 'Edit Plan' : 'Add Plan'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-body font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>Title</label>
            <input
              className="input-field"
              placeholder="What do you want to do?"
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
              <label className="block text-sm font-body font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>Start time</label>
              <input
                type="time"
                className="input-field"
                value={form.start_time}
                onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-body font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>End time</label>
              <input
                type="time"
                className="input-field"
                value={form.end_time}
                onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-body font-medium mb-1.5" style={{ color: 'rgba(247,244,213,0.75)' }}>Priority</label>
            <select
              className="input-field"
              value={form.priority}
              onChange={e => setForm(f => ({ ...f, priority: e.target.value as Plan['priority'] }))}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add plan'}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
