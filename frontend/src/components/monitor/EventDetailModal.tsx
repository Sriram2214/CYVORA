import React from 'react';
import { X, ShieldAlert, ArrowRight, Network } from 'lucide-react';
import { ThreatEvent } from '../../types/threat';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { getAttackInfo } from '../../data/attackClasses';
import { formatBytes, formatDuration, formatPercent } from '../../utils/formatters';

interface Props {
  event: ThreatEvent | null;
  onClose: () => void;
}

export const EventDetailModal: React.FC<Props> = ({ event, onClose }) => {
  if (!event) return null;

  const attackInfo = getAttackInfo(event.prediction);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-mono-code">{event.prediction}</h3>
                <Badge variant="severity" severity={event.severity}>
                  {event.severity}
                </Badge>
                {attackInfo.isRare && <Badge variant="rare">RARE ATTACK</Badge>}
              </div>
              <p className="text-xs text-slate-500 font-mono-code mt-0.5">Event ID: {event.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Flow Connection Visualizer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono-code text-xs">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 font-bold">
              <Network className="w-3.5 h-3.5 text-sky-600" />
              FLOW TELEMETRY ROUTE
            </div>
            <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="text-left">
                <div className="text-[10px] text-slate-500 font-semibold">SOURCE HOST</div>
                <div className="font-bold text-sky-700 text-sm mt-0.5">{event.sourceIp}</div>
              </div>

              <div className="flex flex-col items-center px-4">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 mb-1 font-bold">
                  {event.protocol} / Port {event.port}
                </span>
                <ArrowRight className="w-4 h-4 text-sky-600" />
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-500 font-semibold">DESTINATION TARGET</div>
                <div className="font-bold text-emerald-700 text-sm mt-0.5">{event.destinationIp}</div>
              </div>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-code text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">AI CONFIDENCE</span>
              <span className="text-base font-bold text-sky-700 mt-1 block">
                {formatPercent(event.confidence)}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">FLOW DURATION</span>
              <span className="text-base font-bold text-slate-800 mt-1 block">
                {formatDuration(event.flowDurationUs)}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">PACKET COUNT</span>
              <span className="text-base font-bold text-slate-800 mt-1 block">{event.packetCount} pkts</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">FLOW VOLUME</span>
              <span className="text-base font-bold text-slate-800 mt-1 block">
                {formatBytes(event.byteCount)}
              </span>
            </div>
          </div>

          {/* Threat Intelligence / MITRE Mapping */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono-code">
                THREAT INTELLIGENCE DOSSIER
              </span>
              <span className="text-[11px] font-mono-code text-purple-700 bg-purple-100 px-2 py-0.5 rounded border border-purple-200 font-bold">
                MITRE {attackInfo.mitreId}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{attackInfo.description}</p>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">MITRE ATT&CK Tactic:</span>
                <span className="font-semibold text-slate-800">{attackInfo.mitreTactic}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Attack Category:</span>
                <span className="font-semibold text-slate-800">{attackInfo.category}</span>
              </div>
            </div>

            {attackInfo.indicators && attackInfo.indicators.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] text-slate-500 block mb-1.5 font-semibold">Observed Heuristic Indicators:</span>
                <div className="flex flex-wrap gap-1.5">
                  {attackInfo.indicators.map((ind, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-sm"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-500 font-mono-code">
            Timestamp: <span className="text-slate-800 font-bold">{event.timestamp}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Inspector
          </Button>
        </div>
      </div>
    </div>
  );
};
