import React, { useState } from 'react';
import {
  Play,
  Pause,
  Search,
  Eye,
  Shield,
  ShieldAlert,
  Download,
} from 'lucide-react';
import { ThreatEvent } from '../../types/threat';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { EventDetailModal } from './EventDetailModal';
import { formatPercent } from '../../utils/formatters';
import { CYVORA_ATTACK_CLASSES } from '../../data/attackClasses';

interface Props {
  events: ThreatEvent[];
  isPaused: boolean;
  onTogglePause: () => void;
  filterSeverity: string;
  onFilterSeverityChange: (sev: string) => void;
  filterAttack: string;
  onFilterAttackChange: (atk: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isSimulated?: boolean;
}

export const LiveThreatTable: React.FC<Props> = ({
  events,
  isPaused,
  onTogglePause,
  filterSeverity,
  onFilterSeverityChange,
  filterAttack,
  onFilterAttackChange,
  searchQuery,
  onSearchChange,
  isSimulated = true,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<ThreatEvent | null>(null);

  const exportCsv = () => {
    if (!events.length) return;
    const headers = ['Time', 'Source IP', 'Destination IP', 'Port', 'Protocol', 'Prediction', 'Confidence', 'Severity', 'Status'];
    const rows = events.map((e) => [
      e.timestamp,
      e.sourceIp,
      e.destinationIp,
      e.port,
      e.protocol,
      e.prediction,
      e.confidence,
      e.severity,
      e.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cyvora_threat_events_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-4">
      {/* Control & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Stream Status / Live Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="relative flex h-2.5 w-2.5">
              {!isPaused && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isPaused ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              />
            </span>
            <span className="text-xs font-mono-code font-bold tracking-wider text-slate-800">
              {isPaused ? 'STREAM PAUSED' : 'LIVE TELEMETRY'}
            </span>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={onTogglePause}
            icon={isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          >
            {isPaused ? 'Resume Stream' : 'Pause Stream'}
          </Button>

          {isSimulated && (
            <Badge variant="simulated" className="hidden sm:inline-flex">
              Simulated SOC Feed
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search IP, Port, Attack..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 w-44 sm:w-56 font-mono-code shadow-sm"
            />
          </div>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) => onFilterSeverityChange(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-mono-code shadow-sm"
          >
            <option value="ALL">All Severities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          {/* Attack Type Filter */}
          <select
            value={filterAttack}
            onChange={(e) => onFilterAttackChange(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-mono-code max-w-[150px] truncate shadow-sm"
          >
            <option value="ALL">All Attack Classes</option>
            {CYVORA_ATTACK_CLASSES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <Button size="sm" variant="ghost" onClick={exportCsv} icon={<Download className="w-3.5 h-3.5" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Threat Event Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono-code text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 tracking-wider uppercase text-[11px] font-bold">
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Source IP</th>
                <th className="py-3.5 px-4">Destination IP</th>
                <th className="py-3.5 px-4">Port</th>
                <th className="py-3.5 px-4">Protocol</th>
                <th className="py-3.5 px-4">AI Prediction</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500">
                    No threat events matching filter criteria.
                  </td>
                </tr>
              ) : (
                events.map((event) => {
                  const isBenign = event.prediction.toUpperCase() === 'BENIGN';
                  return (
                    <tr
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors duration-150 group"
                    >
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{event.timestamp}</td>
                      <td className="py-3 px-4 text-sky-700 font-semibold whitespace-nowrap">{event.sourceIp}</td>
                      <td className="py-3 px-4 text-emerald-700 font-semibold whitespace-nowrap">{event.destinationIp}</td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{event.port}</td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px]">
                          {event.protocol}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-sans font-semibold text-slate-900">
                          {isBenign ? (
                            <Shield className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                          )}
                          <span>{event.prediction}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-900 whitespace-nowrap font-bold">
                        {formatPercent(event.confidence)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge variant="severity" severity={event.severity}>
                          {event.severity}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            event.status === 'BLOCKED'
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : event.status === 'ACTIVE'
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          title="Inspect Telemetry"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspector Modal */}
      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};
