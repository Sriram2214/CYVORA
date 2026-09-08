import React from 'react';
import { Zap, RefreshCw, Radio } from 'lucide-react';
import { LiveThreatTable } from '../components/monitor/LiveThreatTable';
import { Button } from '../components/common/Button';
import { useThreatStream } from '../hooks/useThreatStream';
import { useDemoMode } from '../hooks/useDemoMode';

export const LiveDetection: React.FC = () => {
  const { isDemoMode } = useDemoMode();
  const {
    events,
    isPaused,
    togglePause,
    filterSeverity,
    setFilterSeverity,
    filterAttack,
    setFilterAttack,
    searchQuery,
    setSearchQuery,
    clearEvents,
    addNewEvent,
  } = useThreatStream(25, 2000);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 cyber-glass rounded-xl border border-cyan-500/30 bg-[#070D1D]/90 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono-code text-xs">
            <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 font-bold border border-rose-500/40 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              LIVE SOC STREAM
            </span>
            <span className="text-cyan-400 font-medium">/ Network Intrusion Inspection</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-wider font-mono-code">
            LIVE NETWORK THREAT MONITOR
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl font-sans">
            Real-time inspection of incoming network flows, automated anomaly scoring, and instant threat triage.
          </p>
        </div>

        <div className="flex items-center gap-2.5 font-mono-code text-xs">
          <button
            onClick={() => addNewEvent()}
            className="px-3.5 py-2 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold hover:bg-cyan-900/60 transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>INJECT PROBE FLOW</span>
          </button>

          <button
            onClick={clearEvents}
            className="px-3.5 py-2 rounded-lg bg-rose-950 border border-rose-500/40 text-rose-300 font-bold hover:bg-rose-900/60 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-rose-400" />
            <span>CLEAR LOG</span>
          </button>
        </div>
      </div>

      {/* Mini live counter bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-code text-xs">
        <div className="p-3.5 cyber-glass rounded-xl border border-slate-800 bg-[#080E1C]/90 shadow-lg flex items-center justify-between">
          <span className="text-slate-400 font-semibold">BUFFERED EVENTS:</span>
          <span className="font-bold text-white text-sm">{events.length}</span>
        </div>
        <div className="p-3.5 cyber-glass rounded-xl border border-rose-500/30 bg-rose-950/20 shadow-lg flex items-center justify-between">
          <span className="text-rose-400 font-semibold">ACTIVE THREATS:</span>
          <span className="font-bold text-rose-400 text-sm">
            {events.filter((e) => e.isAttack).length}
          </span>
        </div>
        <div className="p-3.5 cyber-glass rounded-xl border border-purple-500/40 bg-purple-950/40 shadow-lg flex items-center justify-between">
          <span className="text-black bg-purple-200 px-2 py-0.5 rounded font-black text-xs border border-purple-400">RARE ATTACKS:</span>
          <span className="font-black text-black bg-purple-200 px-2 py-0.5 rounded text-sm border border-purple-400">
            {events.filter((e) => ['Heartbleed', 'Infiltration', 'Web Attack – Sql Injection', 'Web Attack – XSS', 'Web Attack – Brute Force'].includes(e.prediction)).length}
          </span>
        </div>
        <div className="p-3.5 cyber-glass rounded-xl border border-emerald-500/30 bg-emerald-950/20 shadow-lg flex items-center justify-between">
          <span className="text-emerald-400 font-semibold">BENIGN FLOWS:</span>
          <span className="font-bold text-emerald-400 text-sm">
            {events.filter((e) => !e.isAttack).length}
          </span>
        </div>
      </div>

      {/* Main Full-Featured Live Table */}
      <LiveThreatTable
        events={events}
        isPaused={isPaused}
        onTogglePause={togglePause}
        filterSeverity={filterSeverity}
        onFilterSeverityChange={setFilterSeverity}
        filterAttack={filterAttack}
        onFilterAttackChange={setFilterAttack}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSimulated={isDemoMode}
      />
    </div>
  );
};
