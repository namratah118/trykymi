import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import FloatingNav from './FloatingNav';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: '#0A3323' }}>
      <FloatingNav />

      <main className="pt-20 sm:pt-28 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      <Link
        to="/assistant"
        className="floating-chat w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group hover:scale-110 active:scale-95"
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
