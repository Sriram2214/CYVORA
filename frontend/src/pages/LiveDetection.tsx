import React from 'react';
import { Zap, RefreshCw } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono-code text-xs">
            <span className="p-1 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              LIVE SOC STREAM
            </span>
            <span className="text-slate-500 font-medium">/ Network Intrusion Inspection</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-mono-code">
            LIVE NETWORK THREAT MONITOR
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xl font-medium">
            Real-time inspection of incoming network flows, automated anomaly scoring, and instant threat triage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => addNewEvent()}
            icon={<Zap className="w-3.5 h-3.5 text-sky-600" />}
          >
            Inject Probe Flow
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={clearEvents}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Clear Stream Log
          </Button>
        </div>
      </div>

      {/* Mini live counter bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-code text-xs">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span className="text-slate-500 font-semibold">BUFFERED EVENTS:</span>
          <span className="font-bold text-slate-900 text-sm">{events.length}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span className="text-rose-700 font-semibold">ACTIVE THREATS:</span>
          <span className="font-bold text-rose-600 text-sm">
            {events.filter((e) => e.isAttack).length}
          </span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span className="text-purple-700 font-semibold">RARE ATTACKS:</span>
          <span className="font-bold text-purple-700 text-sm">
            {events.filter((e) => ['Heartbleed', 'Infiltration', 'Web Attack – Sql Injection', 'Web Attack – XSS', 'Web Attack – Brute Force'].includes(e.prediction)).length}
          </span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span className="text-emerald-700 font-semibold">BENIGN FLOWS:</span>
          <span className="font-bold text-emerald-700 text-sm">
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
