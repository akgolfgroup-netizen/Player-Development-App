import React, { useState } from 'react';
import AppShellTemplate from '../templates/AppShellTemplate';
import CalendarTemplate, { CalendarSession } from '../templates/CalendarTemplate';
import WeekView from '../../features/calendar/views/WeekView';

/**
 * CalendarLab - Demo page for CalendarTemplate
 * Shows a week view with example sessions inside AppShellTemplate
 */
// WeekView session format (keyed by day number)
interface WeekViewSession {
  id: number;
  time: string;
  name: string;
  type: string;
  duration: number;
  level: string;
  status: string;
  location?: string;
}

const CalendarLab: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeView, setActiveView] = useState<'template' | 'weekview'>('template');

  // Generate WeekView-format sessions (keyed by day number)
  const getWeekViewSessions = (): Record<number, WeekViewSession[]> => {
    const today = new Date();
    const sessions: Record<number, WeekViewSession[]> = {};

    // Today's sessions
    sessions[today.getDate()] = [
      { id: 1, time: '09:00', name: 'Putting-trening', type: 'teknikk', duration: 90, level: 'L3', status: 'upcoming', location: 'Indoor Range' },
      { id: 2, time: '14:00', name: 'Videoanalyse med coach', type: 'golfslag', duration: 60, level: 'L4', status: 'upcoming', location: 'Treningssenter' },
    ];

    // Tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    sessions[tomorrow.getDate()] = [
      { id: 3, time: '10:00', name: 'Driving range', type: 'golfslag', duration: 90, level: 'L3', status: 'upcoming', location: 'Range' },
    ];

    // Day after tomorrow
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);
    sessions[dayAfter.getDate()] = [
      { id: 4, time: '08:00', name: 'Klubbturnering', type: 'konkurranse', duration: 480, level: 'L5', status: 'upcoming', location: 'Holtsmark GK' },
    ];

    // Yesterday
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    sessions[yesterday.getDate()] = [
      { id: 5, time: '11:00', name: 'Teknikk-test', type: 'teknikk', duration: 60, level: 'L3', status: 'completed' },
    ];

    // Two days ago - multiple sessions
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    sessions[twoDaysAgo.getDate()] = [
      { id: 6, time: '07:00', name: 'Morgentrening', type: 'fysisk', duration: 60, level: 'L2', status: 'completed', location: 'Gym' },
      { id: 7, time: '10:00', name: 'Kort spill', type: 'spill', duration: 60, level: 'L3', status: 'completed' },
      { id: 8, time: '14:00', name: 'Putting drill', type: 'teknikk', duration: 60, level: 'L4', status: 'completed' },
      { id: 9, time: '18:00', name: 'Kveldsrunde', type: 'spill', duration: 120, level: 'L3', status: 'completed' },
    ];

    return sessions;
  };

  // Generate example sessions for the current week
  const getExampleSessions = (): CalendarSession[] => {
    const today = new Date();
    const sessions: CalendarSession[] = [];

    // Helper to format date as YYYY-MM-DD
    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0];
    };

    // Today's sessions
    sessions.push({
      id: '1',
      title: 'Putting-trening',
      start: '09:00',
      end: '10:30',
      date: formatDate(today),
      meta: 'training',
    });
    sessions.push({
      id: '2',
      title: 'Videoanalyse med coach',
      start: '14:00',
      end: '15:00',
      date: formatDate(today),
      meta: 'session',
    });

    // Tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    sessions.push({
      id: '3',
      title: 'Driving range',
      start: '10:00',
      end: '11:30',
      date: formatDate(tomorrow),
      meta: 'training',
    });

    // Day after tomorrow
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);
    sessions.push({
      id: '4',
      title: 'Klubbturnering',
      start: '08:00',
      end: '16:00',
      date: formatDate(dayAfter),
      meta: 'tournament',
    });

    // Yesterday
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    sessions.push({
      id: '5',
      title: 'Teknikk-test',
      start: '11:00',
      end: '12:00',
      date: formatDate(yesterday),
      meta: 'test',
    });

    // Two days ago - multiple sessions
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    sessions.push({
      id: '6',
      title: 'Morgentrening',
      start: '07:00',
      end: '08:00',
      date: formatDate(twoDaysAgo),
      meta: 'training',
    });
    sessions.push({
      id: '7',
      title: 'Kort spill',
      start: '10:00',
      end: '11:00',
      date: formatDate(twoDaysAgo),
      meta: 'training',
    });
    sessions.push({
      id: '8',
      title: 'Putting drill',
      start: '14:00',
      end: '15:00',
      date: formatDate(twoDaysAgo),
      meta: 'session',
    });
    sessions.push({
      id: '9',
      title: 'Kveldsrunde',
      start: '18:00',
      end: '20:00',
      date: formatDate(twoDaysAgo),
      meta: 'training',
    });

    return sessions;
  };

  const sessions = getExampleSessions();
  const weekViewSessions = getWeekViewSessions();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSessionSelect = (id: string) => {
    const session = sessions.find((s) => s.id === id);
    if (session) {
      alert(`Valgt økt: ${session.title}\n${session.start} - ${session.end}`);
    }
  };

  const handleWeekViewSessionClick = (session: WeekViewSession, date: Date) => {
    alert(`WeekView Session: ${session.name}\nTid: ${session.time}\nType: ${session.type}\nDato: ${date.toLocaleDateString('nb-NO')}`);
  };

  const handleNavigate = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };

  // Bottom navigation for demo
  const bottomNavContent = (
    <div style={styles.bottomNavContent}>
      <button style={styles.navButton}>
        <span style={styles.navIcon}>🏠</span>
        <span style={styles.navLabel}>Hjem</span>
      </button>
      <button style={{ ...styles.navButton, ...styles.navButtonActive }}>
        <span style={styles.navIcon}>📅</span>
        <span style={styles.navLabel}>Kalender</span>
      </button>
      <button style={styles.navButton}>
        <span style={styles.navIcon}>📊</span>
        <span style={styles.navLabel}>Statistikk</span>
      </button>
      <button style={styles.navButton}>
        <span style={styles.navIcon}>⚙️</span>
        <span style={styles.navLabel}>Innstillinger</span>
      </button>
    </div>
  );

  return (
    <div style={styles.labContainer}>
      {/* View Toggle */}
      <div style={styles.viewToggle}>
        <button
          style={{
            ...styles.toggleButton,
            ...(activeView === 'template' ? styles.toggleButtonActive : {}),
          }}
          onClick={() => setActiveView('template')}
        >
          CalendarTemplate
        </button>
        <button
          style={{
            ...styles.toggleButton,
            ...(activeView === 'weekview' ? styles.toggleButtonActive : {}),
          }}
          onClick={() => setActiveView('weekview')}
        >
          WeekView (ny)
        </button>
      </div>

      {/* Demo Frame */}
      <div style={activeView === 'weekview' ? styles.demoFrameWide : styles.demoFrame}>
        {activeView === 'template' ? (
          <AppShellTemplate
            title="Kalender"
            subtitle="Din treningsuke"
            bottomNav={bottomNavContent}
          >
            <CalendarTemplate
              selectedDate={selectedDate}
              sessions={sessions}
              onSelectDate={handleDateSelect}
              onSelectSession={handleSessionSelect}
            />
            {/* Legend */}
            <div style={styles.legend}>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, backgroundColor: 'var(--accent)' }} />
                <span style={styles.legendText}>Trening</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, backgroundColor: 'var(--achievement)' }} />
                <span style={styles.legendText}>Turnering</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, backgroundColor: 'var(--warning)' }} />
                <span style={styles.legendText}>Test</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, backgroundColor: 'var(--success)' }} />
                <span style={styles.legendText}>Økt</span>
              </div>
            </div>
          </AppShellTemplate>
        ) : (
          <WeekView
            currentDate={selectedDate}
            sessions={weekViewSessions}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onSessionClick={handleWeekViewSessionClick}
            onNavigate={handleNavigate}
            onAddEvent={() => alert('Legg til ny hendelse')}
          />
        )}
      </div>

      {/* Info Panel */}
      <div style={styles.infoPanel}>
        <h3 style={styles.infoTitle}>CalendarTemplate Props</h3>
        <ul style={styles.propsList}>
          <li>
            <code>selectedDate: Date</code> - Valgt dato
          </li>
          <li>
            <code>sessions: CalendarSession[]</code> - Liste med økter
          </li>
          <li>
            <code>onSelectDate?: (date: Date) =&gt; void</code> - Callback ved dagsklikk
          </li>
          <li>
            <code>onSelectSession?: (id: string) =&gt; void</code> - Callback ved øktklikk
          </li>
          <li>
            <code>className?: string</code> - Ekstra CSS-klasse
          </li>
        </ul>

        <h3 style={{ ...styles.infoTitle, marginTop: 'var(--spacing-4)' }}>
          CalendarSession Interface
        </h3>
        <pre style={styles.codeBlock}>
{`{
  id: string
  title: string
  start: string   // "08:00"
  end: string     // "09:00"
  date: string    // "YYYY-MM-DD"
  meta?: string   // type økt
}`}
        </pre>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  labContainer: {
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    padding: 'var(--spacing-6)',
  },
  viewToggle: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-4)',
  },
  toggleButton: {
    padding: 'var(--spacing-2) var(--spacing-4)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
    fontSize: 'var(--font-size-footnote)',
    transition: 'all 0.2s',
  },
  toggleButtonActive: {
    backgroundColor: 'var(--accent)',
    color: 'white',
    borderColor: 'var(--accent)',
  },
  demoFrame: {
    maxWidth: '480px',
    margin: '0 auto',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    height: '700px',
    position: 'relative',
  },
  demoFrameWide: {
    maxWidth: '1536px',
    margin: '0 auto',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    height: '700px',
    position: 'relative',
    backgroundColor: 'white',
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-3)',
    marginTop: 'var(--spacing-4)',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  legendText: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
  },
  bottomNavContent: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: 'var(--spacing-2) 0',
  },
  navButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 'var(--spacing-1)',
  },
  navButtonActive: {
    color: 'var(--accent)',
  },
  navIcon: {
    fontSize: '20px',
  },
  navLabel: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-secondary)',
  },
  infoPanel: {
    maxWidth: '480px',
    margin: 'var(--spacing-6) auto 0',
    padding: 'var(--spacing-4)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 'var(--radius-md)',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoTitle: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 600,
    marginBottom: 'var(--spacing-3)',
    color: 'white',
  },
  propsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    fontSize: 'var(--font-size-footnote)',
    lineHeight: 1.8,
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 'var(--spacing-3)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--font-size-caption1)',
    fontFamily: 'monospace',
    overflow: 'auto',
  },
};

export default CalendarLab;
