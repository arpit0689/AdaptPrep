import { BarChart3, BookOpen, CalendarDays, CalendarCheck, Home, LogOut, Map, Menu, Settings, Timer } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useAuthStore } from '../store/authStore';

const nav = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const Sidebar = () => (
    <aside className="fixed inset-y-0 left-0 z-30 w-72 border-r border-[#34372f] bg-[#292d32] p-4 text-[#f7f3ea] lg:sticky lg:top-0 lg:block lg:h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">AdaptPrep</h1>
          <p className="text-sm text-[#c9c3b8]">{user?.examName || 'Study OS'}</p>
        </div>
        <Timer className="text-sage-500" />
      </div>
      <nav className="space-y-2">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 font-semibold ${isActive ? 'bg-[#20283d] text-[#e0c063]' : 'text-[#ded8cf] hover:bg-white/5'}`}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-4 left-4 right-4 space-y-3">
        <div className="text-sm text-[#c9c3b8]"><b className="block text-[#f7f3ea]">{user?.name}</b>{user?.email}</div>
        <ThemeToggle />
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-[#ded8cf]" onClick={() => { logout(); navigate('/auth'); }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen lg:flex">
      <button className="surface fixed left-4 top-4 z-40 rounded-xl p-2 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menu">
        <Menu />
      </button>
      <div className={`${open ? 'block' : 'hidden'} lg:block`}><Sidebar /></div>
      <main className="w-full px-4 py-20 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}
