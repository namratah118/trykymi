import { useState } from 'react';
import { CalendarDays, Bell, CheckSquare, Target, Sparkles, TrendingUp } from 'lucide-react';

interface Stats {
  totalTasks: number;
  completedTasks: number;
  totalHabits: number;
  completedHabitsToday: number;
  upcomingReminders: number;
  todayPlans: number;
  completedPlans: number;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Good night';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const GLASS = {
  background: 'rgba(247,244,213,0.05)',
  border: '1px solid rgba(247,244,213,0.10)',
};

export default function Dashboard() {
  const [stats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    totalHabits: 0,
    completedHabitsToday: 0,
    upcomingReminders: 0,
    todayPlans: 0,
    completedPlans: 0,
  });

  return (
    <div style={{ background: '#0A3323', minHeight: '100vh', color: '#F7F4D5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-2">{getGreeting()}</h1>
          <p style={{ color: 'rgba(247,244,213,0.70)', fontSize: '18px' }}>
            Welcome back to your personal assistant
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className="rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            style={GLASS}
          >
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: '#839958', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>
                Today's Tasks
              </span>
              <CheckSquare style={{ width: '20px', height: '20px', color: '#D3968C' }} />
            </div>
            <div className="text-3xl font-bold">{stats.completedTasks}/{stats.totalTasks}</div>
            <p style={{ color: 'rgba(247,244,213,0.60)', fontSize: '14px', marginTop: '8px' }}>
              Tasks completed
            </p>
          </div>

          <div
            className="rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            style={GLASS}
          >
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: '#839958', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>
                Habits
              </span>
              <Target style={{ width: '20px', height: '20px', color: '#839958' }} />
            </div>
            <div className="text-3xl font-bold">{stats.completedHabitsToday}/{stats.totalHabits}</div>
            <p style={{ color: 'rgba(247,244,213,0.60)', fontSize: '14px', marginTop: '8px' }}>
              Completed today
            </p>
          </div>

          <div
            className="rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            style={GLASS}
          >
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: '#839958', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>
                Reminders
              </span>
              <Bell style={{ width: '20px', height: '20px', color: '#D3968C' }} />
            </div>
            <div className="text-3xl font-bold">{stats.upcomingReminders}</div>
            <p style={{ color: 'rgba(247,244,213,0.60)', fontSize: '14px', marginTop: '8px' }}>
              Upcoming
            </p>
          </div>

          <div
            className="rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            style={GLASS}
          >
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: '#839958', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>
                Plans
              </span>
              <CalendarDays style={{ width: '20px', height: '20px', color: '#839958' }} />
            </div>
            <div className="text-3xl font-bold">{stats.completedPlans}/{stats.todayPlans}</div>
            <p style={{ color: 'rgba(247,244,213,0.60)', fontSize: '14px', marginTop: '8px' }}>
              Today's plans
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
            style={GLASS}
          >
            <div className="flex items-center gap-2 mb-6">
              <CalendarDays style={{ width: '24px', height: '24px', color: '#D3968C' }} />
              <h2 className="text-2xl font-bold">Today's Plan</h2>
            </div>
            <div style={{ color: 'rgba(247,244,213,0.60)', textAlign: 'center', padding: '32px' }}>
              <Sparkles style={{ width: '40px', height: '40px', margin: '0 auto 16px', opacity: 0.5 }} />
              <p>No plans yet. Create your first plan for today.</p>
            </div>
          </div>

          <div
            className="rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
            style={GLASS}
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp style={{ width: '24px', height: '24px', color: '#839958' }} />
              <h2 className="text-2xl font-bold">Insights</h2>
            </div>
            <div style={{ color: 'rgba(247,244,213,0.60)', textAlign: 'center', padding: '32px' }}>
              <p>Your productivity insights will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
