import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import FloatingNav from './FloatingNav';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: '#0A3323', minHeight: '100vh', overflow: 'hidden' }}>
      <FloatingNav />

      <main className="pt-32 pb-24 px-6" style={{ overflow: 'hidden' }}>
        <div className="max-w-6xl mx-auto px-8" style={{ animation: 'none', transform: 'none', transition: 'none' }}>
          {children}
        </div>
      </main>

      <Link
        to="/assistant"
        className="fixed bottom-7 right-7 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group hover:scale-110 active:scale-95"
        style={{ background: '#D3968C', boxShadow: '0 4px 16px rgba(211,150,140,0.25)' }}
        title="Ask Kymi"
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
        <MessageSquare className="w-6 h-6 transition-transform" style={{ color: '#0A3323' }} />
      </Link>
    </div>
  );
}
