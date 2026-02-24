import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, Target, Bell, CheckSquare,
  BarChart2, Moon, MessageSquare, User, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/plan', icon: CalendarDays, label: "Today's Plan" },
  { path: '/habits', icon: Target, label: 'Habits' },
  { path: '/reminders', icon: Bell, label: 'Reminders' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/insights', icon: BarChart2, label: 'Time Analytics' },
  { path: '/debrief', icon: Moon, label: 'Daily Debrief' },
  { path: '/assistant', icon: MessageSquare, label: 'AI Assistant' },
];

const bottomNavItems = [
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const displayName = (user?.user_metadata?.full_name as string) || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside className="w-60 min-h-screen flex flex-col" style={{ background: '#0A3323' }}>
      <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(247,244,213,0.08)' }}>
        <div className="flex items-center">
          <img src="/image.png" alt="kymi" style={{ height: '32px', objectFit: 'contain' }} />
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#839958', fontWeight: 600 }}>Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => `sidebar-link group ${isActive ? 'active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className="flex-shrink-0"
                  style={{ width: '18px', height: '18px', color: isActive ? '#839958' : 'inherit' }}
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-4 mt-2" style={{ borderTop: '1px solid rgba(247,244,213,0.08)' }}>
          <p className="px-3 mb-2 text[10px] font-semibold uppercase tracking-widest" style={{ color: '#839958', fontWeight: 600 }}>Account</p>
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link group ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className="flex-shrink-0"
                    style={{ width: '18px', height: '18px', color: isActive ? '#D3968C' : 'inherit' }}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(247,244,213,0.08)' }}>
        <div className="flex items-center gap-3 p-3 rounded-xl mb-2" style={{ background: 'rgba(247,244,213,0.06)', border: '1px solid rgba(247,244,213,0.08)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0"
            style={{ background: '#D3968C', color: '#0A3323', fontWeight: 600 }}>
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold truncate" style={{ color: '#F7F4D5', fontWeight: 600 }}>{displayName}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(247,244,213,0.50)', fontWeight: 500 }}>{user?.email}</p>
          </div>
        </div>
        <button
          onClick={async () => {
            await signOut();
            navigate('/login', { replace: true });
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl transition-all duration-200"
          style={{ color: '#D3968C', fontWeight: 500 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(211,150,140,0.12)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
