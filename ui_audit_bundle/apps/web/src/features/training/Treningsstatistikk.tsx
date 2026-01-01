// @ts-nocheck
import React, { useState } from 'react';
import {
  Clock, Target, Activity, Award, TrendingUp, TrendingDown,
  Flame, Calendar, ChevronRight, Star
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { FlameIcon, ClockIcon, ChartIcon, GolfTarget } from '../../components/icons';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ScrollArea,
  Separator,
} from '../../components/shadcn';
import { PlayerStatCard, SkillRadar, StreakBadge, CategoryProgressRing } from '../../components/shadcn/golf';
import { cn } from 'lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface Stats {
  totalSessions?: number;
  totalHours?: number;
  currentStreak?: number;
  completionRate?: number;
  weeklyGoal?: number;
  weeklyCompleted?: number;
  byCategory?: Record<string, { sessions: number; hours: number }>;
  hoursByDay?: Array<{ label: string; value: number; color?: string }>;
  areaDistribution?: Array<{ area: string; hours: number; percentage: number; color: string }>;
  lPhaseProgress?: Array<{ phase: string; label: string; completed: number; total: number; color: string }>;
  recentSessions?: Array<{ id: string; name: string; date: string; duration: number; type: string }>;
}

interface TimeRange {
  id: string;
  label: string;
}

interface LPhase {
  phase: string;
  label: string;
  completed: number;
  total: number;
  color: string;
}

interface Session {
  id: number | string;
  date: string;
  title: string;
  area: string;
  duration: number;
  exercises: number;
  lPhase: string;
  rating: number;
}

interface PersonalRecord {
  metric: string;
  value: string;
  date: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TIME_RANGES: TimeRange[] = [
  { id: 'week', label: 'Denne uken' },
  { id: 'month', label: 'Denne måneden' },
  { id: 'quarter', label: 'Siste 3 mnd' },
  { id: 'year', label: 'I år' },
];

const AREA_COLORS: Record<string, string> = {
  langspill: 'var(--ak-session-teknikk)',
  innspill: 'var(--ak-session-golfslag)',
  shortgame: 'var(--achievement)',
  putting: 'var(--achievement)',
  fysisk: 'var(--error)',
  mental: 'var(--text-muted)',
};

// ============================================================================
// CHART COMPONENTS
// ============================================================================

interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, height = 120 }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t transition-all duration-300 hover:opacity-80"
            style={{
              height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
              backgroundColor: item.color || 'var(--ak-primary)',
              minHeight: item.value > 0 ? 4 : 0,
            }}
          />
          <span className="text-[10px] text-text-secondary">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  height?: number;
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, height = 100, color = 'var(--ak-primary)' }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - minValue) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ height }} className="relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="var(--border-subtle)" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="var(--border-subtle)" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="var(--border-subtle)" strokeWidth="0.5" />

        {/* Gradient fill */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <polygon
          fill="url(#lineGradient)"
          points={`0,100 ${points} 100,100`}
        />

        {/* Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((d.value - minValue) / range) * 80 - 10;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2.5"
              fill="white"
              stroke={color}
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-text-secondary">
        {data.filter((_, i) => i % 2 === 0 || i === data.length - 1).map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
};

interface DonutChartProps {
  value: number;
  max: number;
  size?: number;
  color?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ value, max, size = 100, color = 'var(--ak-primary)' }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-text-primary">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  value: string | number;
  label: string;
  badge?: React.ReactNode;
  progress?: { value: number; max: number };
  trend?: { value: number; positive: boolean };
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconBg,
  value,
  label,
  badge,
  progress,
  trend
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconBg)}>
          {icon}
        </div>
        {badge}
        {trend && (
          <span className={cn(
            "flex items-center gap-1 text-xs",
            trend.positive ? "text-success" : "text-error"
          )}>
            {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-secondary">{label}</p>
      {progress && (
        <Progress
          value={(progress.value / progress.max) * 100}
          className="mt-2 h-1.5"
        />
      )}
    </CardContent>
  </Card>
);

// ============================================================================
// SESSION ROW COMPONENT
// ============================================================================

interface SessionRowProps {
  session: Session;
}

const SessionRow: React.FC<SessionRowProps> = ({ session }) => (
  <div className="px-4 py-3 hover:bg-background-elevated transition-colors cursor-pointer">
    <div className="flex items-center justify-between mb-1">
      <span className="text-sm font-medium text-text-primary">{session.title}</span>
      <span className="text-xs text-text-secondary">{session.date}</span>
    </div>
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="text-[10px]">{session.area}</Badge>
      <span className="text-[11px] text-text-secondary">{session.duration} min</span>
      {session.lPhase !== '-' && (
        <Badge variant="outline" className="text-[10px] border-ak-primary/30 text-ak-primary">
          {session.lPhase}
        </Badge>
      )}
      <div className="flex ml-auto">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={cn(
              "w-3 h-3",
              i <= session.rating ? "text-achievement fill-achievement" : "text-border-subtle"
            )}
          />
        ))}
      </div>
    </div>
  </div>
);

// ============================================================================
// L-PHASE PROGRESS ROW
// ============================================================================

interface LPhaseRowProps {
  phase: LPhase;
}

const LPhaseRow: React.FC<LPhaseRowProps> = ({ phase }) => (
  <div className="flex items-center gap-3">
    <div className="w-12 text-sm font-medium text-text-primary">{phase.phase}</div>
    <div className="flex-1 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">{phase.label}</span>
        <span className="text-xs font-medium text-text-primary">
          {phase.completed}/{phase.total}
        </span>
      </div>
      <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${phase.total > 0 ? (phase.completed / phase.total) * 100 : 0}%`,
            backgroundColor: phase.color
          }}
        />
      </div>
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface TreningsstatistikkProps {
  stats?: Stats | null;
  onRefresh?: () => void;
}

const Treningsstatistikk: React.FC<TreningsstatistikkProps> = ({
  stats: apiStats = null,
  onRefresh
}) => {
  const [timeRange, setTimeRange] = useState('week');

  // Weekly stats with fallbacks
  const weeklyStats = {
    totalHours: apiStats?.totalHours || 18.5,
    targetHours: apiStats?.weeklyGoal || 25,
    sessionsCompleted: apiStats?.weeklyCompleted || 12,
    targetSessions: 15,
    exercisesCompleted: 87,
    streak: apiStats?.currentStreak || 14,
  };

  // Demo data for charts
  const hoursByDay = apiStats?.hoursByDay || [
    { label: 'Ma', value: 3.5, color: 'var(--ak-primary)' },
    { label: 'Ti', value: 2.0, color: 'var(--ak-primary)' },
    { label: 'On', value: 4.0, color: 'var(--ak-primary)' },
    { label: 'To', value: 2.5, color: 'var(--ak-primary)' },
    { label: 'Fr', value: 3.0, color: 'var(--ak-primary)' },
    { label: 'Lø', value: 3.5, color: 'var(--ak-primary)' },
    { label: 'Sø', value: 0, color: 'var(--border-subtle)' },
  ];

  const hoursTrend = [
    { label: 'U43', value: 15 },
    { label: 'U44', value: 18 },
    { label: 'U45', value: 22 },
    { label: 'U46', value: 20 },
    { label: 'U47', value: 24 },
    { label: 'U48', value: 19 },
    { label: 'U49', value: 23 },
    { label: 'U50', value: 18.5 },
  ];

  const areaDistribution = apiStats?.areaDistribution || [
    { area: 'Langspill', hours: 5.5, percentage: 30, color: AREA_COLORS.langspill },
    { area: 'Innspill', hours: 4.0, percentage: 22, color: AREA_COLORS.innspill },
    { area: 'Shortgame', hours: 3.5, percentage: 19, color: AREA_COLORS.shortgame },
    { area: 'Putting', hours: 3.0, percentage: 16, color: AREA_COLORS.putting },
    { area: 'Fysisk', hours: 2.0, percentage: 11, color: AREA_COLORS.fysisk },
    { area: 'Mental', hours: 0.5, percentage: 3, color: AREA_COLORS.mental },
  ];

  const lPhaseProgress: LPhase[] = apiStats?.lPhaseProgress || [
    { phase: 'L1', label: 'Eksponering', completed: 45, total: 45, color: 'var(--text-secondary)' },
    { phase: 'L2', label: 'Kropp+Armer', completed: 38, total: 40, color: 'var(--border-default)' },
    { phase: 'L3', label: 'Kølle', completed: 28, total: 35, color: 'var(--success)' },
    { phase: 'L4', label: 'Kontrollert', completed: 15, total: 30, color: 'var(--ak-primary)' },
    { phase: 'L5', label: 'Automatikk', completed: 5, total: 25, color: 'var(--achievement)' },
  ];

  const recentSessions: Session[] = [
    { id: 1, date: '14. des', title: 'Driving Range', area: 'Langspill', duration: 90, exercises: 8, lPhase: 'L4', rating: 4 },
    { id: 2, date: '13. des', title: 'Shortgame Practice', area: 'Shortgame', duration: 60, exercises: 6, lPhase: 'L3', rating: 5 },
    { id: 3, date: '12. des', title: 'Putting Drills', area: 'Putting', duration: 45, exercises: 5, lPhase: 'L5', rating: 4 },
    { id: 4, date: '11. des', title: 'Styrketrening', area: 'Fysisk', duration: 75, exercises: 12, lPhase: '-', rating: 4 },
  ];

  const personalRecords: PersonalRecord[] = [
    { metric: 'Lengste streak', value: '21 dager', date: 'Nov 2025', Icon: FlameIcon },
    { metric: 'Flest timer/uke', value: '28.5 timer', date: 'Okt 2025', Icon: ClockIcon },
    { metric: 'Flest økter/uke', value: '18 økter', date: 'Sep 2025', Icon: ChartIcon },
    { metric: 'Beste L5-progresjon', value: '+12 øvelser', date: 'Nov 2025', Icon: GolfTarget },
  ];

  // Data for SkillRadar (if available)
  const skillData = [
    { name: 'Langspill', value: 75, max: 100 },
    { name: 'Innspill', value: 65, max: 100 },
    { name: 'Shortgame', value: 80, max: 100 },
    { name: 'Putting', value: 70, max: 100 },
    { name: 'Fysisk', value: 55, max: 100 },
    { name: 'Mental', value: 60, max: 100 },
  ];

  return (
    <div className="min-h-screen bg-background-default">
      {/* Header */}
      <PageHeader
        title="Treningsstatistikk"
        subtitle="Oversikt over treningsaktivitet"
        actions={
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map(range => (
                <SelectItem key={range.id} value={range.id}>{range.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Clock className="w-5 h-5 text-ak-primary" />}
            iconBg="bg-ak-primary/10"
            value={`${weeklyStats.totalHours}t`}
            label={`av ${weeklyStats.targetHours}t mål`}
            badge={<Badge className="bg-success/15 text-success border-0">+15%</Badge>}
            progress={{ value: weeklyStats.totalHours, max: weeklyStats.targetHours }}
          />
          <StatCard
            icon={<Target className="w-5 h-5 text-success" />}
            iconBg="bg-success/10"
            value={weeklyStats.sessionsCompleted}
            label="økter fullført"
            badge={<Badge variant="outline">{weeklyStats.sessionsCompleted}/{weeklyStats.targetSessions}</Badge>}
            progress={{ value: weeklyStats.sessionsCompleted, max: weeklyStats.targetSessions }}
          />
          <StatCard
            icon={<Activity className="w-5 h-5 text-achievement" />}
            iconBg="bg-achievement/10"
            value={weeklyStats.exercisesCompleted}
            label="øvelser gjennomført"
            trend={{ value: 8, positive: true }}
          />
          <StatCard
            icon={<Award className="w-5 h-5 text-error" />}
            iconBg="bg-error/10"
            value={weeklyStats.streak}
            label="dager på rad"
            badge={
              <StreakBadge streak={weeklyStats.streak} size="sm" />
            }
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hours by Day */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Timer denne uken</CardTitle>
                  <span className="text-xs text-text-secondary">Totalt: {weeklyStats.totalHours}t</span>
                </div>
              </CardHeader>
              <CardContent>
                <BarChart data={hoursByDay} height={140} />
              </CardContent>
            </Card>

            {/* Hours Trend */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Timetrend (8 uker)</CardTitle>
                  <span className="flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="w-3 h-3" /> +23% snitt
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <LineChart data={hoursTrend} height={120} color="var(--ak-primary)" />
              </CardContent>
            </Card>

            {/* L-Phase Progression */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">L-fase progresjon</CardTitle>
                  <Badge variant="outline">Totalt: 131 øvelser</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {lPhaseProgress.map((phase) => (
                  <LPhaseRow key={phase.phase} phase={phase} />
                ))}
              </CardContent>
            </Card>

            {/* Skill Radar (Golf component) */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Treningsfordeling</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-4">
                <SkillRadar data={skillData} size={280} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Area Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Fordeling per område</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <DonutChart
                    value={weeklyStats.totalHours}
                    max={weeklyStats.targetHours}
                    size={100}
                    color="var(--ak-primary)"
                  />
                </div>
                <div className="space-y-2">
                  {areaDistribution.map((area) => (
                    <div key={area.area} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: area.color }}
                      />
                      <span className="flex-1 text-xs text-text-primary">{area.area}</span>
                      <span className="text-xs text-text-secondary">{area.hours}t</span>
                      <span className="text-xs font-medium text-text-primary w-8 text-right">
                        {area.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Siste økter</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border-subtle">
                  {recentSessions.map((session) => (
                    <SessionRow key={session.id} session={session} />
                  ))}
                </div>
                <Separator />
                <div className="p-3">
                  <Button variant="ghost" className="w-full justify-center">
                    Se alle økter
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Personal Records */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Personlige rekorder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {personalRecords.map((record, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-background-elevated rounded-lg">
                    <record.Icon size={20} className="text-ak-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-text-secondary">{record.metric}</p>
                      <p className="text-sm font-semibold text-text-primary">{record.value}</p>
                    </div>
                    <span className="text-[10px] text-text-secondary">{record.date}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Treningsstatistikk;
