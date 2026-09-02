import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  BarChart2,
  Shield,
  Zap,
  Cpu,
  Server,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isRare?: boolean;
}

export const Sidebar: React.FC<Props> = ({ collapsed, onToggleCollapse }) => {
  const navItems: NavItem[] = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/live-detection', label: 'Live Detection', icon: Radio, badge: 'LIVE' },
    { to: '/threat-analytics', label: 'Threat Analytics', icon: BarChart2 },
    { to: '/attack-intelligence', label: 'Attack Intelligence', icon: Shield },
    { to: '/rare-attacks', label: 'Rare Attacks', icon: Zap, badge: 'V4 FOCUS', isRare: true },
    { to: '/ai-prediction', label: 'AI Prediction', icon: Cpu },
    { to: '/model-intelligence', label: 'Model Intelligence', icon: Activity },
    { to: '/api-monitor', label: 'API Monitor', icon: Server },
    { to: '/system-health', label: 'System Health', icon: ShieldAlert },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 shadow-sm ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 bg-slate-50/70">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-mono-code font-black text-lg text-slate-900 tracking-wider flex items-center gap-1.5">
                  CYVORA
                </h1>
                <p className="text-[9px] font-mono-code font-bold tracking-widest text-sky-600 uppercase">
                  AI SECURITY ENGINE
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto p-2 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors hidden md:flex"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 relative group ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-sky-600' : 'text-slate-500'
                      }`}
                    />

                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-mono-code font-bold uppercase ${
                              item.isRare
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : 'bg-sky-100 text-sky-700 border border-sky-200'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sky-600 rounded-r-full" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Status */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70">
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-800 font-mono-code">CYVORA AI ENGINE</span>
              <span className="flex items-center gap-1 text-[10px] font-mono-code font-bold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            </div>
            <p className="text-[10px] text-slate-500 truncate">V4 Rare Attack Optimized</p>
          </div>
        ) : (
          <div className="flex justify-center py-2" title="CYVORA AI ENGINE: ONLINE">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
          </div>
        )}
      </div>
    </aside>
  );
};
