import React, { useState, useEffect } from 'react';
import {
  Bell,
  User,
  Shield,
  Radio,
  Clock,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { useDemoMode } from '../hooks/useDemoMode';
import { useSystemHealth } from '../hooks/useSystemHealth';

interface Props {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<Props> = ({ onToggleMobileSidebar }) => {
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const { isBackendConnected, responseTimeMs } = useSystemHealth(4000);
  const [time, setTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const notifications = [
    { id: 1, title: 'Rare Attack Detected', desc: 'Heartbleed buffer anomaly blocked on Port 444', time: '1m ago' },
    { id: 2, title: 'Model Optimization Active', desc: 'V4 Feature Processor operational with 15 classes', time: '10m ago' },
    { id: 3, title: 'Stream Synced', desc: 'Real-time flow telemetry pipeline connected', time: '25m ago' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-sm">
      {/* Left side: Mobile Toggle & SOC Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-widest font-mono-code flex items-center gap-2">
              <span>CYVORA SECURITY OPERATIONS CENTER</span>
              <span className="hidden lg:inline-flex text-[10px] px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 font-semibold">
                SOC v2.4
              </span>
            </h2>
          </div>
        </div>
      </div>

      {/* Right side Statuses */}
      <div className="flex items-center gap-2 sm:gap-4 font-mono-code text-xs">
        {/* System Online Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold">SYSTEM ONLINE</span>
        </div>

        {/* Backend Connected / Disconnected Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-slate-500 text-[11px]">Backend:</span>
          {isBackendConnected ? (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              CONNECTED <span className="text-[10px] text-slate-500 font-normal">({responseTimeMs}ms)</span>
            </span>
          ) : (
            <span className="text-amber-700 font-bold">DISCONNECTED</span>
          )}
        </div>

        {/* Model Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-slate-500 text-[11px]">Model:</span>
          <span className="text-sky-700 font-bold">V4 ACTIVE</span>
        </div>

        {/* Dynamic Timestamp */}
        <div className="hidden xl:flex items-center gap-1.5 text-slate-600 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{time || '--:--:--'}</span>
        </div>

        {/* Expo Demo / Live Toggle Pill */}
        <button
          onClick={toggleDemoMode}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
            isDemoMode
              ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-sm'
              : 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm'
          }`}
          title="Toggle between Expo Demo Mode and Live Backend Mode"
        >
          {isDemoMode ? <Sparkles className="w-3.5 h-3.5" /> : <Radio className="w-3.5 h-3.5" />}
          <span>{isDemoMode ? 'DEMO MODE' : 'LIVE MODE'}</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative border border-slate-200 bg-white"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 cyvora-glass rounded-xl border border-slate-200 shadow-xl p-3 space-y-2 z-50 animate-fadeIn bg-white">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 font-mono-code uppercase">
                  SOC ALERT NOTIFICATIONS
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-500 hover:text-slate-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Icon */}
        <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:border-sky-400 cursor-pointer transition-colors" title="SOC Security Analyst">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
