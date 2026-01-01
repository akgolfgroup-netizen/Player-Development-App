// @ts-nocheck
/**
 * Maalsetninger - Goals management with shadcn/ui components
 */
import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SectionTitle, SubSectionTitle, CardTitle as TypographyCardTitle } from '../../components/typography';
import {
  Target, Trophy, Dumbbell, Brain, TrendingUp,
  Plus, Pencil, Trash2, Check, Users, X, Lightbulb, Calendar
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Progress,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Textarea,
  Label,
  Switch,
  ScrollArea,
  Checkbox,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/shadcn';
import { GoalProgress, PlayerStatCard } from '../../components/shadcn/golf';
import { cn } from 'lib/utils';

// Types
interface Milestone {
  title: string;
  target: number;
  completed: boolean;
}

interface CoachComment {
  id: number;
  author: string;
  date: string;
  comment: string;
}

interface Goal {
  id: number;
  title: string;
  description?: string;
  category: string;
  timeframe: 'short' | 'medium' | 'long';
  measurable: boolean;
  current: number;
  target: number;
  unit: string;
  deadline?: string;
  status: 'active' | 'completed';
  sharedWithCoach: boolean;
  coachComments: CoachComment[];
  milestones: Milestone[];
}

// Category configuration
const CATEGORIES = [
  { id: 'score', label: 'Score', icon: Target },
  { id: 'teknikk', label: 'Teknikk', icon: Target },
  { id: 'fysisk', label: 'Fysisk', icon: Dumbbell },
  { id: 'mental', label: 'Mental', icon: Brain },
  { id: 'turnering', label: 'Turnering', icon: Trophy },
  { id: 'prosess', label: 'Prosess', icon: TrendingUp },
];

const TIMEFRAMES = [
  { id: 'short', label: 'Kortsiktig (1-3 mnd)' },
  { id: 'medium', label: 'Mellomlang (3-12 mnd)' },
  { id: 'long', label: 'Langsiktig (1-3 år)' },
];

// Default goals
const DEFAULT_GOALS: Goal[] = [
  {
    id: 1,
    title: 'Nå handicap 5.0',
    description: 'Redusere handicap fra 8.2 til 5.0 innen neste sesong',
    category: 'score',
    timeframe: 'long',
    measurable: true,
    current: 8.2,
    target: 5.0,
    unit: 'HCP',
    deadline: '2025-09-01',
    status: 'active',
    sharedWithCoach: true,
    coachComments: [
      { id: 1, author: 'Trener Anders', date: '2025-12-10', comment: 'Flott fremgang! Du ligger godt an.' },
    ],
    milestones: [
      { title: 'Nå 7.0 HCP', target: 7.0, completed: true },
      { title: 'Nå 6.0 HCP', target: 6.0, completed: false },
    ],
  },
  {
    id: 2,
    title: 'Øke clubspeed til 105 mph',
    category: 'fysisk',
    timeframe: 'medium',
    measurable: true,
    current: 98,
    target: 105,
    unit: 'mph',
    deadline: '2025-06-01',
    status: 'active',
    sharedWithCoach: false,
    coachComments: [],
    milestones: [],
  },
  {
    id: 3,
    title: 'Mestre draw-slag',
    category: 'teknikk',
    timeframe: 'medium',
    measurable: true,
    current: 80,
    target: 80,
    unit: '% konsistens',
    status: 'completed',
    sharedWithCoach: false,
    coachComments: [],
    milestones: [],
  },
];

// Goal Card Component
interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onToggleComplete: (id: number) => void;
  onUpdateProgress: (goal: Goal) => void;
  onShareWithCoach: (id: number) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onToggleComplete,
  onUpdateProgress,
  onShareWithCoach,
}) => {
  const category = CATEGORIES.find(c => c.id === goal.category);
  const CategoryIcon = category?.icon || Target;
  const progressPercentage = (goal.current / goal.target) * 100;
  const isCompleted = goal.status === 'completed';

  const getStatus = (): 'on_track' | 'behind' | 'at_risk' => {
    if (progressPercentage >= 75) return 'on_track';
    if (progressPercentage >= 50) return 'behind';
    return 'at_risk';
  };

  return (
    <Card className={cn("transition-all", isCompleted && "opacity-75")}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ak-primary/10 flex items-center justify-center">
              <CategoryIcon className="w-5 h-5 text-ak-primary" />
            </div>
            <div>
              <SubSectionTitle className={cn(
                "font-semibold text-text-primary",
                isCompleted && "line-through"
              )}>
                {goal.title}
              </SubSectionTitle>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant={
                  goal.timeframe === 'short' ? 'secondary' :
                  goal.timeframe === 'long' ? 'default' : 'outline'
                }>
                  {TIMEFRAMES.find(t => t.id === goal.timeframe)?.label.split(' ')[0]}
                </Badge>
                {goal.sharedWithCoach && (
                  <Badge variant="outline" className="gap-1">
                    <Users className="h-3 w-3" />
                    Delt
                  </Badge>
                )}
                {goal.deadline && (
                  <span className="text-xs text-text-secondary flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(goal.deadline).toLocaleDateString('nb-NO')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onShareWithCoach(goal.id)}
              className={cn(goal.sharedWithCoach && "text-ak-primary")}
            >
              <Users className="h-4 w-4" />
            </Button>
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() => onToggleComplete(goal.id)}
              className="h-5 w-5"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(goal)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Description */}
        {goal.description && (
          <p className="text-sm text-text-secondary mb-3">{goal.description}</p>
        )}

        {/* Progress */}
        {goal.measurable && (
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-text-primary">
                {goal.current} / {goal.target} {goal.unit}
              </span>
              <span className={cn(
                "font-medium",
                progressPercentage >= 100 ? "text-ak-success" : "text-ak-primary"
              )}>
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
            {!isCompleted && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateProgress(goal)}
                className="mt-2"
              >
                Oppdater progresjon
              </Button>
            )}
          </div>
        )}

        {/* Milestones */}
        {goal.milestones && goal.milestones.length > 0 && (
          <div className="pt-3 border-t border-border-subtle">
            <p className="text-xs font-medium text-text-secondary mb-2">Milepæler</p>
            <div className="space-y-1.5">
              {goal.milestones.map((milestone, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Checkbox checked={milestone.completed} disabled className="h-4 w-4" />
                  <span className={cn(
                    "text-xs flex-1",
                    milestone.completed && "line-through text-text-secondary"
                  )}>
                    {milestone.title}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {milestone.target} {goal.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coach Comments */}
        {goal.coachComments && goal.coachComments.length > 0 && (
          <div className="pt-3 mt-3 border-t border-border-subtle">
            <p className="text-xs font-medium text-text-secondary mb-2 flex items-center gap-1">
              💬 Tilbakemelding fra trener
            </p>
            <div className="space-y-2">
              {goal.coachComments.map(comment => (
                <div
                  key={comment.id}
                  className="p-2 rounded-lg bg-ak-primary/5 border-l-2 border-ak-primary"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{comment.author}</span>
                    <span className="text-[10px] text-text-secondary">
                      {new Date(comment.date).toLocaleDateString('nb-NO')}
                    </span>
                  </div>
                  <p className="text-xs text-text-primary">{comment.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Goal Modal Component
interface GoalModalProps {
  goal?: Goal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (goal: Goal) => void;
  onDelete?: (id: number) => void;
}

const GoalModal: React.FC<GoalModalProps> = ({
  goal,
  open,
  onOpenChange,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Partial<Goal>>(goal || {
    title: '',
    description: '',
    category: 'score',
    timeframe: 'medium',
    measurable: true,
    current: 0,
    target: 100,
    unit: '',
    deadline: '',
  });

  React.useEffect(() => {
    if (goal) {
      setFormData(goal);
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'score',
        timeframe: 'medium',
        measurable: true,
        current: 0,
        target: 100,
        unit: '',
        deadline: '',
      });
    }
  }, [goal, open]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      id: goal?.id || Date.now(),
      status: goal?.status || 'active',
      sharedWithCoach: goal?.sharedWithCoach || false,
      coachComments: goal?.coachComments || [],
      milestones: goal?.milestones || [],
    } as Goal);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{goal ? 'Rediger mål' : 'Nytt mål'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Måltittel *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="F.eks. Nå handicap 5"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Beskrivelse</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Beskriv målet mer detaljert..."
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Kategori</Label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                  <Button
                    key={cat.id}
                    variant={formData.category === cat.id ? 'default' : 'outline'}
                    className="flex-col h-auto py-3"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-xs">{cat.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Timeframe */}
          <div className="space-y-2">
            <Label>Tidsramme</Label>
            <div className="space-y-2">
              {TIMEFRAMES.map(tf => (
                <Button
                  key={tf.id}
                  variant={formData.timeframe === tf.id ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setFormData({ ...formData, timeframe: tf.id as Goal['timeframe'] })}
                >
                  {tf.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Measurable toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-background-default">
            <Label htmlFor="measurable" className="cursor-pointer">
              Målbart mål (med tall)
            </Label>
            <Switch
              id="measurable"
              checked={formData.measurable}
              onCheckedChange={(checked) => setFormData({ ...formData, measurable: checked })}
            />
          </div>

          {/* Measurable values */}
          {formData.measurable && (
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Nåværende</Label>
                <Input
                  type="number"
                  value={formData.current}
                  onChange={e => setFormData({ ...formData, current: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Mål</Label>
                <Input
                  type="number"
                  value={formData.target}
                  onChange={e => setFormData({ ...formData, target: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Enhet</Label>
                <Input
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="HCP"
                />
              </div>
            </div>
          )}

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline">Frist (valgfritt)</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          {goal && onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="mr-auto">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Slett
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Dette vil permanent slette målet. Denne handlingen kan ikke angres.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Avbryt</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(goal.id)}>
                    Slett
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.title}>
            {goal ? 'Lagre' : 'Opprett'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Update Progress Dialog
interface UpdateProgressDialogProps {
  goal: Goal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: number, value: number) => void;
}

const UpdateProgressDialog: React.FC<UpdateProgressDialogProps> = ({
  goal,
  open,
  onOpenChange,
  onSave,
}) => {
  const [value, setValue] = useState('');

  React.useEffect(() => {
    if (goal) {
      setValue(goal.current.toString());
    }
  }, [goal]);

  const handleSave = () => {
    if (goal && !isNaN(parseFloat(value))) {
      onSave(goal.id, parseFloat(value));
      onOpenChange(false);
    }
  };

  if (!goal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Oppdater progresjon</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <p className="font-medium text-text-primary">{goal.title}</p>
            <p className="text-sm text-text-secondary">
              Mål: {goal.target} {goal.unit}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Ny verdi ({goal.unit})</Label>
            <Input
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={`0 - ${goal.target}`}
              step="0.1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button onClick={handleSave}>Lagre</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
interface MaalsetningerProps {
  goals?: Goal[] | null;
}

const Maalsetninger: React.FC<MaalsetningerProps> = ({ goals: apiGoals }) => {
  const [goals, setGoals] = useState<Goal[]>(apiGoals || DEFAULT_GOALS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'active' | 'completed' | 'all'>('active');
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [updatingGoal, setUpdatingGoal] = useState<Goal | null>(null);

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  const filteredGoals = goals.filter(goal => {
    const categoryMatch = selectedCategory === null || goal.category === selectedCategory;
    const statusMatch = viewMode === 'all' ||
      (viewMode === 'active' && goal.status === 'active') ||
      (viewMode === 'completed' && goal.status === 'completed');
    return categoryMatch && statusMatch;
  });

  const totalProgress = activeGoals.length > 0
    ? activeGoals
        .filter(g => g.measurable)
        .reduce((sum, g) => sum + (g.current / g.target) * 100, 0) /
      (activeGoals.filter(g => g.measurable).length || 1)
    : 0;

  const handleSaveGoal = (goalData: Goal) => {
    if (editingGoal) {
      setGoals(goals.map(g => g.id === goalData.id ? goalData : g));
    } else {
      setGoals([...goals, goalData]);
    }
    setShowModal(false);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter(g => g.id !== id));
    setShowModal(false);
    setEditingGoal(null);
  };

  const handleToggleComplete = (id: number) => {
    setGoals(goals.map(g =>
      g.id === id ? { ...g, status: g.status === 'completed' ? 'active' : 'completed' } : g
    ));
  };

  const handleUpdateProgress = (id: number, value: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, current: value } : g));
  };

  const toggleShareWithCoach = (id: number) => {
    setGoals(goals.map(g =>
      g.id === id ? { ...g, sharedWithCoach: !g.sharedWithCoach } : g
    ));
  };

  return (
    <div className="min-h-screen bg-background-default">
      <PageHeader
        title="Mine Målsetninger"
        subtitle={`${activeGoals.length} aktive mål`}
        action={
          <Button onClick={() => { setEditingGoal(null); setShowModal(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Nytt mål
          </Button>
        }
      />

      {/* Stats */}
      <div className="px-6 pb-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <PlayerStatCard
            label="Aktive"
            value={activeGoals.length.toString()}
            accentColor="primary"
          />
          <PlayerStatCard
            label="Fullført"
            value={completedGoals.length.toString()}
            accentColor="success"
          />
          <PlayerStatCard
            label="Snitt progr."
            value={`${Math.round(totalProgress)}%`}
            accentColor="primary"
          />
        </div>

        {/* Tabs for view mode */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)} className="mb-4">
          <TabsList>
            <TabsTrigger value="active">Aktive ({activeGoals.length})</TabsTrigger>
            <TabsTrigger value="completed">Fullførte ({completedGoals.length})</TabsTrigger>
            <TabsTrigger value="all">Alle ({goals.length})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Category filter */}
        <ScrollArea className="w-full whitespace-nowrap mb-4">
          <div className="flex gap-2 pb-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Alle
            </Button>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="gap-1"
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </Button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Goals list */}
        <div className="space-y-3">
          {filteredGoals.length > 0 ? (
            filteredGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={(g) => { setEditingGoal(g); setShowModal(true); }}
                onToggleComplete={handleToggleComplete}
                onUpdateProgress={(g) => setUpdatingGoal(g)}
                onShareWithCoach={toggleShareWithCoach}
              />
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="h-12 w-12 mx-auto mb-4 text-text-tertiary" />
                <SubSectionTitle className="text-lg font-semibold text-text-primary mb-2">
                  Ingen mål funnet
                </SubSectionTitle>
                <p className="text-sm text-text-secondary mb-4">
                  {viewMode === 'completed'
                    ? 'Du har ingen fullførte mål ennå.'
                    : 'Prøv å justere filteret eller opprett et nytt mål.'}
                </p>
                <Button onClick={() => { setEditingGoal(null); setShowModal(true); }}>
                  Opprett ditt første mål
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tips card */}
        {viewMode === 'active' && activeGoals.length > 0 && (
          <Card className="mt-6 bg-ak-warning/10 border-ak-warning/20">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-ak-warning flex-shrink-0" />
                <div>
                  <CardTitle className="font-semibold text-text-primary mb-1">
                    Tips for gode mål
                  </CardTitle>
                  <p className="text-sm text-text-secondary">
                    Bruk SMART-metoden: Spesifikke, Målbare, Oppnåelige, Relevante og
                    Tidsbestemte mål gir best resultater.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <GoalModal
        goal={editingGoal}
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
        onDelete={handleDeleteGoal}
      />

      <UpdateProgressDialog
        goal={updatingGoal}
        open={!!updatingGoal}
        onOpenChange={(open) => { if (!open) setUpdatingGoal(null); }}
        onSave={handleUpdateProgress}
      />
    </div>
  );
};

export default Maalsetninger;
