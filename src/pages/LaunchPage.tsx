import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Logo from '../components/ui/Logo';

export default function LaunchPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: '#0A3323' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden" />

      <div className="w-full max-w-2xl text-center relative z-10 animate-fade-in">
        <div className="mb-12">
          <div className="flex justify-center mb-8">
            <Logo to="/" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body font-semibold mb-8" style={{ background: 'rgba(211,150,140,0.15)', color: '#D3968C', border: '1px solid rgba(211,150,140,0.28)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: '#D3968C' }} />
            Launching Soon
          </div>

          <h1 className="font-heading text-5xl md:text-6xl font-semibold mb-6 text-balance leading-tight" style={{ letterSpacing: '-0.035em', color: '#F7F4D5' }}>
            TryKymi
          </h1>

          <p className="text-lg md:text-xl font-body mb-6 text-balance" style={{ color: 'rgba(247,244,213,0.70)', lineHeight: '1.7' }}>
            Your AI Life System
          </p>

          <div className="space-y-4 mb-12">
            <p className="text-base font-body" style={{ color: 'rgba(247,244,213,0.85)' }}>
              TryKymi is getting ready. I'm building something powerful to help you design your life with AI.
            </p>
            <p className="text-sm font-body" style={{ color: 'rgba(247,244,213,0.60)' }}>
              Early version is live. Core intelligence is still being connected.
            </p>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-body font-semibold text-base transition-all hover:opacity-90 active:scale-95"
            style={{ background: '#D3968C', color: '#0A3323' }}
          >
            Enter Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-16 pt-12 border-t" style={{ borderColor: 'rgba(247,244,213,0.08)' }}>
          <p className="text-xs font-body" style={{ color: 'rgba(247,244,213,0.35)' }}>
            Built with intention. Designed for calm.
          </p>
        </div>
      </div>
    </div>
  );
}
