import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  Percent,
  Cpu,
  ArrowRight,
  Radio,
  Zap,
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LiveThreatTable } from '../components/monitor/LiveThreatTable';
import { AttackDistributionChart } from '../components/charts/AttackDistributionChart';
import { ThreatSeverityDonut } from '../components/charts/ThreatSeverityDonut';
import { ThreatTimelineChart } from '../components/charts/ThreatTimelineChart';
import { useThreatStream } from '../hooks/useThreatStream';
import { useDemoMode } from '../hooks/useDemoMode';
import { RARE_ATTACK_CLASSES } from '../data/attackClasses';

export const Dashboard: React.FC = () => {
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
    stats,
  } = useThreatStream(10, 2200);

  return (
    <div className="space-y-6">
      {/* 1. Hero 3D Card Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-white via-sky-50/40 to-white rounded-2xl border border-sky-100 shadow-3d flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider">
              CYVORA SOC COMMAND
            </span>
            <span className="text-slate-400 text-xs font-medium">• Live Threat Detection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            AI-Powered Network Threat Detection
          </h1>
          <p className="text-sm text-slate-600 font-medium max-w-2xl">
            Real-time packet flow inspection and automated rare attack optimization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <NavLink to="/ai-prediction">
            <Button variant="primary" size="md" icon={<Cpu className="w-4 h-4" />}>
              Test AI Prediction
            </Button>
          </NavLink>
          <NavLink to="/live-detection">
            <Button variant="secondary" size="md" icon={<Radio className="w-4 h-4 text-sky-600" />}>
              Live Monitor
            </Button>
          </NavLink>
        </div>
      </div>

      {/* 2. Five Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="TOTAL FLOWS"
          value={stats.totalFlows.toLocaleString()}
          description="Network flow telemetry"
          trend="+12.4%"
          trendPositive={true}
          icon={Activity}
          color="cyan"
          isSimulated={isDemoMode}
        />
        <StatCard
          title="THREATS DETECTED"
          value={stats.threatsDetected.toLocaleString()}
          description="Confirmed intrusion events"
          trend="4.8% rate"
          trendPositive={false}
          icon={ShieldAlert}
          color="rose"
          isSimulated={isDemoMode}
        />
        <StatCard
          title="BENIGN TRAFFIC"
          value={stats.benignTraffic.toLocaleString()}
          description="Verified safe network operations"
          trend="95.2% safe"
          trendPositive={true}
          icon={ShieldCheck}
          color="emerald"
          isSimulated={isDemoMode}
        />
        <StatCard
          title="DETECTION RATE"
          value="99.86%"
          description="Model test accuracy"
          trend="Verified"
          trendPositive={true}
          icon={Percent}
          color="purple"
          isSimulated={false}
        />
        <StatCard
          title="MODEL CONFIDENCE"
          value={`${stats.avgConfidence.toFixed(1)}%`}
          description="Average inference score"
          trend="Optimal"
          trendPositive={true}
          icon={Cpu}
          color="amber"
          isSimulated={isDemoMode}
        />
      </div>

      {/* 3. Threat Timeline Activity & Severity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Timeline Activity */}
        <div className="lg:col-span-2">
          <Card
            title="Threat Activity Timeline (24 Hours)"
            subtitle="Traffic trends & anomaly volume over time"
            action={
              <NavLink to="/threat-analytics" className="text-xs text-sky-600 hover:text-sky-800 font-bold flex items-center gap-1">
                View Analytics <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            }
          >
            <ThreatTimelineChart height={250} />
          </Card>
        </div>

        {/* Threat Severity Breakdown */}
        <div>
          <Card
            title="Threat Severity Breakdown"
            subtitle="Risk levels across evaluated flows"
          >
            <ThreatSeverityDonut />
          </Card>
        </div>
      </div>

      {/* 4. Live Network Threat Monitor */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              LIVE NETWORK THREAT MONITOR
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Click any row in the table to inspect full packet telemetry.
            </p>
          </div>
          <NavLink to="/live-detection">
            <Button size="sm" variant="secondary" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              Fullscreen View
            </Button>
          </NavLink>
        </div>

        <LiveThreatTable
          events={events.slice(0, 8)}
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

      {/* 5. 15-Class Attack Distribution & Rare Attack Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="CYVORA Attack Class Distribution"
            subtitle="Multi-class frequency across 15 evaluated attack categories"
            action={
              <NavLink to="/attack-intelligence" className="text-xs text-sky-600 hover:text-sky-800 font-bold flex items-center gap-1">
                Attack Matrix <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            }
          >
            <AttackDistributionChart />
          </Card>
        </div>

        {/* Rare Attack Optimization Spotlight */}
        <div>
          <Card
            title="Rare Attack Focus"
            subtitle="Optimized detection for high-risk minority attacks"
            action={
              <NavLink to="/rare-attacks" className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1">
                Details <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            }
          >
            <div className="space-y-3">
              {RARE_ATTACK_CLASSES.map((atk) => (
                <div
                  key={atk.name}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all hover:bg-purple-50/30"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-xs text-slate-900">{atk.name}</div>
                    <Badge variant="rare">RARE</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
                    <span>MITRE: {atk.mitreId}</span>
                    <span className="text-purple-700 font-semibold">Port {atk.typicalPorts.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
