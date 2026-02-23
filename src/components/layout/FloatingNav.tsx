import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, User, LogOut, ChevronDown, CalendarDays, Target, Bell, CheckSquare, BarChart2, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/plan', icon: CalendarDays, label: 'Plan' },
  { path: '/habits', icon: Target, label: 'Habits' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/reminders', icon: Bell, label: 'Reminders' },
  { path: '/insights', icon: BarChart2, label: 'Insights' },
  { path: '/debrief', icon: Moon, label: 'Debrief' },
  { path: '/assistant', icon: MessageSquare, label: 'AI' },
];

export default function FloatingNav() {
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const displayName = (user?.user_metadata?.full_name as string) || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header
      className="fixed top-2 sm:top-4 left-1/2 z-50 animate-slide-down w-full px-3 sm:px-4 md:px-6 lg:px-8 overflow-x-hidden"
      style={{ transform: 'translateX(-50%)', maxWidth: '100vw' }}
    >
      <div className="flex items-center h-14 sm:h-16 md:h-20 gap-2 sm:gap-3 md:gap-6 max-w-7xl mx-auto w-full overflow-x-hidden">
        <div
          className="w-full flex items-center justify-between px-3 sm:px-4 md:px-6 py-0 rounded-lg h-14 sm:h-16 md:h-20 overflow-x-hidden"
          style={{
            background: 'rgba(10,51,35,0.4)',
            border: '1px solid rgba(247,244,213,0.05)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          }}
        >
          <nav className="hidden md:flex items-center gap-0.5 h-full overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-0 rounded-lg font-medium transition-all duration-200 h-full flex-shrink-0"
                style={({ isActive }) => isActive
                  ? { background: '#D3968C', color: '#0A3323', fontSize: '14px', md: '16px', fontWeight: 500, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }
                  : { color: 'rgba(247,244,213,0.70)', fontSize: '14px', md: '16px', fontWeight: 500, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }
                }
                onMouseEnter={(e) => {
                  const link = e.currentTarget;
                  const isActive = (link.getAttribute('class') || '').includes('active');
                  if (!isActive) {
                    (link as HTMLElement).style.background = 'rgba(247,244,213,0.06)';
                    (link as HTMLElement).style.color = '#F7F4D5';
                  }
                }}
                onMouseLeave={(e) => {
                  const link = e.currentTarget;
                  const isActive = (link.getAttribute('class') || '').includes('active');
                  if (!isActive) {
                    (link as HTMLElement).style.background = 'transparent';
                    (link as HTMLElement).style.color = 'rgba(247,244,213,0.70)';
                  }
                }}
              >
                <item.icon style={{ width: '16px', height: '16px' }} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="relative ml-auto flex items-center h-full">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 rounded-lg transition-all h-full"
              style={{ background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(247,244,213,0.06)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center font-medium text-sm"
                style={{ background: '#839958', color: '#0A3323', fontWeight: 600 }}
              >
                {initials}
              </div>
              <ChevronDown className="w-4 h-4 hidden sm:block" style={{ color: 'rgba(247,244,213,0.60)' }} />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div
                  className="absolute right-0 top-full mt-1.5 w-44 rounded-lg py-1 z-20 animate-scale-in"
                  style={{
                    background: 'rgba(10,51,35,0.90)',
                    border: '1px solid rgba(247,244,213,0.08)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.20)',
                  }}
                >
                  <div className="px-3 py-2.5" style={{ borderBottom: '1px solid rgba(247,244,213,0.08)' }}>
                    <p className="truncate" style={{ color: '#F7F4D5', fontSize: '14px', fontWeight: 500, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>{displayName}</p>
                    <p className="truncate mt-0.5" style={{ color: '#839958', fontSize: '12px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 transition-colors text-sm"
                    style={{ color: 'rgba(247,244,213,0.70)', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: '14px' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(247,244,213,0.08)';
                      (e.currentTarget as HTMLElement).style.color = '#F7F4D5';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(247,244,213,0.70)';
                    }}
                  >
                    <User className="w-3.5 h-3.5" />
                    Profile
                  </Link>
                  <button
                    onClick={() => { setDropdownOpen(false); signOut(); }}
                    className="flex items-center gap-2.5 px-3 py-2 w-full text-left transition-colors text-sm"
                    style={{ color: '#D3968C', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: '14px' }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(211,150,140,0.08)'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <nav className="md:hidden mt-2 w-full px-3 sm:px-4 flex items-center gap-0.5 overflow-x-auto pb-1 scrollbar-thin max-w-7xl mx-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex-shrink-0 flex items-center gap-0.5 px-2 py-1 rounded-lg transition-all duration-200 text-xs"
            style={({ isActive }) => isActive
              ? { background: '#D3968C', color: '#0A3323', fontWeight: 500, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }
              : { color: 'rgba(247,244,213,0.60)', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }
            }
          >
            <item.icon style={{ width: '14px', height: '14px' }} />
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
