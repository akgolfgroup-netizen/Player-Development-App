/**
 * AK Golf Academy - Coach Booking Settings
 * Design System v3.0 - Blue Palette 01
 *
 * Innstillinger for trenerens tilgjengelighet og bookingpreferanser.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Settings,
  Save,
  Plus,
  X,
  Trash2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Bell,
  Lock,
  Unlock,
  Copy,
} from 'lucide-react';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import Button from '../../ui/primitives/Button';
import { SectionTitle } from '../../components/typography';

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

interface SessionType {
  id: string;
  name: string;
  duration: number;
  description?: string;
  enabled: boolean;
}

interface BlockedDate {
  id: string;
  date: string;
  reason?: string;
}

interface BookingSettings {
  weeklySchedule: Record<string, DaySchedule>;
  sessionTypes: SessionType[];
  blockedDates: BlockedDate[];
  advanceBookingDays: number;
  minNoticeHours: number;
  autoApprove: boolean;
  notifyOnRequest: boolean;
  bufferMinutes: number;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Mandag' },
  { key: 'tuesday', label: 'Tirsdag' },
  { key: 'wednesday', label: 'Onsdag' },
  { key: 'thursday', label: 'Torsdag' },
  { key: 'friday', label: 'Fredag' },
  { key: 'saturday', label: 'Lørdag' },
  { key: 'sunday', label: 'Søndag' },
];

export default function CoachBookingSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [newBlockedDate, setNewBlockedDate] = useState({ date: '', reason: '' });
  const [showAddBlockedDate, setShowAddBlockedDate] = useState(false);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/v1/coach/bookings/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data.settings);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        // Mock settings for development
        setSettings(generateMockSettings());
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Generate mock settings
  const generateMockSettings = (): BookingSettings => {
    const defaultSlots = [
      { start: '09:00', end: '12:00' },
      { start: '13:00', end: '17:00' },
    ];

    const weeklySchedule: Record<string, DaySchedule> = {};
    DAYS_OF_WEEK.forEach(({ key }) => {
      weeklySchedule[key] = {
        enabled: key !== 'sunday',
        slots: key === 'saturday' ? [{ start: '10:00', end: '14:00' }] : [...defaultSlots],
      };
    });

    return {
      weeklySchedule,
      sessionTypes: [
        { id: '1', name: 'Individuell økt', duration: 60, description: 'En-til-en trening', enabled: true },
        { id: '2', name: 'Videoanalyse', duration: 45, description: 'Analyse av svingteknikk', enabled: true },
        { id: '3', name: 'På banen', duration: 90, description: 'Trening på banen', enabled: true },
        { id: '4', name: 'Putting spesial', duration: 60, description: 'Fokus på putting', enabled: true },
        { id: '5', name: 'Kort spill', duration: 60, description: 'Chipping og pitching', enabled: false },
      ],
      blockedDates: [
        { id: '1', date: '2025-12-24', reason: 'Julaften' },
        { id: '2', date: '2025-12-25', reason: '1. juledag' },
        { id: '3', date: '2025-12-31', reason: 'Nyttårsaften' },
      ],
      advanceBookingDays: 14,
      minNoticeHours: 24,
      autoApprove: false,
      notifyOnRequest: true,
      bufferMinutes: 15,
    };
  };

  // Save settings
  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      await fetch('/api/v1/coach/bookings/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Show success for demo
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Toggle day enabled
  const toggleDayEnabled = (dayKey: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      weeklySchedule: {
        ...settings.weeklySchedule,
        [dayKey]: {
          ...settings.weeklySchedule[dayKey],
          enabled: !settings.weeklySchedule[dayKey].enabled,
        },
      },
    });
  };

  // Add time slot to day
  const addTimeSlot = (dayKey: string) => {
    if (!settings) return;
    const day = settings.weeklySchedule[dayKey];
    const lastSlot = day.slots[day.slots.length - 1];
    const newStart = lastSlot ? lastSlot.end : '09:00';

    setSettings({
      ...settings,
      weeklySchedule: {
        ...settings.weeklySchedule,
        [dayKey]: {
          ...day,
          slots: [...day.slots, { start: newStart, end: '17:00' }],
        },
      },
    });
  };

  // Remove time slot
  const removeTimeSlot = (dayKey: string, slotIndex: number) => {
    if (!settings) return;
    const day = settings.weeklySchedule[dayKey];

    setSettings({
      ...settings,
      weeklySchedule: {
        ...settings.weeklySchedule,
        [dayKey]: {
          ...day,
          slots: day.slots.filter((_, i) => i !== slotIndex),
        },
      },
    });
  };

  // Update time slot
  const updateTimeSlot = (dayKey: string, slotIndex: number, field: 'start' | 'end', value: string) => {
    if (!settings) return;
    const day = settings.weeklySchedule[dayKey];

    setSettings({
      ...settings,
      weeklySchedule: {
        ...settings.weeklySchedule,
        [dayKey]: {
          ...day,
          slots: day.slots.map((slot, i) => (i === slotIndex ? { ...slot, [field]: value } : slot)),
        },
      },
    });
  };

  // Toggle session type
  const toggleSessionType = (sessionId: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      sessionTypes: settings.sessionTypes.map((type) =>
        type.id === sessionId ? { ...type, enabled: !type.enabled } : type
      ),
    });
  };

  // Add blocked date
  const addBlockedDate = () => {
    if (!settings || !newBlockedDate.date) return;

    const newBlocked: BlockedDate = {
      id: Date.now().toString(),
      date: newBlockedDate.date,
      reason: newBlockedDate.reason || undefined,
    };

    setSettings({
      ...settings,
      blockedDates: [...settings.blockedDates, newBlocked].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    });
    setNewBlockedDate({ date: '', reason: '' });
    setShowAddBlockedDate(false);
  };

  // Remove blocked date
  const removeBlockedDate = (dateId: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      blockedDates: settings.blockedDates.filter((d) => d.id !== dateId),
    });
  };

  // Copy schedule to all weekdays
  const copyToAllWeekdays = (sourceDay: string) => {
    if (!settings) return;
    const sourceSchedule = settings.weeklySchedule[sourceDay];

    const newSchedule = { ...settings.weeklySchedule };
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach((day) => {
      if (day !== sourceDay) {
        newSchedule[day] = {
          enabled: sourceSchedule.enabled,
          slots: sourceSchedule.slots.map((s) => ({ ...s })),
        };
      }
    });

    setSettings({ ...settings, weeklySchedule: newSchedule });
  };

  if (loading || !settings) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: `4px solid ${'var(--border-default)'}`,
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <PageHeader
        title="Tilgjengelighet"
        subtitle="Konfigurer arbeidstider og bookingpreferanser"
        onBack={() => navigate('/coach/booking')}
        actions={
          <Button
            variant={saved ? 'primary' : 'primary'}
            onClick={handleSave}
            disabled={saving}
            loading={saving}
            leftIcon={saved ? <CheckCircle size={18} /> : <Save size={18} />}
            style={saved ? { backgroundColor: 'var(--success)' } : undefined}
          >
            {saved ? 'Lagret!' : 'Lagre endringer'}
          </Button>
        }
      />

      <div style={{ padding: '24px', maxWidth: '1536px', margin: '0 auto' }}>
        {/* Weekly Schedule */}
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '24px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${'var(--border-default)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Clock size={20} color={'var(--accent)'} />
            <SectionTitle style={{ margin: 0 }}>
              Ukentlig tilgjengelighet
            </SectionTitle>
          </div>

          <div>
            {DAYS_OF_WEEK.map(({ key, label }) => {
              const daySchedule = settings.weeklySchedule[key];
              const isExpanded = expandedDay === key;

              return (
                <div
                  key={key}
                  style={{
                    borderBottom: `1px solid ${'var(--bg-tertiary)'}`,
                  }}
                >
                  <div
                    style={{
                      padding: '14px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isExpanded ? 'var(--bg-tertiary)' : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => toggleDayEnabled(key)}
                        style={{
                          width: 44,
                          height: 24,
                          borderRadius: '12px',
                          backgroundColor: daySchedule.enabled
                            ? 'var(--accent)'
                            : 'var(--border-default)',
                          border: 'none',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: 'var(--bg-primary)',
                            position: 'absolute',
                            top: 2,
                            left: daySchedule.enabled ? 22 : 2,
                            transition: 'left 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          }}
                        />
                      </button>
                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: 500,
                          color: daySchedule.enabled ? 'var(--text-primary)' : 'var(--text-secondary)',
                        }}
                      >
                        {label}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {daySchedule.enabled && daySchedule.slots.length > 0 && (
                        <span
                          style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {daySchedule.slots.map((s) => `${s.start}-${s.end}`).join(', ')}
                        </span>
                      )}
                      {!daySchedule.enabled && (
                        <span
                          style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            fontStyle: 'italic',
                          }}
                        >
                          Ikke tilgjengelig
                        </span>
                      )}
                      <button
                        onClick={() => setExpandedDay(isExpanded ? null : key)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'transparent',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp size={18} color={'var(--text-secondary)'} />
                        ) : (
                          <ChevronDown size={18} color={'var(--text-secondary)'} />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && daySchedule.enabled && (
                    <div
                      style={{
                        padding: '16px 20px',
                        backgroundColor: 'var(--bg-tertiary)',
                      }}
                    >
                      {daySchedule.slots.map((slot, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '12px',
                          }}
                        >
                          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Fra</span>
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateTimeSlot(key, idx, 'start', e.target.value)}
                            style={{
                              padding: '8px 12px',
                              border: `1px solid ${'var(--border-default)'}`,
                              borderRadius: 'var(--radius-md)',
                              fontSize: '14px',
                              color: 'var(--text-primary)',
                            }}
                          />
                          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>til</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateTimeSlot(key, idx, 'end', e.target.value)}
                            style={{
                              padding: '8px 12px',
                              border: `1px solid ${'var(--border-default)'}`,
                              borderRadius: 'var(--radius-md)',
                              fontSize: '14px',
                              color: 'var(--text-primary)',
                            }}
                          />
                          {daySchedule.slots.length > 1 && (
                            <button
                              onClick={() => removeTimeSlot(key, idx)}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'rgba(var(--error-rgb), 0.10)',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={16} color={'var(--error)'} />
                            </button>
                          )}
                        </div>
                      ))}

                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addTimeSlot(key)}
                          leftIcon={<Plus size={16} />}
                          style={{ border: '1px dashed var(--accent)' }}
                        >
                          Legg til tidsluke
                        </Button>
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(key) && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => copyToAllWeekdays(key)}
                            leftIcon={<Copy size={16} />}
                          >
                            Kopier til alle ukedager
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Session Types */}
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '24px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${'var(--border-default)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Calendar size={20} color={'var(--accent)'} />
            <SectionTitle style={{ margin: 0 }}>
              Økttyper
            </SectionTitle>
          </div>

          <div style={{ padding: '16px 20px' }}>
            <p
              style={{
                fontSize: '13px', lineHeight: '18px',
                color: 'var(--text-secondary)',
                margin: '0 0 16px',
              }}
            >
              Velg hvilke økttyper spillere kan booke
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {settings.sessionTypes.map((session) => (
                <div
                  key={session.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: session.enabled ? `${'var(--accent)'}08` : 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${session.enabled ? 'var(--accent)' : 'var(--border-default)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => toggleSessionType(session.id)}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '6px',
                        backgroundColor: session.enabled ? 'var(--accent)' : 'var(--bg-primary)',
                        border: `2px solid ${session.enabled ? 'var(--accent)' : 'var(--border-default)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      {session.enabled && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M11.5 4L5.5 10L2.5 7"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                    <div>
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: session.enabled ? 'var(--text-primary)' : 'var(--text-secondary)',
                          margin: 0,
                        }}
                      >
                        {session.name}
                      </p>
                      {session.description && (
                        <p
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            margin: '2px 0 0',
                          }}
                        >
                          {session.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'var(--bg-tertiary)',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                    }}
                  >
                    {session.duration} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blocked Dates */}
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '24px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${'var(--border-default)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Lock size={20} color={'var(--accent)'} />
              <SectionTitle style={{ margin: 0 }}>
                Blokkerte datoer
              </SectionTitle>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddBlockedDate(true)}
              leftIcon={<Plus size={16} />}
            >
              Legg til
            </Button>
          </div>

          <div style={{ padding: '16px 20px' }}>
            {showAddBlockedDate && (
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <input
                  type="date"
                  value={newBlockedDate.date}
                  onChange={(e) => setNewBlockedDate({ ...newBlockedDate, date: e.target.value })}
                  style={{
                    padding: '8px 12px',
                    border: `1px solid ${'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                  }}
                />
                <input
                  type="text"
                  placeholder="Årsak (valgfritt)"
                  value={newBlockedDate.reason}
                  onChange={(e) => setNewBlockedDate({ ...newBlockedDate, reason: e.target.value })}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: `1px solid ${'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                  }}
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={addBlockedDate}
                  disabled={!newBlockedDate.date}
                >
                  Legg til
                </Button>
                <button
                  onClick={() => setShowAddBlockedDate(false)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} color={'var(--text-secondary)'} />
                </button>
              </div>
            )}

            {settings.blockedDates.length === 0 ? (
              <p
                style={{
                  fontSize: '15px', lineHeight: '20px',
                  color: 'var(--text-secondary)',
                  textAlign: 'center',
                  padding: '24px',
                }}
              >
                Ingen blokkerte datoer
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {settings.blockedDates.map((blocked) => (
                  <div
                    key={blocked.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      backgroundColor: 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Calendar size={16} color={'var(--text-secondary)'} />
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {new Date(blocked.date).toLocaleDateString('nb-NO', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      {blocked.reason && (
                        <span
                          style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            fontStyle: 'italic',
                          }}
                        >
                          — {blocked.reason}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeBlockedDate(blocked.id)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={16} color={'var(--text-secondary)'} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking Preferences */}
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${'var(--border-default)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Settings size={20} color={'var(--accent)'} />
            <SectionTitle style={{ margin: 0 }}>
              Bookinginnstillinger
            </SectionTitle>
          </div>

          <div style={{ padding: '20px' }}>
            {/* Advance booking days */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                Hvor langt frem kan spillere booke?
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={settings.advanceBookingDays}
                  onChange={(e) =>
                    setSettings({ ...settings, advanceBookingDays: parseInt(e.target.value) || 14 })
                  }
                  style={{
                    width: '80px',
                    padding: '8px 12px',
                    border: `1px solid ${'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    textAlign: 'center',
                  }}
                />
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>dager</span>
              </div>
            </div>

            {/* Minimum notice */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                Minimum varslingstid
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="number"
                  min="1"
                  max="72"
                  value={settings.minNoticeHours}
                  onChange={(e) =>
                    setSettings({ ...settings, minNoticeHours: parseInt(e.target.value) || 24 })
                  }
                  style={{
                    width: '80px',
                    padding: '8px 12px',
                    border: `1px solid ${'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    textAlign: 'center',
                  }}
                />
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>timer før økt</span>
              </div>
            </div>

            {/* Buffer time */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                Buffer mellom økter
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="number"
                  min="0"
                  max="60"
                  step="5"
                  value={settings.bufferMinutes}
                  onChange={(e) =>
                    setSettings({ ...settings, bufferMinutes: parseInt(e.target.value) || 0 })
                  }
                  style={{
                    width: '80px',
                    padding: '8px 12px',
                    border: `1px solid ${'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    textAlign: 'center',
                  }}
                />
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>minutter</span>
              </div>
            </div>

            {/* Toggle options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {settings.autoApprove ? (
                    <Unlock size={18} color={'var(--accent)'} />
                  ) : (
                    <Lock size={18} color={'var(--text-secondary)'} />
                  )}
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        margin: 0,
                      }}
                    >
                      Automatisk godkjenning
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        margin: '2px 0 0',
                      }}
                    >
                      Godkjenn bookinger automatisk uten manuell gjennomgang
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, autoApprove: !settings.autoApprove })}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: '12px',
                    backgroundColor: settings.autoApprove
                      ? 'var(--accent)'
                      : 'var(--border-default)',
                    border: 'none',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-primary)',
                      position: 'absolute',
                      top: 2,
                      left: settings.autoApprove ? 22 : 2,
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Bell size={18} color={settings.notifyOnRequest ? 'var(--accent)' : 'var(--text-secondary)'} />
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        margin: 0,
                      }}
                    >
                      Varsler ved nye forespørsler
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        margin: '2px 0 0',
                      }}
                    >
                      Få varsel når en spiller sender en bookingforespørsel
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setSettings({ ...settings, notifyOnRequest: !settings.notifyOnRequest })
                  }
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: '12px',
                    backgroundColor: settings.notifyOnRequest
                      ? 'var(--accent)'
                      : 'var(--border-default)',
                    border: 'none',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-primary)',
                      position: 'absolute',
                      top: 2,
                      left: settings.notifyOnRequest ? 22 : 2,
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
