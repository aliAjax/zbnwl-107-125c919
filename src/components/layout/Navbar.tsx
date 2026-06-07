import { NavLink } from 'react-router-dom';
import { Calendar, BookOpen, Tag, DoorOpen, User, Sparkles, LayoutDashboard, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: '排期日历', icon: Calendar },
  { path: '/dashboard', label: '运营看板', icon: LayoutDashboard },
  { path: '/scripts', label: '剧本管理', icon: BookOpen },
  { path: '/script-types', label: '剧本类型', icon: Tag },
  { path: '/rooms', label: '房间管理', icon: DoorOpen },
  { path: '/hosts', label: '主持人', icon: User },
  { path: '/customers', label: '客户管理', icon: Users }
];

export function Navbar() {
  return (
    <nav className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white font-display leading-tight">
              剧本杀排期系统
            </h1>
            <p className="text-xs text-slate-400">Script Killer Scheduler</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  )
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="w-32" />
      </div>
    </nav>
  );
}
