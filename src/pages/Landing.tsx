import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Zap, BarChart3, Heart } from 'lucide-react';
import Logo from '../components/ui/Logo';

export default function Landing() {
  const features = [
    {
      icon: CheckCircle2,
      title: 'Smart Task Management',
      description: 'Organize and prioritize your tasks with intelligent planning'
    },
    {
      icon: Heart,
      title: 'Habit Tracking',
      description: 'Build better habits with daily streaks and progress insights'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Track your productivity and see patterns in your behavior'
    },
    {
      icon: Zap,
      title: 'AI Assistant',
      description: 'Get personalized recommendations from your AI lifestyle coach'
    },
  ];

  return (
    <div className="min-h-screen w-full" style={{ background: '#0A3323', color: '#F7F4D5' }}>
      <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full">
        <Logo to="/" />
        <div className="flex gap-2 sm:gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium transition-colors"
            style={{ color: 'rgba(247,244,213,0.70)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#F7F4D5'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(247,244,213,0.70)'}
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-lg font-medium transition-all"
            style={{ background: '#D3968C', color: '#0A3323' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >
            Get started
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
        <div className="text-center mb-16 sm:mb-20 lg:mb-28">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mb-4 sm:mb-6 leading-tight"
            style={{ color: '#F7F4D5' }}
          >
            Your AI Lifestyle<br />Assistant
          </h1>
          <p
            className="text-lg sm:text-xl mb-8 sm:mb-10"
            style={{ color: 'rgba(247,244,213,0.70)' }}
          >
            Plan your day, track your habits, and achieve your goals with intelligent assistance
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all hover:scale-105"
            style={{ background: '#D3968C', color: '#0A3323' }}
          >
            Start for free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl transition-all hover:scale-105"
                style={{
                  background: 'rgba(247,244,213,0.05)',
                  border: '1px solid rgba(247,244,213,0.10)',
                }}
              >
                <Icon className="w-8 h-8 sm:w-10 sm:h-10 mb-4" style={{ color: '#D3968C' }} />
                <h3 className="text-lg sm:text-xl font-heading font-semibold mb-2" style={{ color: '#F7F4D5' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'rgba(247,244,213,0.55)' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </main>

      <footer
        className="border-t py-8 mt-16 sm:mt-20"
        style={{ borderColor: 'rgba(247,244,213,0.08)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ color: 'rgba(247,244,213,0.50)' }}>
          <p className="text-sm">© 2024 Kymi - Your Personal AI Assistant</p>
        </div>
      </footer>
    </div>
  );
}
