import React, { useState } from "react";
import { CalendarDays, Bell, CheckSquare, Target, Sparkles, TrendingUp } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("dashboard");
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
    <div className="min-h-screen w-full" style={{ background: '#0A3323', color: '#F7F4D5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">{getGreeting()}</h1>
          <p style={{ color: 'rgba(247,244,213,0.70)', fontSize: '18px' }}>
            Welcome back to your personal assistant
          </p>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("dashboard")}
            style={{
              background: activeTab === "dashboard" ? 'rgba(247,244,213,0.15)' : 'rgba(247,244,213,0.05)',
              border: activeTab === "dashboard" ? '1px solid rgba(247,244,213,0.30)' : '1px solid rgba(247,244,213,0.10)',
              color: '#F7F4D5',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("plan")}
            style={{
              background: activeTab === "plan" ? 'rgba(247,244,213,0.15)' : 'rgba(247,244,213,0.05)',
              border: activeTab === "plan" ? '1px solid rgba(247,244,213,0.30)' : '1px solid rgba(247,244,213,0.10)',
              color: '#F7F4D5',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            Today's Plan
          </button>
          <button
            onClick={() => setActiveTab("habits")}
            style={{
              background: activeTab === "habits" ? 'rgba(247,244,213,0.15)' : 'rgba(247,244,213,0.05)',
              border: activeTab === "habits" ? '1px solid rgba(247,244,213,0.30)' : '1px solid rgba(247,244,213,0.10)',
              color: '#F7F4D5',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            Habits
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            style={{
              background: activeTab === "tasks" ? 'rgba(247,244,213,0.15)' : 'rgba(247,244,213,0.05)',
              border: activeTab === "tasks" ? '1px solid rgba(247,244,213,0.30)' : '1px solid rgba(247,244,213,0.10)',
              color: '#F7F4D5',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab("reminders")}
            style={{
              background: activeTab === "reminders" ? 'rgba(247,244,213,0.15)' : 'rgba(247,244,213,0.05)',
              border: activeTab === "reminders" ? '1px solid rgba(247,244,213,0.30)' : '1px solid rgba(247,244,213,0.10)',
              color: '#F7F4D5',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            Reminders
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            style={{
              background: activeTab === "insights" ? 'rgba(247,244,213,0.15)' : 'rgba(247,244,213,0.05)',
              border: activeTab === "insights" ? '1px solid rgba(247,244,213,0.30)' : '1px solid rgba(247,244,213,0.10)',
              color: '#F7F4D5',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveTab("debrief")}
            style={{
              background: activeTab === "debrief" ? 'rgba(247,244,213,0.15)' : 'rgba(247,244,213,0.05)',
              border: activeTab === "debrief" ? '1px solid rgba(247,244,213,0.30)' : '1px solid rgba(247,244,213,0.10)',
              color: '#F7F4D5',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            Debrief
          </button>
        </div>

        {activeTab === "dashboard" && (
          <>
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
          </>
        )}

        {activeTab === "plan" && (
          <div
            className="rounded-2xl p-8"
            style={GLASS}
          >
            <h2 className="text-2xl font-bold mb-4">Today's Plan</h2>
            <p style={{ color: 'rgba(247,244,213,0.60)' }}>Plan your day here.</p>
          </div>
        )}

        {activeTab === "habits" && (
          <div
            className="rounded-2xl p-8"
            style={GLASS}
          >
            <h2 className="text-2xl font-bold mb-4">Habits</h2>
            <p style={{ color: 'rgba(247,244,213,0.60)' }}>Track your daily habits here.</p>
          </div>
        )}

        {activeTab === "tasks" && (
          <div
            className="rounded-2xl p-8"
            style={GLASS}
          >
            <h2 className="text-2xl font-bold mb-4">Tasks</h2>
            <p style={{ color: 'rgba(247,244,213,0.60)' }}>Manage your tasks here.</p>
          </div>
        )}

        {activeTab === "reminders" && (
          <div
            className="rounded-2xl p-8"
            style={GLASS}
          >
            <h2 className="text-2xl font-bold mb-4">Reminders</h2>
            <p style={{ color: 'rgba(247,244,213,0.60)' }}>View your reminders here.</p>
          </div>
        )}

        {activeTab === "insights" && (
          <div
            className="rounded-2xl p-8"
            style={GLASS}
          >
            <h2 className="text-2xl font-bold mb-4">Insights</h2>
            <p style={{ color: 'rgba(247,244,213,0.60)' }}>Your productivity insights will appear here.</p>
          </div>
        )}

        {activeTab === "debrief" && (
          <div
            className="rounded-2xl p-8"
            style={GLASS}
          >
            <h2 className="text-2xl font-bold mb-4">Daily Debrief</h2>
            <p style={{ color: 'rgba(247,244,213,0.60)' }}>Reflect on your day here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
