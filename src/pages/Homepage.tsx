import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Brain, CalendarDays, Target, BarChart2, Moon, Sparkles, X,
  MessageSquare, Zap, Heart, CheckSquare
} from 'lucide-react';
import Logo from '../components/ui/Logo';
import HeroVisual from '../components/HeroVisual';

const FEATURES = [
  {
    icon: Brain,
    title: 'Daily AI reflection',
    description: 'Every morning, trykymi checks in on your mood, energy, and intention — then shapes your day around you.',
  },
  {
    icon: CalendarDays,
    title: 'Intentional planning',
    description: 'A living plan that adjusts as your day evolves, built around what actually matters to you.',
  },
  {
    icon: Target,
    title: 'Habits that stick',
    description: 'Build streaks, understand your patterns. trykymi celebrates your consistency quietly.',
  },
  {
    icon: BarChart2,
    title: 'Time clarity',
    description: 'See exactly where your hours go — to help you reclaim the time that belongs to you.',
  },
  {
    icon: Sparkles,
    title: 'AI that understands you',
    description: 'Ask trykymi anything about your day, your habits, your goals. It listens and responds like it cares.',
  },
  {
    icon: Moon,
    title: 'End-of-day debrief',
    description: 'Close each day with intention. Reflect on what worked and what tomorrow could look like.',
  },
];

const STEPS = [
  { n: '01', title: 'Tell trykymi about yourself', body: 'A short onboarding that captures your goals and patterns. Two minutes. Done.' },
  { n: '02', title: 'Start each day with intention', body: 'Your morning check-in builds a personalized plan around your energy and mood.' },
  { n: '03', title: 'Live with more clarity', body: 'Over time, trykymi learns what works for you. Less friction. More flow.' },
];

function useScrollReveal() {
  const refs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    refs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  const addRef = (el: HTMLElement | null) => {
    if (el && !refs.current.includes(el)) {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      refs.current.push(el);
    }
    return el;
  };
  return addRef;
}

function WelcomePopup({ onClose, onStart }: { onClose: () => void; onStart: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative w-full max-w-md animate-scale-in overflow-hidden"
        style={{
          background: 'rgba(10,51,35,0.95)',
          border: '1px solid rgba(247,244,213,0.08)',
          borderRadius: '14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.20)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: '#D3968C' }} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors z-10"
          style={{ background: 'rgba(247,244,213,0.08)', color: 'rgba(247,244,213,0.60)' }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,244,213,0.12)'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,244,213,0.08)'}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 pt-10">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: 'rgba(211,150,140,0.25)', border: '1px solid rgba(211,150,140,0.35)' }}
          >
            <Sparkles className="w-6 h-6" style={{ color: '#D3968C' }} />
          </div>

          <h2 className="font-heading text-3xl font-semibold mb-2" style={{ color: '#F7F4D5', letterSpacing: '-0.03em' }}>
            Welcome to trykymi
          </h2>
          <p className="font-body text-base mb-8" style={{ color: 'rgba(247,244,213,0.60)' }}>
            Design your calm, intentional life
          </p>

          <div className="space-y-3">
            <Link
              to="/signup"
              onClick={onStart}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-body font-semibold text-base transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#D3968C', color: '#0A3323' }}
            >
              Start my journey
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-body font-semibold text-base transition-all active:scale-95"
              style={{ background: 'transparent', color: '#F7F4D5', border: '1px solid #839958' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(131,153,88,0.08)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
            >
              Explore first
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm animate-scale-in overflow-hidden p-6"
        style={{
          background: 'rgba(10,51,35,0.95)',
          border: '1px solid rgba(247,244,213,0.08)',
          borderRadius: '14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.20)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: 'rgba(247,244,213,0.08)', color: 'rgba(247,244,213,0.6)' }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,244,213,0.12)'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(247,244,213,0.08)'}
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <p className="text-xs font-body font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(247,244,213,0.40)' }}>Demo conversation</p>
        {[
          { from: 'user', text: 'I feel tired today and have a big presentation.' },
          { from: 'kymi', text: "That's a tough combination. Let's protect your energy — I'll schedule your deepest work first when you're freshest, and keep the afternoon lighter. You've got this." },
          { from: 'user', text: 'What should I focus on first?' },
          { from: 'kymi', text: "Start with a 20-minute review of your slides — just enough to feel grounded, not overwhelmed. Then rest before the presentation itself." },
        ].map((msg, i) => (
          <div key={i} className={`mb-3 ${msg.from === 'user' ? 'text-right' : 'text-left'}`}>
            <div
              className="inline-block max-w-[85%] px-4 py-2.5 rounded-2xl text-sm font-body"
              style={msg.from === 'user'
                ? { background: 'rgba(211,150,140,0.25)', color: 'rgba(247,244,213,0.85)', borderBottomRightRadius: '6px' }
                : { background: 'rgba(131,153,88,0.15)', color: 'rgba(247,244,213,0.80)', borderBottomLeftRadius: '6px', fontStyle: 'italic' }
              }
            >
              {msg.from === 'kymi' && <span className="text-[10px] font-semibold not-italic block mb-1" style={{ color: '#D3968C' }}>trykymi</span>}
              {msg.text}
            </div>
          </div>
        ))}
        <Link
          to="/signup"
          className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-body font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: '#D3968C', color: '#0A3323' }}
        >
          Try trykymi for free <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function Homepage() {
  const [showPopup, setShowPopup] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const reveal = useScrollReveal();

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ background: '#0A3323', minHeight: '100vh' }}>

      {showPopup && (
        <WelcomePopup
          onClose={() => setShowPopup(false)}
          onStart={() => setShowPopup(false)}
        />
      )}

      {demoOpen && <DemoModal onClose={() => setDemoOpen(false)} />}

      <div
        className="fixed top-5 right-5 sm:top-3.5 sm:right-3.5 z-9999 px-4 py-2 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-[11px] font-body font-medium animate-fade-in"
        style={{
          background: 'rgba(10,51,35,0.85)',
          color: '#F7F4D5',
          border: '1px solid rgba(247,244,213,0.25)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        Launching Soon
      </div>

      <header className="fixed top-4 left-1/2 z-40 animate-slide-down" style={{ transform: 'translateX(-50%)', width: 'calc(100% - 2rem)', maxWidth: '900px' }}>
        <div
          className="flex items-center justify-between px-5 py-3 rounded-2xl"
          style={{
            background: 'rgba(10,51,35,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(247,244,213,0.10)',
          }}
        >
          <Logo to="/" />
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-body font-medium transition-colors" style={{ color: 'rgba(247,244,213,0.65)' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#F7F4D5'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(247,244,213,0.65)'}>Features</a>
            <a href="#how-it-works" className="text-sm font-body font-medium transition-colors" style={{ color: 'rgba(247,244,213,0.65)' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#F7F4D5'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(247,244,213,0.65)'}>How it works</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm font-body font-semibold transition-all rounded-xl"
              style={{ color: 'rgba(247,244,213,0.75)' }}
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="px-4 py-1.5 text-sm font-body font-semibold rounded-xl transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#D3968C', color: '#0A3323' }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="pt-40 pb-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-3xl animate-slide-up">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body font-semibold mb-8"
                style={{ background: 'rgba(211,150,140,0.20)', color: '#D3968C', border: '1px solid rgba(211,150,140,0.25)' }}
              >
                <Sparkles className="w-3 h-3" />
                Powered by GPT-4o mini
              </div>

              <h1 className="font-semibold mb-6 text-balance" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: '48px', lineHeight: '1.08', letterSpacing: '-0.035em', color: '#F7F4D5', fontWeight: 600 }}>
                Your personal AI for a calmer, intentional life
              </h1>

              <p className="text-lg font-body leading-relaxed mb-10 max-w-xl" style={{ color: 'rgba(247,244,213,0.60)', lineHeight: '1.7' }}>
                trykymi helps you reclaim your time, reduce stress, and live better — one intentional day at a time.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-body font-semibold text-base transition-all hover:opacity-90 active:scale-95"
                  style={{ background: '#D3968C', color: '#0A3323' }}
                >
                  Start your journey
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setDemoOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-body font-semibold text-base transition-all active:scale-95"
                  style={{ background: 'transparent', color: '#F7F4D5', border: '1px solid #839958' }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(131,153,88,0.08)'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
                >
                  <MessageSquare className="w-4 h-4" />
                  See how trykymi works
                </button>
              </div>

              <p className="text-sm font-body mt-5" style={{ color: 'rgba(247,244,213,0.35)' }}>Free to start. No credit card required.</p>
            </div>

            <div
              className="hidden lg:block h-96 relative"
              style={{
                animation: 'fadeInBlur 1.2s ease-out 0.4s both',
              }}
            >
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            ref={el => reveal(el as HTMLElement)}
            className="overflow-hidden relative p-8 md:p-10"
            style={{
              background: 'rgba(247,244,213,0.05)',
              border: '1px solid rgba(247,244,213,0.10)',
              borderRadius: '14px',
            }}
          >
            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs font-body font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(247,244,213,0.40)' }}>Your daily companion</p>
                <h2 className="font-heading text-3xl font-semibold mb-4" style={{ letterSpacing: '-0.025em', lineHeight: '1.2', color: '#F7F4D5' }}>
                  A morning that sets the tone for everything
                </h2>
                <p className="text-sm font-body leading-relaxed mb-6" style={{ color: 'rgba(247,244,213,0.60)' }}>
                  trykymi greets you every morning, checks in on how you feel, and builds your day around your energy — not against it.
                </p>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 text-sm font-body font-semibold transition-colors hover:opacity-80"
                  style={{ color: '#D3968C' }}
                >
                  Try it free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div
                className="rounded-2xl p-5"
                style={{ background: 'rgba(247,244,213,0.05)', border: '1px solid rgba(247,244,213,0.10)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-body" style={{ color: 'rgba(247,244,213,0.45)' }}>Good morning</p>
                    <p className="font-heading text-lg font-semibold" style={{ color: '#F7F4D5' }}>Namrata</p>
                  </div>
                  <div className="relative w-14 h-14">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(247,244,213,0.12)" strokeWidth="5" />
                      <circle cx="28" cy="28" r="22" fill="none" stroke="#D3968C" strokeWidth="5" strokeDasharray="100 138" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-heading text-base font-semibold" style={{ color: '#F7F4D5' }}>82</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(211,150,140,0.12)', border: '1px solid rgba(211,150,140,0.20)' }}>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#D3968C' }} />
                    <p className="text-xs font-body leading-relaxed" style={{ color: 'rgba(247,244,213,0.78)', fontStyle: 'italic' }}>
                      "You slept well and energy is high — a good day to tackle something you've been avoiding."
                    </p>
                  </div>
                </div>

                {[
                  { label: 'Deep work block', time: '9:00', done: true },
                  { label: 'Lunch walk', time: '13:00', done: false },
                  { label: 'Team sync', time: '15:00', done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-2 py-2 rounded-lg mb-1">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0`} style={item.done ? { border: '1px solid #D3968C', background: '#D3968C' } : { border: '1px solid rgba(247,244,213,0.20)' }}>
                      {item.done && (
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#0A3323" strokeWidth="3.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs font-body flex-1" style={{ color: item.done ? 'rgba(247,244,213,0.35)' : 'rgba(247,244,213,0.78)', textDecoration: item.done ? 'line-through' : 'none' }}>{item.label}</span>
                    <span className="text-xs font-body" style={{ color: 'rgba(247,244,213,0.35)' }}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14" ref={el => reveal(el as HTMLElement)}>
            <p className="text-xs font-body font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(211,150,140,0.70)' }}>What trykymi does</p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold max-w-lg" style={{ letterSpacing: '-0.025em', lineHeight: '1.15', color: '#F7F4D5' }}>
              Every feature built around one thing: your wellbeing.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                ref={el => reveal(el as HTMLElement)}
                className="group rounded-2xl p-6 cursor-default hover-lift"
                style={{
                  transitionDelay: `${i * 0.07}s`,
                  background: 'rgba(247,244,213,0.05)',
                  border: '1px solid rgba(247,244,213,0.10)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = 'rgba(247,244,213,0.08)';
                  el.style.borderColor = 'rgba(211,150,140,0.35)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = 'rgba(247,244,213,0.05)';
                  el.style.borderColor = 'rgba(247,244,213,0.10)';
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: 'rgba(211,150,140,0.18)', border: '1px solid rgba(211,150,140,0.25)' }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: '#D3968C' }} />
                </div>
                <h3 className="font-heading text-base font-semibold mb-2" style={{ color: '#F7F4D5' }}>{feature.title}</h3>
                <p className="text-sm font-body leading-relaxed" style={{ color: 'rgba(247,244,213,0.58)' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14" ref={el => reveal(el as HTMLElement)}>
            <p className="text-xs font-body font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(211,150,140,0.70)' }}>How it works</p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold max-w-lg" style={{ letterSpacing: '-0.025em', lineHeight: '1.15', color: '#F7F4D5' }}>
              Three steps to a more intentional life.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} ref={el => reveal(el as HTMLElement)} style={{ transitionDelay: `${i * 0.12}s` }}>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(211,150,140,0.18)', border: '1px solid rgba(211,150,140,0.28)' }}
                >
                  <span className="font-heading text-xl font-semibold" style={{ color: '#D3968C' }}>{s.n}</span>
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3" style={{ letterSpacing: '-0.02em', color: '#F7F4D5' }}>{s.title}</h3>
                <p className="text-sm font-body leading-relaxed" style={{ color: 'rgba(247,244,213,0.55)' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            ref={el => reveal(el as HTMLElement)}
            className="p-10 md:p-14 text-center"
            style={{
              background: 'rgba(247,244,213,0.05)',
              border: '1px solid rgba(247,244,213,0.10)',
              borderRadius: '14px',
            }}
          >
            <div>
              <div className="flex items-center justify-center gap-3 mb-6">
                {[Heart, Zap, CheckSquare].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(211,150,140,0.18)' }}>
                    <Icon className="w-5 h-5" style={{ color: '#D3968C' }} />
                  </div>
                ))}
              </div>
              <h2 className="font-heading text-3xl md:text-5xl font-semibold mb-5 text-balance" style={{ letterSpacing: '-0.03em', lineHeight: '1.15', color: '#F7F4D5' }}>
                Start designing your best life today
              </h2>
              <p className="text-base font-body mb-10 max-w-md mx-auto" style={{ color: 'rgba(247,244,213,0.55)', lineHeight: '1.7' }}>
                Free to start. No credit card. No complexity. Just a calmer, more intentional version of your day — beginning tomorrow morning.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-body font-semibold text-base transition-all hover:opacity-90 active:scale-95"
                style={{ background: '#D3968C', color: '#0A3323' }}
              >
                Start your journey
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid rgba(247,244,213,0.08)' }}>
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo to="/" />
          <p className="text-xs font-body text-center" style={{ color: 'rgba(247,244,213,0.35)' }}>
            © {new Date().getFullYear()} trykymi · Your AI lifestyle companion
          </p>
          <div className="flex gap-5">
            <Link to="/login" className="text-xs font-body transition-colors" style={{ color: 'rgba(247,244,213,0.40)' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#F7F4D5'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(247,244,213,0.40)'}>Sign in</Link>
            <Link to="/signup" className="text-xs font-body transition-colors" style={{ color: 'rgba(247,244,213,0.40)' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#F7F4D5'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(247,244,213,0.40)'}>Get started</Link>
          </div>
        </div>
      </footer>

      <button
        onClick={() => setDemoOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ background: '#D3968C', boxShadow: '0 8px 32px rgba(211,150,140,0.40)', color: '#0A3323' }}
        title="See trykymi in action"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}
