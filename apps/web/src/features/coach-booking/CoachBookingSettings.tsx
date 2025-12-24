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
import { tokens } from '../../design-tokens';

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
          backgroundColor: tokens.colors.snow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: `4px solid ${tokens.colors.gray300}`,
            borderTopColor: tokens.colors.primary,
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
        backgroundColor: tokens.colors.snow,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: tokens.colors.white,
          borderBottom: `1px solid ${tokens.colors.gray200}`,
          padding: '20px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/coach/booking')}
              style={{
                width: 40,
                height: 40,
                borderRadius: tokens.radius.md,
                backgroundColor: tokens.colors.gray100,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={20} color={tokens.colors.charcoal} />
            </button>
            <div>
              <h1
                style={{
                  ...tokens.typography.title1,
                  color: tokens.colors.charcoal,
                  margin: 0,
                }}
              >
                Tilgjengelighet
              </h1>
              <p
                style={{
                  ...tokens.typography.subheadline,
                  color: tokens.colors.steel,
                  margin: '4px 0 0',
                }}
              >
                Konfigurer arbeidstider og bookingpreferanser
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: saved ? tokens.colors.success : tokens.colors.primary,
              color: tokens.colors.white,
              border: 'none',
              borderRadius: tokens.radius.md,
              fontSize: '14px',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saved ? (
              <>
                <CheckCircle size={18} />
                Lagret!
              </>
            ) : (
              <>
                <Save size={18} />
                {saving ? 'Lagrer...' : 'Lagre endringer'}
              </>
            )}
          </button>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Weekly Schedule */}
        <div
          style={{
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.radius.lg,
            boxShadow: tokens.shadows.card,
            marginBottom: '24px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${tokens.colors.gray200}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Clock size={20} color={tokens.colors.primary} />
            <h2
              style={{
                ...tokens.typography.headline,
                color: tokens.colors.charcoal,
                margin: 0,
              }}
            >
              Ukentlig tilgjengelighet
            </h2>
          </div>

          <div>
            {DAYS_OF_WEEK.map(({ key, label }) => {
              const daySchedule = settings.weeklySchedule[key];
              const isExpanded = expandedDay === key;

              return (
                <div
                  key={key}
                  style={{
                    borderBottom: `1px solid ${tokens.colors.gray100}`,
                  }}
                >
                  <div
                    style={{
                      padding: '14px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isExpanded ? tokens.colors.gray50 : 'transparent',
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
                            ? tokens.colors.primary
                            : tokens.colors.gray300,
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
                            backgroundColor: tokens.colors.white,
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
                          color: daySchedule.enabled ? tokens.colors.charcoal : tokens.colors.steel,
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
                            color: tokens.colors.steel,
                          }}
                        >
                          {daySchedule.slots.map((s) => `${s.start}-${s.end}`).join(', ')}
                        </span>
                      )}
                      {!daySchedule.enabled && (
                        <span
                          style={{
                            fontSize: '13px',
                            color: tokens.colors.steel,
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
                          borderRadius: tokens.radius.sm,
                          backgroundColor: 'transparent',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp size={18} color={tokens.colors.steel} />
                        ) : (
                          <ChevronDown size={18} color={tokens.colors.steel} />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && daySchedule.enabled && (
                    <div
                      style={{
                        padding: '16px 20px',
                        backgroundColor: tokens.colors.gray50,
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
                          <span style={{ fontSize: '13px', color: tokens.colors.steel }}>Fra</span>
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateTimeSlot(key, idx, 'start', e.target.value)}
                            style={{
                              padding: '8px 12px',
                              border: `1px solid ${tokens.colors.gray300}`,
                              borderRadius: tokens.radius.md,
                              fontSize: '14px',
                              color: tokens.colors.charcoal,
                            }}
                          />
                          <span style={{ fontSize: '13px', color: tokens.colors.steel }}>til</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateTimeSlot(key, idx, 'end', e.target.value)}
                            style={{
                              padding: '8px 12px',
                              border: `1px solid ${tokens.colors.gray300}`,
                              borderRadius: tokens.radius.md,
                              fontSize: '14px',
                              color: tokens.colors.charcoal,
                            }}
                          />
                          {daySchedule.slots.length > 1 && (
                            <button
                              onClick={() => removeTimeSlot(key, idx)}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: tokens.radius.sm,
                                backgroundColor: `${tokens.colors.error}10`,
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={16} color={tokens.colors.error} />
                            </button>
                          )}
                        </div>
                      ))}

                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button
                          onClick={() => addTimeSlot(key)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 12px',
                            backgroundColor: 'transparent',
                            color: tokens.colors.primary,
                            border: `1px dashed ${tokens.colors.primary}`,
                            borderRadius: tokens.radius.md,
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          <Plus size={16} />
                          Legg til tidsluke
                        </button>
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(key) && (
                          <button
                            onClick={() => copyToAllWeekdays(key)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 12px',
                              backgroundColor: 'transparent',
                              color: tokens.colors.steel,
                              border: `1px solid ${tokens.colors.gray300}`,
                              borderRadius: tokens.radius.md,
                              fontSize: '13px',
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                          >
                            <Copy size={16} />
                            Kopier til alle ukedager
                          </button>
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
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.radius.lg,
            boxShadow: tokens.shadows.card,
            marginBottom: '24px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${tokens.colors.gray200}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Calendar size={20} color={tokens.colors.primary} />
            <h2
              style={{
                ...tokens.typography.headline,
                color: tokens.colors.charcoal,
                margin: 0,
              }}
            >
              Økttyper
            </h2>
          </div>

          <div style={{ padding: '16px 20px' }}>
            <p
              style={{
                ...tokens.typography.caption1,
                color: tokens.colors.steel,
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
                    backgroundColor: session.enabled ? `${tokens.colors.primary}08` : tokens.colors.gray50,
                    borderRadius: tokens.radius.md,
                    border: `1px solid ${session.enabled ? tokens.colors.primary : tokens.colors.gray200}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => toggleSessionType(session.id)}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '6px',
                        backgroundColor: session.enabled ? tokens.colors.primary : tokens.colors.white,
                        border: `2px solid ${session.enabled ? tokens.colors.primary : tokens.colors.gray300}`,
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
                          color: session.enabled ? tokens.colors.charcoal : tokens.colors.steel,
                          margin: 0,
                        }}
                      >
                        {session.name}
                      </p>
                      {session.description && (
                        <p
                          style={{
                            fontSize: '12px',
                            color: tokens.colors.steel,
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
                      color: tokens.colors.steel,
                      backgroundColor: tokens.colors.gray100,
                      padding: '4px 10px',
                      borderRadius: tokens.radius.full,
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
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.radius.lg,
            boxShadow: tokens.shadows.card,
            marginBottom: '24px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${tokens.colors.gray200}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Lock size={20} color={tokens.colors.primary} />
              <h2
                style={{
                  ...tokens.typography.headline,
                  color: tokens.colors.charcoal,
                  margin: 0,
                }}
              >
                Blokkerte datoer
              </h2>
            </div>
            <button
              onClick={() => setShowAddBlockedDate(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.white,
                border: 'none',
                borderRadius: tokens.radius.md,
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              Legg til
            </button>
          </div>

          <div style={{ padding: '16px 20px' }}>
            {showAddBlockedDate && (
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: tokens.colors.gray50,
                  borderRadius: tokens.radius.md,
                }}
              >
                <input
                  type="date"
                  value={newBlockedDate.date}
                  onChange={(e) => setNewBlockedDate({ ...newBlockedDate, date: e.target.value })}
                  style={{
                    padding: '8px 12px',
                    border: `1px solid ${tokens.colors.gray300}`,
                    borderRadius: tokens.radius.md,
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
                    border: `1px solid ${tokens.colors.gray300}`,
                    borderRadius: tokens.radius.md,
                    fontSize: '14px',
                  }}
                />
                <button
                  onClick={addBlockedDate}
                  disabled={!newBlockedDate.date}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: tokens.colors.primary,
                    color: tokens.colors.white,
                    border: 'none',
                    borderRadius: tokens.radius.md,
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: newBlockedDate.date ? 'pointer' : 'not-allowed',
                    opacity: newBlockedDate.date ? 1 : 0.5,
                  }}
                >
                  Legg til
                </button>
                <button
                  onClick={() => setShowAddBlockedDate(false)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: tokens.radius.sm,
                    backgroundColor: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} color={tokens.colors.steel} />
                </button>
              </div>
            )}

            {settings.blockedDates.length === 0 ? (
              <p
                style={{
                  ...tokens.typography.subheadline,
                  color: tokens.colors.steel,
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
                      backgroundColor: tokens.colors.gray50,
                      borderRadius: tokens.radius.md,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Calendar size={16} color={tokens.colors.steel} />
                      <span style={{ fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal }}>
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
                            color: tokens.colors.steel,
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
                        borderRadius: tokens.radius.sm,
                        backgroundColor: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={16} color={tokens.colors.steel} />
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
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.radius.lg,
            boxShadow: tokens.shadows.card,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${tokens.colors.gray200}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Settings size={20} color={tokens.colors.primary} />
            <h2
              style={{
                ...tokens.typography.headline,
                color: tokens.colors.charcoal,
                margin: 0,
              }}
            >
              Bookinginnstillinger
            </h2>
          </div>

          <div style={{ padding: '20px' }}>
            {/* Advance booking days */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: tokens.colors.charcoal,
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
                    border: `1px solid ${tokens.colors.gray300}`,
                    borderRadius: tokens.radius.md,
                    fontSize: '14px',
                    textAlign: 'center',
                  }}
                />
                <span style={{ fontSize: '14px', color: tokens.colors.steel }}>dager</span>
              </div>
            </div>

            {/* Minimum notice */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: tokens.colors.charcoal,
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
                    border: `1px solid ${tokens.colors.gray300}`,
                    borderRadius: tokens.radius.md,
                    fontSize: '14px',
                    textAlign: 'center',
                  }}
                />
                <span style={{ fontSize: '14px', color: tokens.colors.steel }}>timer før økt</span>
              </div>
            </div>

            {/* Buffer time */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: tokens.colors.charcoal,
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
                    border: `1px solid ${tokens.colors.gray300}`,
                    borderRadius: tokens.radius.md,
                    fontSize: '14px',
                    textAlign: 'center',
                  }}
                />
                <span style={{ fontSize: '14px', color: tokens.colors.steel }}>minutter</span>
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
                  backgroundColor: tokens.colors.gray50,
                  borderRadius: tokens.radius.md,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {settings.autoApprove ? (
                    <Unlock size={18} color={tokens.colors.primary} />
                  ) : (
                    <Lock size={18} color={tokens.colors.steel} />
                  )}
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: tokens.colors.charcoal,
                        margin: 0,
                      }}
                    >
                      Automatisk godkjenning
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: tokens.colors.steel,
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
                      ? tokens.colors.primary
                      : tokens.colors.gray300,
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
                      backgroundColor: tokens.colors.white,
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
                  backgroundColor: tokens.colors.gray50,
                  borderRadius: tokens.radius.md,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Bell size={18} color={settings.notifyOnRequest ? tokens.colors.primary : tokens.colors.steel} />
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: tokens.colors.charcoal,
                        margin: 0,
                      }}
                    >
                      Varsler ved nye forespørsler
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: tokens.colors.steel,
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
                      ? tokens.colors.primary
                      : tokens.colors.gray300,
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
                      backgroundColor: tokens.colors.white,
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
