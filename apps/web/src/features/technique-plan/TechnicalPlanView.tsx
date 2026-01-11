/**
 * TIER Golf - Technical Plan (P-System)
 * Design System v3.0 - Premium Light
 *
 * P1.0 - P10.0 technical development areas with:
 * - Priority ordering (drag-and-drop)
 * - Repetitions tracking
 * - Drills assignment
 * - Responsible person assignment
 * - Status tracking (images, videos, data)
 * - TrackMan integration
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GripVertical,
  Plus,
  Trash2,
  Image,
  Video,
  BarChart3,
  Upload,
  ChevronDown,
  ChevronUp,
  User,
  Target,
  Activity,
  TrendingUp,
} from 'lucide-react';
import DrillSelector from './DrillSelector';
import ResponsiblePersonSelector from './ResponsiblePersonSelector';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Progress,
} from '../../components/shadcn';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import PageContainer from '../../ui/raw-blocks/PageContainer.raw';
import { SectionTitle, SubSectionTitle } from '../../components/typography/Headings';
import { useAuth } from '../../contexts/AuthContext';
import { techniquePlanAPI, TechniqueTask as ApiTechniqueTask } from '../../services/api';

// ============================================================================
// TYPES
// ============================================================================

interface TechnicalTask {
  id: string;
  pLevel: string; // P1.0 - P10.0
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  repetitions: number;
  priorityOrder: number;
  status: 'active' | 'completed' | 'paused';
  drills: Array<{
    id: string;
    exerciseId: string;
    exercise?: {
      id: string;
      name: string;
      description?: string;
      exerciseType?: string;
    };
  }>;
  responsible: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  progressImages: Array<{
    id: string;
    url: string;
    uploadedAt: string;
  }>;
  progressVideos: Array<{
    id: string;
    url: string;
    uploadedAt: string;
  }>;
}

interface TrackManData {
  id: string;
  taskId: string;
  date: string;
  attackAngle: number;
  lowPoint: number;
  swingDirection: number;
  swingPlane: number;
  clubPath: number;
  faceAngle: number;
  faceToPath: number;
  dynamicLoft: number;
  impactLocation: string;
  clubSpeed: number;
  ballSpeed: number;
  rawFileUrl?: string;
}

interface TrackManReference {
  parameter: string;
  targetValue: number;
  tolerance: number;
  currentValue?: number;
  deviation?: number;
}

// ============================================================================
// P-LEVEL DEFINITIONS
// ============================================================================

const P_LEVELS = [
  { id: 'P1.0', label: 'P1.0', description: 'Address position & posture' },
  { id: 'P2.0', label: 'P2.0', description: 'Takeaway' },
  { id: 'P3.0', label: 'P3.0', description: 'Mid-backswing' },
  { id: 'P4.0', label: 'P4.0', description: 'Top of backswing' },
  { id: 'P5.0', label: 'P5.0', description: 'Transition/early downswing' },
  { id: 'P6.0', label: 'P6.0', description: 'Mid-downswing' },
  { id: 'P7.0', label: 'P7.0', description: 'Impact' },
  { id: 'P8.0', label: 'P8.0', description: 'Early follow-through' },
  { id: 'P9.0', label: 'P9.0', description: 'Mid follow-through' },
  { id: 'P10.0', label: 'P10.0', description: 'Finish position' },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface TechnicalTaskCardProps {
  task: TechnicalTask;
  onUpdate: (taskId: string, updates: Partial<TechnicalTask>) => void;
  onDelete: (taskId: string) => void;
  onToggleExpand: (taskId: string) => void;
  onRefresh: () => void;
  isExpanded: boolean;
}

// Sortable wrapper for drag-and-drop
const SortableTaskCard: React.FC<TechnicalTaskCardProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TechnicalTaskCard {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
};

const TechnicalTaskCard: React.FC<TechnicalTaskCardProps & { dragHandleProps?: any }> = ({
  task,
  onUpdate,
  onDelete,
  onToggleExpand,
  onRefresh,
  isExpanded,
  dragHandleProps,
}) => {
  const pLevelInfo = P_LEVELS.find(p => p.id === task.pLevel);

  return (
    <div className="bg-tier-white border border-tier-border-default rounded-lg mb-3 hover:border-tier-navy/30 transition-colors">
      {/* Header - Always visible */}
      <div className="flex items-start gap-3 p-4">
        {/* Drag handle */}
        <div
          className="cursor-move text-tier-text-secondary hover:text-tier-navy mt-1"
          {...dragHandleProps}
        >
          <GripVertical size={20} />
        </div>

        {/* P-Level badge */}
        <div className="flex-shrink-0">
          <Badge className="bg-tier-navy text-white font-semibold text-sm px-3 py-1">
            {task.pLevel}
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <p className="text-sm text-tier-text-secondary mb-1">
                {pLevelInfo?.description}
              </p>
              <p className="text-base text-tier-navy font-medium">
                {task.description}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm text-tier-text-secondary">
                {task.repetitions} reps
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleExpand(task.id)}
                className="p-1 h-auto"
              >
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>
            </div>
          </div>

          {/* Media preview - Always visible */}
          <div className="flex items-center gap-2 mt-2">
            {task.imageUrl && (
              <div className="flex items-center gap-1 text-xs text-tier-text-secondary">
                <Image size={14} />
                <span>Bilde</span>
              </div>
            )}
            {task.videoUrl && (
              <div className="flex items-center gap-1 text-xs text-tier-text-secondary">
                <Video size={14} />
                <span>Video</span>
              </div>
            )}
            {task.drills.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-tier-text-secondary">
                <Activity size={14} />
                <span>{task.drills.length} drills</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="border-t border-tier-border-default p-4 space-y-4">
          {/* Description edit */}
          <div>
            <label className="block text-xs font-medium text-tier-text-secondary mb-2">
              Beskrivelse
            </label>
            <textarea
              value={task.description}
              onChange={(e) => onUpdate(task.id, { description: e.target.value })}
              className="w-full px-3 py-2 border border-tier-border-default rounded-lg text-sm resize-none"
              rows={3}
            />
          </div>

          {/* Repetitions */}
          <div>
            <label className="block text-xs font-medium text-tier-text-secondary mb-2">
              Antall repetisjoner
            </label>
            <input
              type="number"
              value={task.repetitions}
              onChange={(e) => onUpdate(task.id, { repetitions: parseInt(e.target.value) || 0 })}
              className="w-32 px-3 py-2 border border-tier-border-default rounded-lg text-sm"
              min="0"
            />
          </div>

          {/* Media uploads */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-tier-text-secondary mb-2">
                Bilde
              </label>
              <Button variant="outline" size="sm" className="w-full">
                <Upload size={16} className="mr-2" />
                Last opp bilde
              </Button>
              {task.imageUrl && (
                <div className="mt-2 relative">
                  <img src={task.imageUrl} alt="Task" className="w-full h-32 object-cover rounded" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-tier-text-secondary mb-2">
                Video
              </label>
              <Button variant="outline" size="sm" className="w-full">
                <Upload size={16} className="mr-2" />
                Last opp video
              </Button>
              {task.videoUrl && (
                <div className="mt-2 text-xs text-tier-text-secondary">
                  Video lastet opp
                </div>
              )}
            </div>
          </div>

          {/* Drills */}
          <div>
            <DrillSelector
              taskId={task.id}
              existingDrills={task.drills}
              onDrillAdded={onRefresh}
              onDrillRemoved={onRefresh}
            />
          </div>

          {/* Responsible persons */}
          <div>
            <ResponsiblePersonSelector
              taskId={task.id}
              existingResponsible={task.responsible}
              onPersonAdded={onRefresh}
              onPersonRemoved={onRefresh}
            />
          </div>

          {/* Delete button */}
          <div className="pt-2 border-t border-tier-border-default">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="text-tier-error border-tier-error hover:bg-tier-error hover:text-white"
            >
              <Trash2 size={16} className="mr-2" />
              Slett oppgave
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TechnicalPlanView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TechnicalTask[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'status' | 'trackman'>('tasks');

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch technical tasks from backend - reusable callback
  const fetchTasks = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use the player's ID (for players) or user's ID (for coaches viewing their own tasks)
      const playerId = user.playerId || user.id;

      const response = await techniquePlanAPI.getTasks({
        playerId,
        limit: 100
      });

      // Transform API response to component format
      const apiTasks = response.data.data || [];
      const transformedTasks: TechnicalTask[] = apiTasks.map((apiTask: ApiTechniqueTask) => ({
        id: apiTask.id,
        pLevel: apiTask.pLevel || 'P1.0',
        description: apiTask.description,
        imageUrl: apiTask.imageUrls && apiTask.imageUrls.length > 0 ? apiTask.imageUrls[0] : undefined,
        videoUrl: apiTask.videoUrl,
        repetitions: apiTask.repetitions || 0,
        priorityOrder: apiTask.priorityOrder || 0,
        status: apiTask.status as 'active' | 'completed' | 'paused' || 'active',
        drills: (apiTask.drills || []).map(drill => ({
          id: drill.id,
          exerciseId: drill.exerciseId,
          exercise: drill.exercise ? {
            id: drill.exercise.id,
            name: drill.exercise.name,
            exerciseType: drill.exercise.exerciseType,
          } : undefined,
        })),
        responsible: (apiTask.responsible || []).map(resp => ({
          id: resp.id,
          name: `${resp.user?.firstName || ''} ${resp.user?.lastName || ''}`.trim() || 'Unknown',
          role: resp.role || resp.user?.role || 'Coach',
        })),
        progressImages: (apiTask.imageUrls || []).map((url, index) => ({
          id: `img-${index}`,
          url,
          uploadedAt: apiTask.updatedAt,
        })),
        progressVideos: [],
      }));

      setTasks(transformedTasks);
    } catch (error) {
      console.error('Failed to fetch technical tasks:', error);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleUpdateTask = async (taskId: string, updates: Partial<TechnicalTask>) => {
    try {
      // Optimistic update
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      ));

      // Update in backend
      await techniquePlanAPI.updateTask(taskId, {
        description: updates.description,
        pLevel: updates.pLevel,
        repetitions: updates.repetitions,
        priorityOrder: updates.priorityOrder,
        status: updates.status as any,
        videoUrl: updates.videoUrl,
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      setError('Failed to update task');
      // Revert optimistic update on error - refetch tasks
      if (user?.id) {
        const playerId = user.playerId || user.id;
        const response = await techniquePlanAPI.getTasks({ playerId });
        const apiTasks = response.data.data || [];
        const transformedTasks: TechnicalTask[] = apiTasks.map((apiTask: ApiTechniqueTask) => ({
          id: apiTask.id,
          pLevel: apiTask.pLevel || 'P1.0',
          description: apiTask.description,
          imageUrl: apiTask.imageUrls && apiTask.imageUrls.length > 0 ? apiTask.imageUrls[0] : undefined,
          videoUrl: apiTask.videoUrl,
          repetitions: apiTask.repetitions || 0,
          priorityOrder: apiTask.priorityOrder || 0,
          status: apiTask.status as any || 'active',
          drills: (apiTask.drills || []).map(drill => ({
            id: drill.id,
            exerciseId: drill.exerciseId,
            exercise: drill.exercise ? {
              id: drill.exercise.id,
              name: drill.exercise.name,
                            exerciseType: drill.exercise.exerciseType,
            } : undefined,
          })),
          responsible: (apiTask.responsible || []).map(resp => ({
            id: resp.id,
            name: `${resp.user?.firstName || ''} ${resp.user?.lastName || ''}`.trim() || 'Unknown',
            role: resp.role || resp.user?.role || 'Coach',
          })),
          progressImages: (apiTask.imageUrls || []).map((url, index) => ({
            id: `img-${index}`,
            url,
            uploadedAt: apiTask.updatedAt,
          })),
          progressVideos: [],
        }));
        setTasks(transformedTasks);
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Er du sikker på at du vil slette denne oppgaven?')) {
      return;
    }

    try {
      // Optimistic update
      setTasks(tasks.filter(task => task.id !== taskId));

      // Delete from backend
      await techniquePlanAPI.deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
      setError('Failed to delete task');
      // Revert on error - refetch tasks
      if (user?.id) {
        const playerId = user.playerId || user.id;
        const response = await techniquePlanAPI.getTasks({ playerId });
        const apiTasks = response.data.data || [];
        const transformedTasks: TechnicalTask[] = apiTasks.map((apiTask: ApiTechniqueTask) => ({
          id: apiTask.id,
          pLevel: apiTask.pLevel || 'P1.0',
          description: apiTask.description,
          imageUrl: apiTask.imageUrls && apiTask.imageUrls.length > 0 ? apiTask.imageUrls[0] : undefined,
          videoUrl: apiTask.videoUrl,
          repetitions: apiTask.repetitions || 0,
          priorityOrder: apiTask.priorityOrder || 0,
          status: apiTask.status as any || 'active',
          drills: (apiTask.drills || []).map(drill => ({
            id: drill.id,
            exerciseId: drill.exerciseId,
            exercise: drill.exercise ? {
              id: drill.exercise.id,
              name: drill.exercise.name,
                            exerciseType: drill.exercise.exerciseType,
            } : undefined,
          })),
          responsible: (apiTask.responsible || []).map(resp => ({
            id: resp.id,
            name: `${resp.user?.firstName || ''} ${resp.user?.lastName || ''}`.trim() || 'Unknown',
            role: resp.role || resp.user?.role || 'Coach',
          })),
          progressImages: (apiTask.imageUrls || []).map((url, index) => ({
            id: `img-${index}`,
            url,
            uploadedAt: apiTask.updatedAt,
          })),
          progressVideos: [],
        }));
        setTasks(transformedTasks);
      }
    }
  };

  const handleToggleExpand = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex(task => task.id === active.id);
    const newIndex = tasks.findIndex(task => task.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistically update UI
    const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);

    // Update priority orders based on new positions
    const updatedTasks = reorderedTasks.map((task, index) => ({
      ...task,
      priorityOrder: index + 1,
    }));

    setTasks(updatedTasks);

    // Update backend for the moved task
    try {
      await techniquePlanAPI.updateTaskPriority(
        active.id as string,
        newIndex + 1
      );
    } catch (error) {
      console.error('Failed to update task priority:', error);
      // Revert on error by refetching
      fetchTasks();
    }
  };

  const handleAddTask = async () => {
    if (!user?.id) return;

    try {
      const playerId = user.playerId || user.id;

      const newTaskData = {
        playerId,
        title: 'Ny teknisk oppgave',
        description: 'Beskriv den tekniske oppgaven her',
        technicalArea: 'swing',
        pLevel: 'P1.0',
        repetitions: 0,
        priorityOrder: tasks.length + 1,
        priority: 'medium' as const,
      };

      const response = await techniquePlanAPI.createTask(newTaskData);
      const apiTask = response.data.data;

      const newTask: TechnicalTask = {
        id: apiTask.id,
        pLevel: apiTask.pLevel || 'P1.0',
        description: apiTask.description,
        imageUrl: apiTask.imageUrls && apiTask.imageUrls.length > 0 ? apiTask.imageUrls[0] : undefined,
        videoUrl: apiTask.videoUrl,
        repetitions: apiTask.repetitions || 0,
        priorityOrder: apiTask.priorityOrder || 0,
        status: apiTask.status as any || 'active',
        drills: [],
        responsible: [],
        progressImages: [],
        progressVideos: [],
      };

      setTasks([...tasks, newTask]);
      setExpandedTaskId(newTask.id);
    } catch (error) {
      console.error('Failed to create task:', error);
      setError('Failed to create task');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-tier-surface-base">
        <PageHeader title="Teknisk Plan" subtitle="P-System utviklingsområder" />
        <PageContainer paddingY="md" background="base">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tier-navy mx-auto mb-4" />
              <p className="text-tier-text-secondary">Laster teknisk plan...</p>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tier-surface-base">
      <PageHeader
        title="Teknisk Plan"
        subtitle="P1.0 - P10.0 utviklingsområder"
      />
      <PageContainer paddingY="md" background="base">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Tab navigation */}
          <div className="flex gap-2 border-b border-tier-border-default">
            {[
              { key: 'tasks', label: 'Utviklingsområder', icon: Target },
              { key: 'status', label: 'Status & Progresjon', icon: TrendingUp },
              { key: 'trackman', label: 'TrackMan Data', icon: BarChart3 },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-tier-navy text-tier-navy'
                      : 'border-transparent text-tier-text-secondary hover:text-tier-navy'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tasks tab */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <SectionTitle style={{ marginBottom: 0 }}>Utviklingsområder</SectionTitle>
                  <p className="text-sm text-tier-text-secondary mt-1">
                    P-nivåer i prioritert rekkefølge (dra for å endre prioritet)
                  </p>
                </div>
                <Button
                  onClick={handleAddTask}
                  className="bg-status-success hover:bg-status-success/90 text-white"
                >
                  <Plus size={18} className="mr-2" />
                  Ny oppgave
                </Button>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-tier-navy/10 flex items-center justify-center">
                        <Target className="w-5 h-5 text-tier-navy" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-tier-navy">{tasks.length}</p>
                        <p className="text-xs text-tier-text-secondary">Aktive områder</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-status-success/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-status-success" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-tier-navy">
                          {tasks.reduce((sum, t) => sum + t.drills.length, 0)}
                        </p>
                        <p className="text-xs text-tier-text-secondary">Drills totalt</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-tier-gold/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-tier-gold" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-tier-navy">
                          {tasks.reduce((sum, t) => sum + t.repetitions, 0)}
                        </p>
                        <p className="text-xs text-tier-text-secondary">Total reps</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tasks list */}
              <div>
                {tasks.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Target className="w-16 h-16 text-tier-text-tertiary mx-auto mb-4" />
                      <SubSectionTitle style={{ marginBottom: '0.5rem' }}>
                        Ingen oppgaver ennå
                      </SubSectionTitle>
                      <p className="text-sm text-tier-text-secondary mb-4">
                        Opprett din første tekniske oppgave ved å klikke på knappen over
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={tasks.map(t => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {tasks
                        .sort((a, b) => a.priorityOrder - b.priorityOrder)
                        .map(task => (
                          <SortableTaskCard
                            key={task.id}
                            task={task}
                            onUpdate={handleUpdateTask}
                            onDelete={handleDeleteTask}
                            onToggleExpand={handleToggleExpand}
                            onRefresh={fetchTasks}
                            isExpanded={expandedTaskId === task.id}
                          />
                        ))}
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          )}

          {/* Status tab */}
          {activeTab === 'status' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Status & Progresjon</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-tier-text-secondary mb-4">
                    Last opp bilder og videoer for å dokumentere din tekniske progresjon
                  </p>
                  {/* Placeholder for status tracking UI */}
                  <div className="text-center py-8">
                    <p className="text-tier-text-tertiary">Status tracking kommer snart</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TrackMan tab */}
          {activeTab === 'trackman' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>TrackMan Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <Upload size={18} className="mr-2" />
                      Importer TrackMan fil
                    </Button>
                    <p className="text-sm text-tier-text-secondary text-center">
                      Last opp TrackMan CSV/JSON fil for AI-analyse
                    </p>
                    {/* Placeholder for TrackMan data UI */}
                    <div className="text-center py-8">
                      <BarChart3 className="w-16 h-16 text-tier-text-tertiary mx-auto mb-4" />
                      <p className="text-tier-text-tertiary">TrackMan integrasjon kommer snart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
