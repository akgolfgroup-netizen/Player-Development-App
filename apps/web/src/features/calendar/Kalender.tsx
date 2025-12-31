// @ts-nocheck
/**
 * Kalender - Calendar with shadcn/ui components
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Play } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  Card,
  CardContent,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger,
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
import { TrainingCategoryBadge } from '../../components/shadcn/golf';
import { cn } from 'lib/utils';

// Import view components
import DayView from './views/DayView';
import MonthView from './views/MonthView';
import YearView from './views/YearView';

// View constants
const VIEW_MODES = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

// Session type to category mapping
const SESSION_TYPE_TO_CATEGORY: Record<string, string> = {
  teknikk: 'teknikk',
  golfslag: 'slag',
  spill: 'spill',
  fysisk: 'fysisk',
  mental: 'mental',
  konkurranse: 'turnering',
};

// Level badge component
const LevelBadge: React.FC<{ level: string }> = ({ level }) => {
  const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    L1: 'outline',
    L2: 'outline',
    L3: 'secondary',
    L4: 'default',
    L5: 'default',
  };

  return (
    <Badge variant={variants[level] || 'secondary'} className="text-[10px]">
      {level}
    </Badge>
  );
};

// Week View Component
interface WeekViewProps {
  currentDate: Date;
  sessions: Record<number, any[]>;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onSessionClick: (session: any, date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  sessions,
  selectedDate,
  onDateSelect,
  onSessionClick,
}) => {
  const weekDays = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

  const getWeekDates = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));

    return Array.from({ length: 7 }, (_, i) => {
      const weekDate = new Date(monday);
      weekDate.setDate(monday.getDate() + i);
      return weekDate;
    });
  };

  const weekDates = getWeekDates(currentDate);
  const today = new Date();

  const getDayStats = (date: Date) => {
    const day = date.getDate();
    const daySessions = sessions[day] || [];
    const completed = daySessions.filter((s: any) => s.status === 'completed').length;
    const total = daySessions.length;
    return { completed, total };
  };

  return (
    <Card className="overflow-hidden">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-border-subtle">
        {weekDays.map((day, idx) => {
          const date = weekDates[idx];
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
          const stats = getDayStats(date);

          return (
            <div
              key={day}
              className={cn(
                "p-3 text-center border-r border-border-subtle last:border-r-0 cursor-pointer transition-colors",
                isSelected && "bg-ak-primary/5",
                !isSelected && "hover:bg-background-default"
              )}
              onClick={() => onDateSelect(date)}
            >
              <p className="text-xs text-text-secondary mb-1">{day}</p>
              <p className={cn(
                "text-lg font-semibold",
                isToday && "text-ak-primary",
                isSelected && !isToday && "text-ak-primary",
                !isToday && !isSelected && "text-text-primary"
              )}>
                {date.getDate()}
              </p>
              {stats.total > 0 && (
                <div className="mt-1">
                  <span className={cn(
                    "text-[10px]",
                    stats.completed === stats.total ? "text-ak-success" : "text-text-secondary"
                  )}>
                    {stats.completed}/{stats.total}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Time Grid */}
      <div className="grid grid-cols-7 min-h-[400px]">
        {weekDates.map((date, dayIdx) => {
          const day = date.getDate();
          const daySessions = sessions[day] || [];
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

          return (
            <div
              key={dayIdx}
              className={cn(
                "border-r border-border-subtle last:border-r-0 p-2",
                isSelected && "bg-ak-primary/5"
              )}
            >
              {daySessions.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <span className="text-xs text-text-tertiary">-</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {daySessions.map((session: any) => {
                    const category = SESSION_TYPE_TO_CATEGORY[session.type] || 'teknikk';
                    return (
                      <Card
                        key={session.id}
                        className={cn(
                          "p-2 cursor-pointer transition-all hover:shadow-md border-l-4",
                          session.status === 'completed' && "opacity-70"
                        )}
                        style={{ borderLeftColor: `var(--ak-session-${session.type})` }}
                        onClick={() => onSessionClick(session, date)}
                      >
                        <span className="text-[10px] text-text-secondary block">{session.time}</span>
                        <p className="text-xs font-medium text-text-primary line-clamp-2">{session.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <LevelBadge level={session.level} />
                          {session.duration > 0 && (
                            <span className="text-[9px] text-text-secondary">{session.duration}m</span>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// Session Preview Dialog
interface SessionPreviewDialogProps {
  session: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onStart: () => void;
}

const SessionPreviewDialog: React.FC<SessionPreviewDialogProps> = ({
  session,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onStart,
}) => {
  if (!session) return null;

  const category = SESSION_TYPE_TO_CATEGORY[session.type] || 'teknikk';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start gap-3">
            <TrainingCategoryBadge category={category as any} size="md" />
            <div>
              <DialogTitle>{session.name}</DialogTitle>
              <p className="text-sm text-text-secondary mt-1">
                {session.date?.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Clock className="h-4 w-4" />
            <span>{session.time} · {session.duration} min</span>
          </div>
          {session.location && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <MapPin className="h-4 w-4" />
              <span>{session.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <LevelBadge level={session.level} />
            <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
              {session.status === 'completed' ? 'Fullført' : 'Kommende'}
            </Badge>
            {session.assignedByCoach && (
              <Badge variant="outline">Fra trener</Badge>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">Slett</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Slett økt?</AlertDialogTitle>
                <AlertDialogDescription>
                  Er du sikker på at du vil slette denne økten?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Avbryt</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Slett</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" onClick={onEdit}>Rediger</Button>
          {session.status !== 'completed' && (
            <Button onClick={onStart} className="gap-2">
              <Play className="h-4 w-4" />
              Start økt
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Session Edit Dialog
interface SessionEditDialogProps {
  session?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  selectedDate: Date;
}

const SessionEditDialog: React.FC<SessionEditDialogProps> = ({
  session,
  open,
  onOpenChange,
  onSave,
  selectedDate,
}) => {
  const [form, setForm] = useState({
    time: '',
    name: '',
    type: 'teknikk',
    duration: '60',
    level: 'L3',
    location: '',
  });

  useEffect(() => {
    if (session) {
      setForm({
        time: session.time || '',
        name: session.name || '',
        type: session.type || 'teknikk',
        duration: String(session.duration || 60),
        level: session.level || 'L3',
        location: session.location || '',
      });
    } else {
      setForm({
        time: '',
        name: '',
        type: 'teknikk',
        duration: '60',
        level: 'L3',
        location: '',
      });
    }
  }, [session, open]);

  const handleSubmit = () => {
    if (!form.time || !form.name) {
      return;
    }

    onSave({
      id: session?.id || Date.now(),
      time: form.time,
      name: form.name,
      type: form.type,
      duration: parseInt(form.duration),
      level: form.level,
      location: form.location,
      status: session?.status || 'upcoming',
      date: selectedDate,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{session ? 'Rediger økt' : 'Ny økt'}</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tidspunkt</Label>
              <Input
                type="time"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Varighet (min)</Label>
              <Input
                type="number"
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
                min="0"
                step="15"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Navn</Label>
            <Input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="F.eks. 'Putting økt'"
            />
          </div>

          <div className="space-y-2">
            <Label>Sted</Label>
            <Input
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="F.eks. 'Driving Range'"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teknikk">Teknikk</SelectItem>
                  <SelectItem value="golfslag">Golfslag</SelectItem>
                  <SelectItem value="spill">Spill</SelectItem>
                  <SelectItem value="fysisk">Fysisk</SelectItem>
                  <SelectItem value="mental">Mental</SelectItem>
                  <SelectItem value="konkurranse">Konkurranse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nivå</Label>
              <Select value={form.level} onValueChange={v => setForm({ ...form, level: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L1">L1 - Lett</SelectItem>
                  <SelectItem value="L2">L2 - Moderat</SelectItem>
                  <SelectItem value="L3">L3 - Middels</SelectItem>
                  <SelectItem value="L4">L4 - Krevende</SelectItem>
                  <SelectItem value="L5">L5 - Maksimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Avbryt</Button>
          <Button onClick={handleSubmit} disabled={!form.time || !form.name}>Lagre</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Calendar Component
interface KalenderProps {
  events?: any[];
}

const AKGolfKalender: React.FC<KalenderProps> = ({ events = [] }) => {
  const navigate = useNavigate();
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewMode, setViewMode] = useState(VIEW_MODES.WEEK);
  const [previewSession, setPreviewSession] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);

  const monthNames = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
                      'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];

  // Demo sessions
  const demoSessions: Record<number, any[]> = {
    [today.getDate() - 1]: [
      { id: 1, time: '08:00', name: 'WANG Trening', type: 'teknikk', duration: 120, level: 'L3', status: 'completed', location: 'Indoor Range' },
    ],
    [today.getDate()]: [
      { id: 2, time: '10:00', name: 'Langspill - Jern', type: 'teknikk', duration: 90, level: 'L3', status: 'upcoming', location: 'Driving Range', assignedByCoach: true },
    ],
    [today.getDate() + 1]: [
      { id: 3, time: '10:00', name: 'Benchmark Test', type: 'teknikk', duration: 120, level: 'L5', status: 'upcoming', location: 'Test Center' },
    ],
    [today.getDate() + 2]: [
      { id: 4, time: '09:00', name: 'Spill 9 hull', type: 'spill', duration: 180, level: 'L5', status: 'upcoming', location: 'Banen' },
    ],
  };

  const [sessions, setSessions] = useState(demoSessions);

  // Get week number
  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  // Navigation
  const navigateCalendar = (direction: number) => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case VIEW_MODES.DAY: newDate.setDate(newDate.getDate() + direction); break;
      case VIEW_MODES.WEEK: newDate.setDate(newDate.getDate() + (direction * 7)); break;
      case VIEW_MODES.MONTH: newDate.setMonth(newDate.getMonth() + direction); break;
      case VIEW_MODES.YEAR: newDate.setFullYear(newDate.getFullYear() + direction); break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Session handlers
  const handleSessionClick = (session: any, date: Date) => {
    setPreviewSession({ ...session, date });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (viewMode === VIEW_MODES.YEAR) {
      setViewMode(VIEW_MODES.MONTH);
      setCurrentDate(date);
    } else if (viewMode === VIEW_MODES.MONTH) {
      setViewMode(VIEW_MODES.WEEK);
      setCurrentDate(date);
    }
  };

  const handleEditSession = () => {
    setEditingSession(previewSession);
    setPreviewSession(null);
    setShowEditModal(true);
  };

  const handleDeleteSession = () => {
    if (previewSession) {
      setSessions(prev => {
        const updated = { ...prev };
        const day = previewSession.date?.getDate() || selectedDate.getDate();
        updated[day] = (updated[day] || []).filter((s: any) => s.id !== previewSession.id);
        if (updated[day].length === 0) delete updated[day];
        return updated;
      });
      setPreviewSession(null);
    }
  };

  const handleSaveSession = (sessionData: any) => {
    setSessions(prev => {
      const updated = { ...prev };
      const day = sessionData.date.getDate();

      if (editingSession) {
        updated[day] = (updated[day] || []).map((s: any) =>
          s.id === editingSession.id ? sessionData : s
        );
      } else {
        updated[day] = [...(updated[day] || []), sessionData];
        updated[day].sort((a: any, b: any) => a.time.localeCompare(b.time));
      }

      return updated;
    });

    setShowEditModal(false);
    setEditingSession(null);
  };

  const handleStartSession = () => {
    if (previewSession) {
      navigate(`/session/${previewSession.id}/active`);
    }
  };

  // Get navigation title
  const getNavigationTitle = () => {
    switch (viewMode) {
      case VIEW_MODES.DAY:
        return `${selectedDate.getDate()}. ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
      case VIEW_MODES.WEEK:
        return `Uke ${getWeekNumber(currentDate)} · ${monthNames[currentDate.getMonth()]}`;
      case VIEW_MODES.MONTH:
        return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      case VIEW_MODES.YEAR:
        return `${currentDate.getFullYear()}`;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background-default">
      <PageHeader
        title="Kalender"
        actions={
          <Button onClick={() => { setEditingSession(null); setShowEditModal(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Ny økt
          </Button>
        }
      />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigateCalendar(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <h2 className="text-lg font-semibold text-text-primary min-w-[200px] text-center">
              {getNavigationTitle()}
            </h2>

            <Button variant="outline" size="icon" onClick={() => navigateCalendar(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button variant="ghost" onClick={goToToday} className="text-ak-primary">
              I dag
            </Button>
          </div>

          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
            <TabsList>
              <TabsTrigger value={VIEW_MODES.DAY}>Dag</TabsTrigger>
              <TabsTrigger value={VIEW_MODES.WEEK}>Uke</TabsTrigger>
              <TabsTrigger value={VIEW_MODES.MONTH}>Måned</TabsTrigger>
              <TabsTrigger value={VIEW_MODES.YEAR}>År</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Calendar Views */}
        {viewMode === VIEW_MODES.DAY && (
          <DayView
            date={selectedDate}
            sessions={sessions[selectedDate.getDate()] || []}
            onSessionClick={(session: any) => handleSessionClick(session, selectedDate)}
            onTimeSlotClick={(hour: number) => {
              setEditingSession(null);
              setShowEditModal(true);
            }}
          />
        )}

        {viewMode === VIEW_MODES.WEEK && (
          <WeekView
            currentDate={currentDate}
            sessions={sessions}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onSessionClick={handleSessionClick}
          />
        )}

        {viewMode === VIEW_MODES.MONTH && (
          <MonthView
            currentDate={currentDate}
            sessions={sessions}
            selectedDate={selectedDate}
            onDateClick={handleDateSelect}
            onNavigate={navigateCalendar}
          />
        )}

        {viewMode === VIEW_MODES.YEAR && (
          <YearView
            currentYear={currentDate.getFullYear()}
            sessionsByMonth={{}}
            onMonthClick={(monthIndex: number) => {
              setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
              setViewMode(VIEW_MODES.MONTH);
            }}
            onNavigate={navigateCalendar}
            periods={[]}
          />
        )}

        {/* Selected Day Sessions */}
        {(viewMode === VIEW_MODES.WEEK || viewMode === VIEW_MODES.MONTH) &&
          sessions[selectedDate.getDate()] && (
          <div className="mt-6">
            <h3 className="text-base font-semibold text-text-primary mb-3">
              {selectedDate.getDate()}. {monthNames[selectedDate.getMonth()]} - Økter
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sessions[selectedDate.getDate()].map((session: any) => (
                <Card
                  key={session.id}
                  className="p-4 cursor-pointer hover:border-ak-primary/30 transition-all"
                  onClick={() => handleSessionClick(session, selectedDate)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-text-secondary mb-1">
                        {session.time} · {session.duration} min
                      </p>
                      <h4 className="font-semibold text-text-primary">{session.name}</h4>
                      {session.location && (
                        <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.location}
                        </p>
                      )}
                    </div>
                    <LevelBadge level={session.level} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <SessionPreviewDialog
        session={previewSession}
        open={!!previewSession}
        onOpenChange={(open) => { if (!open) setPreviewSession(null); }}
        onEdit={handleEditSession}
        onDelete={handleDeleteSession}
        onStart={handleStartSession}
      />

      <SessionEditDialog
        session={editingSession}
        open={showEditModal}
        onOpenChange={(open) => {
          setShowEditModal(open);
          if (!open) setEditingSession(null);
        }}
        onSave={handleSaveSession}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default AKGolfKalender;
