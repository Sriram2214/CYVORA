import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  trend?: string;
  trendPositive?: boolean;
  icon: LucideIcon;
  color?: 'cyan' | 'rose' | 'emerald' | 'amber' | 'purple';
  isSimulated?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  trend,
  trendPositive = true,
  icon: Icon,
  color = 'cyan',
  isSimulated = false,
}) => {
  const colorMap = {
    cyan: {
      border: 'hover:border-sky-300',
      iconBg: 'bg-sky-50 text-sky-600 border border-sky-200 shadow-sm',
      valColor: 'text-slate-900',
    },
    rose: {
      border: 'hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm',
      valColor: 'text-rose-600',
    },
    emerald: {
      border: 'hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm',
      valColor: 'text-emerald-700',
    },
    amber: {
      border: 'hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-200 shadow-sm',
      valColor: 'text-amber-700',
    },
    purple: {
      border: 'hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-200 shadow-sm',
      valColor: 'text-purple-700',
    },
  };

  const scheme = colorMap[color];

  return (
    <div
      className={`stat-3d p-5 flex flex-col justify-between group ${scheme.border}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-bold tracking-wide text-slate-500 uppercase flex items-center gap-1.5">
            {title}
            {isSimulated && (
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 border border-amber-200 rounded font-medium lowercase">
                sim
              </span>
            )}
          </div>
          <div className={`mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight ${scheme.valColor}`}>
            {value}
          </div>
        </div>

        <div className={`p-3 rounded-2xl ${scheme.iconBg} transition-transform group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
        <span className="text-slate-500 truncate max-w-[170px]" title={description}>
          {description}
        </span>
        {trend && (
          <span
            className={`font-semibold px-2 py-0.5 rounded-full text-[11px] shadow-sm ${
              trendPositive
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                : 'text-rose-700 bg-rose-50 border border-rose-200'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
