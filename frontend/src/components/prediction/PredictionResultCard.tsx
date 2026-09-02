import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';
import { PredictionResult } from '../../types/api';
import { Badge } from '../common/Badge';
import { formatPercent } from '../../utils/formatters';
import { getAttackInfo } from '../../data/attackClasses';

interface Props {
  result: PredictionResult | null;
  isSimulated?: boolean;
}

export const PredictionResultCard: React.FC<Props> = ({ result, isSimulated = false }) => {
  if (!result) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-3d text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="p-4 rounded-2xl bg-sky-50 text-sky-600 mb-3 border border-sky-100 shadow-sm">
          <Cpu className="w-8 h-8" />
        </div>
        <h4 className="text-base font-bold text-slate-900">Inference Ready</h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1 font-medium">
          Choose a preset above or input flow values, then click <strong className="text-sky-700">PREDICT THREAT</strong>.
        </p>
      </div>
    );
  }

  const isAttack = result.is_attack;
  const attackInfo = getAttackInfo(result.prediction);

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-3d ${
        isAttack
          ? 'border-rose-200 bg-gradient-to-b from-rose-50/70 via-white to-white'
          : 'border-emerald-200 bg-gradient-to-b from-emerald-50/70 via-white to-white'
      }`}
    >
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white/80 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <span className="p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
            <Cpu className="w-3.5 h-3.5" />
          </span>
          <span>Threat Analysis Result</span>
        </div>

        <div className="flex items-center gap-2">
          {isSimulated && (
            <Badge variant="simulated" className="text-[10px]">
              Simulated
            </Badge>
          )}
          <span className="text-xs text-slate-600 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-semibold">
            {result.model_version || 'V4'} Engine
          </span>
        </div>
      </div>

      {/* Main Result Content */}
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          {/* Main Verdict */}
          <div className="flex items-center gap-4">
            <div
              className={`p-4 rounded-2xl border flex-shrink-0 shadow-sm ${
                isAttack
                  ? 'bg-rose-100 border-rose-200 text-rose-600 shadow-3d-rose'
                  : 'bg-emerald-100 border-emerald-200 text-emerald-600 shadow-3d-emerald'
              }`}
            >
              {isAttack ? <ShieldAlert className="w-9 h-9" /> : <ShieldCheck className="w-9 h-9" />}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Prediction
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {result.prediction}
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-medium max-w-sm leading-snug">
                {attackInfo.category} • MITRE {attackInfo.mitreId}
              </p>
            </div>
          </div>

          {/* Key Attribute Badges */}
          <div className="flex flex-wrap sm:flex-col items-end gap-2 text-xs font-semibold">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-slate-500">Status:</span>
              <span className={isAttack ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                {isAttack ? 'THREAT DETECTED' : 'SAFE / VERIFIED'}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-slate-500">Severity:</span>
              <Badge variant="severity" severity={result.severity}>
                {result.severity}
              </Badge>
            </div>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-600 uppercase tracking-wider">
              Confidence Score
            </span>
            <span className="text-base text-sky-700 font-extrabold">
              {formatPercent(result.confidence)}
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAttack
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-500'
              }`}
              style={{ width: `${(result.confidence || 0.99) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
