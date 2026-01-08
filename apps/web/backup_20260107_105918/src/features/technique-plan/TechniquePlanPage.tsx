/**
 * TechniquePlanPage
 *
 * Comprehensive technical training plan management
 * - Tasks: Specific technical work assignments
 * - Goals: Trackman/launch monitor metric targets
 * - Progress tracking
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Target, CheckCircle, Circle, TrendingUp, Plus, Edit2, Trash2, AlertCircle, Award, Trophy, Lock } from 'lucide-react';
import { StandardPageHeader } from '../../components/layout/StandardPageHeader';
import Button from '../../ui/primitives/Button';
import Card from '../../ui/primitives/Card';
import apiClient from '../../services/apiClient';

// ============================================================================
// TYPES
// ============================================================================

interface TechniqueTask {
  id: string;
  playerId: string;
  title: string;
  description: string;
  instructions?: string;
  videoUrl?: string;
  technicalArea: string;
  targetMetrics?: Record<string, number>;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
}

interface TechniqueGoal {
  id: string;
  playerId: string;
  title: string;
  metricType: string;
  baselineValue?: number;
  targetValue: number;
  currentValue?: number;
  progressPercent: number;
  status: 'active' | 'achieved' | 'paused';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TECHNICAL_AREAS: Record<string, string> = {
  swing: 'Sving',
  putting: 'Putting',
  chipping: 'Chipping',
  pitching: 'Pitching',
  bunker: 'Bunker',
  driver: 'Driver',
  irons: 'Jern',
  wedges: 'Wedges',
};

const METRIC_TYPES: Record<string, string> = {
  clubPath: 'Klubbane',
  attackAngle: 'Angrepsvink',
  swingDirection: 'Svingretning',
  faceToPath: 'Face to Path',
  dynamicLoft: 'Dynamisk Loft',
  clubSpeed: 'Klubbhastighet',
  ballSpeed: 'Ballhastighet',
  smashFactor: 'Smash Factor',
  launchAngle: 'Utskytningsvinkel',
  spinRate: 'Spinn',
};

// Mock technique-related badges
const TECHNIQUE_BADGES = [
  {
    id: '1',
    name: 'Klubbane-mester',
    description: 'Oppnå konsistent klubbane innenfor ±2°',
    icon: 'target',
    relatedMetric: 'clubPath',
    targetValue: 2,
    color: 'bg-gradient-to-br from-amber-400 to-orange-500',
    unlocked: false,
  },
  {
    id: '2',
    name: 'Attack Angle Pro',
    description: 'Oppnå optimal angrepsvink med driver (+3° til +5°)',
    icon: 'trophy',
    relatedMetric: 'attackAngle',
    targetValue: 4,
    color: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    unlocked: false,
  },
  {
    id: '3',
    name: 'Smash Factor Elite',
    description: 'Oppnå smash factor over 1.48 med driver',
    icon: 'award',
    relatedMetric: 'smashFactor',
    targetValue: 1.48,
    color: 'bg-gradient-to-br from-purple-400 to-pink-500',
    unlocked: true,
  },
  {
    id: '4',
    name: 'Face Control',
    description: 'Oppnå Face to Path innenfor ±1°',
    icon: 'target',
    relatedMetric: 'faceToPath',
    targetValue: 1,
    color: 'bg-gradient-to-br from-green-400 to-emerald-500',
    unlocked: false,
  },
  {
    id: '5',
    name: 'Hastighets-herre',
    description: 'Oppnå klubbhastighet over 110 mph',
    icon: 'trophy',
    relatedMetric: 'clubSpeed',
    targetValue: 110,
    color: 'bg-gradient-to-br from-red-400 to-rose-500',
    unlocked: false,
  },
  {
    id: '6',
    name: 'Konsistens-konge',
    description: 'Hold standardavvik under 5° på klubbhastighet over 20 slag',
    icon: 'award',
    relatedMetric: 'clubSpeed',
    targetValue: 5,
    color: 'bg-gradient-to-br from-cyan-400 to-teal-500',
    unlocked: false,
  },
];

const STATUS_CONFIG = {
  pending: {
    label: 'Ventende',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: Circle,
  },
  in_progress: {
    label: 'Pågår',
    color: 'text-tier-navy',
    bgColor: 'bg-tier-navy/15',
    icon: TrendingUp,
  },
  completed: {
    label: 'Fullført',
    color: 'text-tier-success',
    bgColor: 'bg-tier-success/15',
    icon: CheckCircle,
  },
  active: {
    label: 'Aktiv',
    color: 'text-tier-navy',
    bgColor: 'bg-tier-navy/15',
    icon: Target,
  },
  achieved: {
    label: 'Oppnådd',
    color: 'text-tier-success',
    bgColor: 'bg-tier-success/15',
    icon: CheckCircle,
  },
  paused: {
    label: 'Pausert',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: Circle,
  },
};

const PRIORITY_CONFIG = {
  low: { label: 'Lav', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  medium: { label: 'Middels', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  high: { label: 'Høy', color: 'text-tier-error', bgColor: 'bg-tier-error/15' },
};

// ============================================================================
// COMPONENTS
// ============================================================================

interface TaskCardProps {
  task: TechniqueTask;
  onUpdate: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate }) => {
  const statusConfig = STATUS_CONFIG[task.status];
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const StatusIcon = statusConfig.icon;

  const handleStatusChange = async (newStatus: string) => {
    try {
      await apiClient.patch(`/technique-plan/tasks/${task.id}`, { status: newStatus });
      onUpdate();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StatusIcon size={16} className={statusConfig.color} />
              <h3 className="text-base font-semibold text-tier-navy m-0">{task.title}</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityConfig.bgColor} ${priorityConfig.color}`}>
                {priorityConfig.label}
              </span>
              <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                {TECHNICAL_AREAS[task.technicalArea] || task.technicalArea}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-tier-text-secondary mb-3">{task.description}</p>

        {/* Instructions */}
        {task.instructions && (
          <div className="p-2 bg-tier-surface-base rounded mb-3">
            <p className="text-xs font-medium text-tier-navy mb-1">Instruksjoner:</p>
            <p className="text-xs text-tier-text-secondary m-0">{task.instructions}</p>
          </div>
        )}

        {/* Target Metrics */}
        {task.targetMetrics && Object.keys(task.targetMetrics).length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-tier-text-secondary mb-1">Målverdier:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(task.targetMetrics).map(([key, value]) => (
                <span key={key} className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded">
                  {METRIC_TYPES[key] || key}: {value}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <p className="text-xs text-tier-text-tertiary mb-3">
            Frist: {new Date(task.dueDate).toLocaleDateString('nb-NO')}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-tier-border-default">
          {task.status === 'pending' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange('in_progress')}
              className="flex-1"
            >
              Start oppgave
            </Button>
          )}
          {task.status === 'in_progress' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange('completed')}
              className="flex-1"
            >
              Fullfør oppgave
            </Button>
          )}
          {task.videoUrl && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open(task.videoUrl, '_blank')}
            >
              Se video
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

interface GoalCardProps {
  goal: TechniqueGoal;
  onUpdate: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdate }) => {
  const statusConfig = STATUS_CONFIG[goal.status];
  const StatusIcon = statusConfig.icon;

  const getProgressColor = (percent: number) => {
    if (percent >= 100) return 'bg-tier-success';
    if (percent >= 75) return 'bg-tier-navy';
    if (percent >= 50) return 'bg-amber-500';
    return 'bg-gray-400';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StatusIcon size={16} className={statusConfig.color} />
              <h3 className="text-base font-semibold text-tier-navy m-0">{goal.title}</h3>
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Metric Info */}
        <div className="mb-3 p-3 bg-tier-surface-base rounded">
          <p className="text-xs font-medium text-tier-text-secondary mb-2">
            {METRIC_TYPES[goal.metricType] || goal.metricType}
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {goal.baselineValue !== undefined && goal.baselineValue !== null && (
              <div>
                <p className="text-xs text-tier-text-tertiary m-0">Baseline</p>
                <p className="text-sm font-semibold text-tier-navy m-0">
                  {goal.baselineValue.toFixed(1)}
                </p>
              </div>
            )}
            {goal.currentValue !== undefined && goal.currentValue !== null && (
              <div>
                <p className="text-xs text-tier-text-tertiary m-0">Nåværende</p>
                <p className="text-sm font-semibold text-tier-navy m-0">
                  {goal.currentValue.toFixed(1)}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-tier-text-tertiary m-0">Mål</p>
              <p className="text-sm font-semibold text-tier-navy m-0">
                {goal.targetValue.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-tier-text-secondary">Fremgang</span>
            <span className="text-xs font-semibold text-tier-navy">{goal.progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getProgressColor(goal.progressPercent)}`}
              style={{ width: `${Math.min(goal.progressPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const TechniquePlanPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TechniqueTask[]>([]);
  const [goals, setGoals] = useState<TechniqueGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'goals' | 'badges'>('tasks');

  const loadData = async () => {
    try {
      setLoading(true);
      const playerId = user?.playerId || user?.id;

      const [tasksRes, goalsRes] = await Promise.all([
        apiClient.get(`/technique-plan/tasks?playerId=${playerId}`),
        apiClient.get(`/technique-plan/goals?playerId=${playerId}`),
      ]);

      setTasks(tasksRes.data.data.tasks || []);
      setGoals(goalsRes.data.data.goals || []);
    } catch (error) {
      console.error('Error loading technique plan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const activeGoals = goals.filter(g => g.status === 'active');
  const achievedGoals = goals.filter(g => g.status === 'achieved');

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <StandardPageHeader
        icon={Target}
        title="Teknikkplan"
        subtitle="Dine tekniske oppgaver og Trackman-baserte mål"
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus size={16} />}>
            Ny oppgave
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
            activeTab === 'tasks'
              ? 'bg-tier-navy text-white'
              : 'bg-tier-surface-base text-tier-navy hover:bg-tier-white'
          }`}
        >
          Oppgaver ({activeTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
            activeTab === 'goals'
              ? 'bg-tier-navy text-white'
              : 'bg-tier-surface-base text-tier-navy hover:bg-tier-white'
          }`}
        >
          Mål ({activeGoals.length})
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 rounded font-medium text-sm transition-colors flex items-center gap-2 ${
            activeTab === 'badges'
              ? 'bg-tier-navy text-white'
              : 'bg-tier-surface-base text-tier-navy hover:bg-tier-white'
          }`}
        >
          <Award size={16} />
          Merker ({TECHNIQUE_BADGES.filter(b => b.unlocked).length}/{TECHNIQUE_BADGES.length})
        </button>
      </div>

      {loading ? (
        <Card>
          <div className="p-12 text-center">
            <p className="text-tier-text-secondary">Laster...</p>
          </div>
        </Card>
      ) : (
        <>
          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              {/* Active Tasks */}
              {activeTasks.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-tier-navy mb-4">Aktive oppgaver</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTasks.map(task => (
                      <TaskCard key={task.id} task={task} onUpdate={loadData} />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-tier-navy mb-4">Fullførte oppgaver</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {completedTasks.map(task => (
                      <TaskCard key={task.id} task={task} onUpdate={loadData} />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {tasks.length === 0 && (
                <Card>
                  <div className="p-12 text-center">
                    <AlertCircle size={48} className="mx-auto text-tier-text-tertiary mb-4" />
                    <h3 className="text-lg font-semibold text-tier-navy mb-2">Ingen oppgaver ennå</h3>
                    <p className="text-sm text-tier-text-secondary mb-4">
                      Din trener vil opprette tekniske oppgaver for deg basert på dine treninger og Trackman-data.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-6">
              {/* Active Goals */}
              {activeGoals.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-tier-navy mb-4">Aktive mål</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeGoals.map(goal => (
                      <GoalCard key={goal.id} goal={goal} onUpdate={loadData} />
                    ))}
                  </div>
                </div>
              )}

              {/* Achieved Goals */}
              {achievedGoals.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-tier-navy mb-4">Oppnådde mål</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievedGoals.map(goal => (
                      <GoalCard key={goal.id} goal={goal} onUpdate={loadData} />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {goals.length === 0 && (
                <Card>
                  <div className="p-12 text-center">
                    <Target size={48} className="mx-auto text-tier-text-tertiary mb-4" />
                    <h3 className="text-lg font-semibold text-tier-navy mb-2">Ingen mål ennå</h3>
                    <p className="text-sm text-tier-text-secondary mb-4">
                      Din trener vil sette tekniske mål basert på Trackman-målinger og dine utviklingsområder.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Badges Tab */}
          {activeTab === 'badges' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-tier-navy to-tier-navy-dark text-white rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy size={32} />
                  <div>
                    <h2 className="text-2xl font-bold">Teknikk-merker</h2>
                    <p className="text-tier-navy-light mt-1">
                      Lås opp merker ved å nå tekniske milepæler
                    </p>
                  </div>
                </div>
              </div>

              {/* Unlocked Badges */}
              {TECHNIQUE_BADGES.filter(b => b.unlocked).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-tier-navy mb-4 flex items-center gap-2">
                    <CheckCircle className="text-tier-success" size={20} />
                    Opplåste merker
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TECHNIQUE_BADGES.filter(b => b.unlocked).map(badge => (
                      <Card key={badge.id}>
                        <div className={`${badge.color} p-6 rounded-t-lg text-white`}>
                          <div className="flex items-center justify-between mb-3">
                            {badge.icon === 'trophy' && <Trophy size={32} />}
                            {badge.icon === 'target' && <Target size={32} />}
                            {badge.icon === 'award' && <Award size={32} />}
                            <CheckCircle size={24} className="text-white" />
                          </div>
                          <h4 className="text-lg font-bold">{badge.name}</h4>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-tier-text-secondary">{badge.description}</p>
                          <div className="mt-3 text-xs text-tier-text-tertiary">
                            Relatert: {METRIC_TYPES[badge.relatedMetric]}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Locked Badges */}
              <div>
                <h3 className="text-lg font-semibold text-tier-navy mb-4 flex items-center gap-2">
                  <Lock className="text-gray-400" size={20} />
                  Låste merker
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TECHNIQUE_BADGES.filter(b => !b.unlocked).map(badge => (
                    <Card key={badge.id} className="opacity-75">
                      <div className="bg-gray-100 p-6 rounded-t-lg relative">
                        <div className="absolute top-4 right-4">
                          <Lock size={20} className="text-gray-400" />
                        </div>
                        <div className="flex items-center mb-3">
                          {badge.icon === 'trophy' && <Trophy size={32} className="text-gray-400" />}
                          {badge.icon === 'target' && <Target size={32} className="text-gray-400" />}
                          {badge.icon === 'award' && <Award size={32} className="text-gray-400" />}
                        </div>
                        <h4 className="text-lg font-bold text-gray-700">{badge.name}</h4>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-tier-text-secondary">{badge.description}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-tier-text-tertiary">
                            Relatert: {METRIC_TYPES[badge.relatedMetric]}
                          </span>
                          <span className="text-xs font-medium text-tier-navy">
                            Mål: {badge.targetValue}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Call to action */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="p-6 text-center">
                  <Award size={48} className="mx-auto text-tier-navy mb-3" />
                  <h3 className="text-lg font-semibold text-tier-navy mb-2">
                    Fortsett å trene for å låse opp flere merker!
                  </h3>
                  <p className="text-sm text-tier-text-secondary mb-4">
                    Jobb med dine tekniske mål og importer Trackman-data for å spore fremgangen din.
                  </p>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TechniquePlanPage;
