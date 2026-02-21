import { useState } from 'react';
import { Bell, ChevronDown, Settings, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  title: string;
  subtitle?: string;
}

export default function Navbar({ title, subtitle }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const displayName = (user?.user_metadata?.full_name as string) || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="h-20 flex items-center justify-between px-6 flex-shrink-0" style={{ backgroundColor: 'rgba(10,51,35,0.4)', border: '1px solid rgba(247,244,213,0.05)', borderRadius: '14px', margin: '12px 24px', padding: '12px 24px' }}>
      <div className="flex flex-col justify-center">
        <h1 className="font-heading text-xl font-semibold leading-tight" style={{ color: '#F7F4D5', fontWeight: 600 }}>{title}</h1>
        {subtitle && <p className="text-xs" style={{ color: 'rgba(247,244,213,0.50)', fontWeight: 400 }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors" style={{ color: 'rgba(247,244,213,0.60)' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#F7F4D5'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(247,244,213,0.60)'}>
          <Bell style={{ width: '18px', height: '18px' }} />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(247,244,213,0.06)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold"
              style={{ background: '#839958', color: '#0A3323', fontWeight: 600 }}>
              {initials}
            </div>
            <span className="text-sm font-medium hidden sm:block max-w-[120px] truncate" style={{ color: '#F7F4D5', fontWeight: 500 }}>
              {displayName}
            </span>
            <ChevronDown className="w-3.5 h-3.5" style={{ color: 'rgba(247,244,213,0.60)' }} />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-48 rounded-lg border z-20 py-1 animate-fade-in" style={{ background: 'rgba(10,51,35,0.90)', border: '1px solid rgba(247,244,213,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.20)' }}>
                <Link
                  to="/profile"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                  style={{ color: 'rgba(247,244,213,0.70)', fontWeight: 500 }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(247,244,213,0.08)';
                    (e.currentTarget as HTMLElement).style.color = '#F7F4D5';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(247,244,213,0.70)';
                  }}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                  style={{ color: 'rgba(247,244,213,0.70)', fontWeight: 500 }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(247,244,213,0.08)';
                    (e.currentTarget as HTMLElement).style.color = '#F7F4D5';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(247,244,213,0.70)';
                  }}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <div className="my-1" style={{ borderTop: '1px solid rgba(247,244,213,0.08)' }} />
                <button
                  onClick={() => { setShowDropdown(false); signOut(); }}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors w-full"
                  style={{ color: '#D3968C', fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(211,150,140,0.08)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
