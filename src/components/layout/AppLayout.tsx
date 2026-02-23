import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import FloatingNav from './FloatingNav';
import PageHeader from '../ui/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useDailyBrain } from '../../hooks/useDailyBrain';
import { useMemoryInsights } from '../../hooks/useMemoryInsights';
import BrainSuggestion from '../BrainSuggestion';
import MemoryInsight from '../MemoryInsight';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const { suggestion, setSuggestion } = useDailyBrain(user?.id);
  const { insight, isVisible, setIsVisible } = useMemoryInsights(user?.id);

  return (
    <div className="min-h-screen w-screen overflow-x-hidden flex flex-col" style={{ background: '#0A3323' }}>
      <PageHeader />
      <FloatingNav />
      <BrainSuggestion suggestion={suggestion} onDismiss={() => setSuggestion(null)} />
      <MemoryInsight insight={insight} isVisible={isVisible} onDismiss={() => setIsVisible(false)} />

      <main className="pt-20 sm:pt-28 md:pt-32 pb-24 px-3 sm:px-4 md:px-6 lg:px-8 w-full flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      <Link
        to="/assistant"
        className="fixed z-40 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 sm:w-14 sm:h-14 w-12 h-12"
        style={{
          bottom: '16px',
          right: '16px',
          background: '#D3968C',
          boxShadow: '0 4px 16px rgba(211,150,140,0.25)'
        }}
        title="Ask TryKymi"
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = '#c9886e';
          el.style.boxShadow = '0 8px 24px rgba(211,150,140,0.35)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = '#D3968C';
          el.style.boxShadow = '0 4px 16px rgba(211,150,140,0.25)';
        }}
      >
        <MessageSquare className="w-5 h-5 transition-transform" style={{ color: '#0A3323' }} />
      </Link>
    </div>
  );
}
