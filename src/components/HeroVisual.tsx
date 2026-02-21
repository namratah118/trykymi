import { CheckCircle, Brain, BarChart2 } from 'lucide-react';
import CountUp from './ui/CountUp';

export default function HeroVisual() {
  return (
    <div className="relative h-full flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 60% 50%, rgba(211,150,140,0.08) 0%, transparent 70%)',
      }} />

      <div className="relative w-full h-full max-w-sm">
        <div
          className="absolute top-0 left-4 rounded-2xl p-4 backdrop-blur-xl hover-lift cursor-default"
          style={{
            background: 'rgba(16,86,102,0.45)',
            border: '1px solid rgba(131,153,88,0.30)',
            width: '280px',
            animation: 'floatSlow 6s ease-in-out infinite',
            filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.20))',
          }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(211,150,140,0.25)' }}>
              <Brain className="w-5 h-5" style={{ color: '#D3968C' }} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold" style={{ color: '#F7F4D5' }}>Focus State</p>
              <p className="text-xs" style={{ color: 'rgba(247,244,213,0.60)' }}>Deep work</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(131,153,88,0.25)' }}>
              <CheckCircle className="w-4 h-4" style={{ color: '#839958' }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: '#839958' }}>2h 45m</span>
          </div>
        </div>

        <div
          className="absolute top-32 right-6 rounded-2xl p-4 backdrop-blur-xl hover-lift cursor-default"
          style={{
            background: 'rgba(16,86,102,0.45)',
            border: '1px solid rgba(131,153,88,0.30)',
            width: '260px',
            animation: 'floatDelay1 5.5s ease-in-out infinite 0.3s',
            filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.20))',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold" style={{ color: '#F7F4D5' }}>Today's Score</p>
              <p className="text-xs" style={{ color: 'rgba(247,244,213,0.60)' }}>Productivity</p>
            </div>
            <CountUp end={87} duration={2.5} className="text-2xl font-bold" style={{ color: '#D3968C' }} />
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(131,153,88,0.15)' }}>
            <div className="h-full w-[87%] rounded-full" style={{ background: '#839958' }} />
          </div>
        </div>

        <div
          className="absolute bottom-20 left-2 rounded-2xl p-4 backdrop-blur-xl hover-lift cursor-default"
          style={{
            background: 'rgba(16,86,102,0.45)',
            border: '1px solid rgba(131,153,88,0.30)',
            width: '270px',
            animation: 'floatDelay2 6.5s ease-in-out infinite 0.6s',
            filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.20))',
          }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(211,150,140,0.25)' }}>
              <BarChart2 className="w-5 h-5" style={{ color: '#D3968C' }} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold" style={{ color: '#F7F4D5' }}>This Week</p>
              <p className="text-xs" style={{ color: 'rgba(247,244,213,0.60)' }}>5 habits complete</p>
              <p className="text-xs font-semibold mt-1" style={{ color: '#839958' }}>+12% vs last week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
