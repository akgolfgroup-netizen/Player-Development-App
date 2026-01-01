/**
 * Day View Execution Surface
 *
 * STRATEGIC INTENT (NON-NEGOTIABLE):
 * - The Home screen decides WHAT the athlete should do.
 * - The Day View exists only to help the athlete EXECUTE that decision.
 * - There must always be: One clear priority, One primary action, Secondary info after action.
 *
 * This is NOT a Google Calendar clone.
 * This is a PERFORMANCE EXECUTION SURFACE.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayViewProps, Workout, ExternalEvent, RescheduleOption, ShortenOption } from './types';
import { useDayViewState } from './useDayViewState';
import { DecisionAnchor } from './DecisionAnchor';
import { TimeGrid } from './TimeGrid';
import { EventDetailPanel } from './EventDetailPanel';
import { WorkoutSelectorModal } from './WorkoutSelectorModal';
import { TimePickerModal } from './TimePickerModal';
import { WorkoutContentViewer } from './WorkoutContentViewer';

// Semantic styles (NO raw hex values)
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    backgroundColor: 'var(--background-default)',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-3) var(--spacing-4)',
    backgroundColor: 'var(--background-white)',
    borderBottom: '1px solid var(--border-subtle)',
    flexShrink: 0,
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-tertiary)',
  },
  breadcrumbLink: {
    color: 'var(--text-tertiary)',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.15s ease',
  },
  breadcrumbCurrent: {
    color: 'var(--text-primary)',
    fontWeight: 500,
  },
  dateNav: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
  },
  dateDisplay: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '0 var(--spacing-3)',
  },
  dateDay: {
    fontSize: 'var(--font-size-headline)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  dateMonth: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    transition: 'all 0.15s ease',
  },
  todayButton: {
    padding: '0 var(--spacing-3)',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    height: '36px',
    transition: 'all 0.15s ease',
  },
  viewSwitcher: {
    display: 'flex',
    gap: '2px',
    padding: '2px',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
  },
  viewButton: {
    padding: 'var(--spacing-2) var(--spacing-3)',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'calc(var(--radius-md) - 2px)',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    transition: 'all 0.15s ease',
  },
  viewButtonActive: {
    backgroundColor: 'var(--background-white)',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-xs)',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  todayBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    backgroundColor: 'var(--accent)',
    color: 'var(--text-inverse)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-caption2)',
    fontWeight: 600,
    marginLeft: 'var(--spacing-2)',
  },
};

// Day names in Norwegian
const dayNames = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
const monthNames = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];

// Generate mock data for testing (will be replaced with real API data)
const generateMockData = (date: Date): { workouts: Workout[]; externalEvents: ExternalEvent[]; weeklyFocus: string } => {
  const dateStr = date.toISOString().split('T')[0];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isToday = new Date().toISOString().split('T')[0] === dateStr;

  // Sample workouts - simulating different states
  const workouts: Workout[] = [
    {
      id: 'workout-1',
      name: 'Putting Presisjon',
      category: 'teknikk',
      duration: 45,
      scheduledTime: '10:00',
      scheduledDate: dateStr,
      status: 'scheduled',
      isRecommended: true,
      isAllDay: false,
      location: 'AK Golf Academy',
      description: 'Fokus på korte putter (1-3 meter) med vekt på linjekontroll og hastighet.',
    },
  ];

  // Only add additional workouts some days
  if (date.getDay() === 3) { // Wednesday
    workouts.push({
      id: 'workout-2',
      name: 'Fysisk Trening',
      category: 'fysisk',
      duration: 30,
      scheduledTime: '16:00',
      scheduledDate: dateStr,
      status: 'scheduled',
      isRecommended: false,
      isAllDay: false,
    });
  }

  // Sample external events
  const externalEvents: ExternalEvent[] = [
    {
      id: 'external-1',
      title: 'Lunsj',
      startTime: '12:00',
      endTime: '13:00',
      isAllDay: false,
      collisionType: 'soft',
    },
  ];

  // Add a meeting on some days to test collision
  if (date.getDay() === 1) { // Monday
    externalEvents.push({
      id: 'external-2',
      title: 'Trener-møte',
      startTime: '09:30',
      endTime: '10:30',
      isAllDay: false,
      collisionType: 'hard',
      source: 'Google Calendar',
    });
  }

  return {
    workouts,
    externalEvents,
    weeklyFocus: 'Putting presisjon',
  };
};

export const DayViewExecution: React.FC<DayViewProps> = ({ date: initialDate, onNavigate, onBack }) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('day');

  // Modal states
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showContentViewer, setShowContentViewer] = useState(false);
  const [timePickerContext, setTimePickerContext] = useState<{ forReschedule: boolean; hour?: number }>({ forReschedule: false });
  const [selectedWorkoutForContent, setSelectedWorkoutForContent] = useState<Workout | null>(null);

  // Get mock data (will be replaced with real API hook)
  const { workouts, externalEvents, weeklyFocus } = useMemo(
    () => generateMockData(currentDate),
    [currentDate]
  );

  // Use the state machine hook
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    state: _state,
    decisionAnchorData,
    selectedEvent,
    allEvents,
    recommendedWorkout: _recommendedWorkout,
    ghostSlot,
    selectEvent,
    startWorkout,
    rescheduleWorkout,
    shortenWorkout,
    completeWorkout,
    pauseWorkout,
    cancelWorkout,
  } = useDayViewState({
    date: currentDate,
    workouts,
    externalEvents,
    weeklyFocus,
  });

  // Check if current date is today
  const isToday = useMemo(() => {
    const today = new Date();
    return (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  }, [currentDate]);

  // Navigation handlers
  const handleNavigate = useCallback(
    (direction: -1 | 0 | 1, goToToday = false) => {
      if (goToToday || direction === 0) {
        setCurrentDate(new Date());
      } else {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + direction);
        setCurrentDate(newDate);
      }
      onNavigate?.(direction, goToToday);
    },
    [currentDate, onNavigate]
  );

  // Handle reschedule from decision anchor
  const handleReschedule = useCallback(
    (option: RescheduleOption) => {
      rescheduleWorkout(option);
    },
    [rescheduleWorkout]
  );

  // Handle shorten from detail panel
  const handleShorten = useCallback(
    (duration: ShortenOption) => {
      shortenWorkout(duration);
    },
    [shortenWorkout]
  );

  // Handle workout selection from modal
  const handleWorkoutSelect = useCallback((workout: Workout) => {
    // Add the selected workout to the day
    console.log('Workout selected:', workout);
    setShowWorkoutSelector(false);
  }, []);

  // Handle time selection from picker
  const handleTimeSelect = useCallback((time: string) => {
    if (timePickerContext.forReschedule) {
      // Reschedule to specific time
      rescheduleWorkout({ type: 'specific_time', time });
    } else {
      // Could be used for quick-add at specific time
      console.log('Time selected for new workout:', time);
    }
    setShowTimePicker(false);
  }, [timePickerContext, rescheduleWorkout]);

  // Open time picker for reschedule
  const handleOpenTimePicker = useCallback((forReschedule = true) => {
    setTimePickerContext({ forReschedule });
    setShowTimePicker(true);
  }, []);

  // Open content viewer
  const handleViewContent = useCallback((workout: Workout) => {
    setSelectedWorkoutForContent(workout);
    setShowContentViewer(true);
  }, []);

  return (
    <div style={styles.container}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <span
            style={styles.breadcrumbLink}
            onClick={onBack}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
          >
            Dashboard
          </span>
          <span>→</span>
          <span
            style={styles.breadcrumbLink}
            onClick={() => setCurrentView('month')}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
          >
            Kalender
          </span>
          <span>→</span>
          <span style={styles.breadcrumbCurrent}>Dag</span>
        </div>

        {/* Date Navigation */}
        <div style={styles.dateNav}>
          <button
            style={styles.navButton}
            onClick={() => handleNavigate(-1)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-brand)';
              e.currentTarget.style.color = 'var(--text-brand)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <ChevronLeft size={18} />
          </button>

          <div style={styles.dateDisplay}>
            <div style={styles.dateDay}>
              {dayNames[currentDate.getDay()]} {currentDate.getDate()}
              {isToday && <span style={styles.todayBadge}>I dag</span>}
            </div>
            <div style={styles.dateMonth}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
          </div>

          <button
            style={styles.navButton}
            onClick={() => handleNavigate(1)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-brand)';
              e.currentTarget.style.color = 'var(--text-brand)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <ChevronRight size={18} />
          </button>

          {!isToday && (
            <button
              style={styles.todayButton}
              onClick={() => handleNavigate(0, true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-brand)';
                e.currentTarget.style.backgroundColor = 'var(--accent-muted)';
                e.currentTarget.style.color = 'var(--text-brand)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              I dag
            </button>
          )}
        </div>

        {/* View Switcher */}
        <div style={styles.viewSwitcher}>
          {(['day', 'week', 'month'] as const).map((view) => (
            <button
              key={view}
              style={{
                ...styles.viewButton,
                ...(currentView === view ? styles.viewButtonActive : {}),
              }}
              onClick={() => setCurrentView(view)}
            >
              {view === 'day' ? 'Dag' : view === 'week' ? 'Uke' : 'Måned'}
            </button>
          ))}
        </div>
      </div>

      {/* Decision Anchor (ALWAYS VISIBLE) */}
      <DecisionAnchor
        data={decisionAnchorData}
        onStartWorkout={() => startWorkout('decision_anchor')}
        onReschedule={handleReschedule}
        onComplete={completeWorkout}
        onPause={pauseWorkout}
        onCancel={cancelWorkout}
        onSelectWorkout={() => setShowWorkoutSelector(true)}
        onOpenTimePicker={() => handleOpenTimePicker(true)}
      />

      {/* Main Content Area */}
      <div style={styles.mainContent}>
        <TimeGrid
          date={currentDate}
          events={allEvents}
          recommendedSlot={ghostSlot || undefined}
          onEventClick={selectEvent}
          onTimeSlotClick={(hour) => {
            // Open time picker initialized to this hour
            setTimePickerContext({ forReschedule: false, hour });
            setShowTimePicker(true);
          }}
        />
      </div>

      {/* Event Detail Panel */}
      <EventDetailPanel
        event={selectedEvent}
        isOpen={selectedEvent !== null}
        onClose={() => selectEvent(null)}
        onStart={() => {
          startWorkout('detail_panel');
          selectEvent(null);
        }}
        onReschedule={(option) => {
          handleReschedule(option);
          selectEvent(null);
        }}
        onShorten={(duration) => {
          handleShorten(duration);
        }}
        onComplete={() => {
          completeWorkout();
          selectEvent(null);
        }}
        onOpenTimePicker={() => handleOpenTimePicker(true)}
        onViewContent={(workout) => handleViewContent(workout)}
      />

      {/* Workout Selector Modal */}
      <WorkoutSelectorModal
        isOpen={showWorkoutSelector}
        onClose={() => setShowWorkoutSelector(false)}
        onSelect={handleWorkoutSelect}
        date={currentDate}
      />

      {/* Time Picker Modal */}
      <TimePickerModal
        isOpen={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onSelect={handleTimeSelect}
        initialTime={timePickerContext.hour ? `${timePickerContext.hour.toString().padStart(2, '0')}:00` : undefined}
        title={timePickerContext.forReschedule ? 'Velg nytt tidspunkt' : 'Velg tidspunkt'}
      />

      {/* Workout Content Viewer */}
      <WorkoutContentViewer
        isOpen={showContentViewer}
        onClose={() => setShowContentViewer(false)}
        workout={selectedWorkoutForContent}
      />
    </div>
  );
};

export default DayViewExecution;
