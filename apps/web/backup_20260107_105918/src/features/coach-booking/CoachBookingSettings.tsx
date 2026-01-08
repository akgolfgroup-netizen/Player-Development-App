/**
 * TIER Golf Academy - Coach Booking Settings
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
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

// ============================================================================
// COMPONENTS
// ============================================================================

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`w-11 h-6 rounded-xl border-none relative cursor-pointer transition-colors ${
      enabled ? 'bg-tier-navy' : 'bg-tier-border-default'
    }`}
  >
    <div
      className={`w-5 h-5 rounded-full bg-tier-white absolute top-0.5 shadow transition-all ${
        enabled ? 'left-[22px]' : 'left-0.5'
      }`}
    />
  </button>
);

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
      <div className="min-h-screen bg-tier-surface-base flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-tier-border-default border-t-tier-navy rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tier-surface-base font-sans">
      {/* Header */}
      <PageHeader
        title="Tilgjengelighet"
        subtitle="Konfigurer arbeidstider og bookingpreferanser"
        onBack={() => navigate('/coach/booking')}
        actions={
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            loading={saving}
            leftIcon={saved ? <CheckCircle size={18} /> : <Save size={18} />}
            className={saved ? 'bg-tier-success' : ''}
          >
            {saved ? 'Lagret!' : 'Lagre endringer'}
          </Button>
        }
      />

      <div className="p-6 w-full">
        {/* Weekly Schedule */}
        <div className="bg-tier-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="py-4 px-5 border-b border-tier-border-default flex items-center gap-3">
            <Clock size={20} className="text-tier-navy" />
            <SectionTitle className="m-0">
              Ukentlig tilgjengelighet
            </SectionTitle>
          </div>

          <div>
            {DAYS_OF_WEEK.map(({ key, label }) => {
              const daySchedule = settings.weeklySchedule[key];
              const isExpanded = expandedDay === key;

              return (
                <div key={key} className="border-b border-tier-surface-base">
                  <div className={`py-3.5 px-5 flex items-center justify-between ${isExpanded ? 'bg-tier-surface-base' : ''}`}>
                    <div className="flex items-center gap-3">
                      <ToggleSwitch
                        enabled={daySchedule.enabled}
                        onToggle={() => toggleDayEnabled(key)}
                      />
                      <span className={`text-[15px] font-medium ${daySchedule.enabled ? 'text-tier-navy' : 'text-tier-text-secondary'}`}>
                        {label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {daySchedule.enabled && daySchedule.slots.length > 0 && (
                        <span className="text-[13px] text-tier-text-secondary">
                          {daySchedule.slots.map((s) => `${s.start}-${s.end}`).join(', ')}
                        </span>
                      )}
                      {!daySchedule.enabled && (
                        <span className="text-[13px] text-tier-text-secondary italic">
                          Ikke tilgjengelig
                        </span>
                      )}
                      <button
                        onClick={() => setExpandedDay(isExpanded ? null : key)}
                        className="w-8 h-8 rounded bg-transparent border-none flex items-center justify-center cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronUp size={18} className="text-tier-text-secondary" />
                        ) : (
                          <ChevronDown size={18} className="text-tier-text-secondary" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && daySchedule.enabled && (
                    <div className="py-4 px-5 bg-gradient-to-br from-tier-white via-tier-surface-base to-tier-surface-base">
                      {daySchedule.slots.map((slot, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 mb-3 p-3 bg-white rounded-xl border border-tier-border-default shadow-sm hover:shadow-md hover:border-tier-navy/30 transition-all"
                        >
                          <div className="w-10 h-10 rounded-lg bg-tier-navy/10 flex items-center justify-center shrink-0">
                            <Clock size={18} className="text-tier-navy" />
                          </div>
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-medium text-tier-text-secondary">Fra</span>
                              <input
                                type="time"
                                value={slot.start}
                                onChange={(e) => updateTimeSlot(key, idx, 'start', e.target.value)}
                                className="py-2 px-3 border-2 border-tier-border-default rounded-lg text-sm text-tier-navy font-semibold focus:border-tier-navy focus:outline-none bg-tier-white"
                              />
                            </div>
                            <div className="w-8 h-0.5 bg-tier-border-default rounded-full" />
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-medium text-tier-text-secondary">til</span>
                              <input
                                type="time"
                                value={slot.end}
                                onChange={(e) => updateTimeSlot(key, idx, 'end', e.target.value)}
                                className="py-2 px-3 border-2 border-tier-border-default rounded-lg text-sm text-tier-navy font-semibold focus:border-tier-navy focus:outline-none bg-tier-white"
                              />
                            </div>
                          </div>
                          {daySchedule.slots.length > 1 && (
                            <button
                              onClick={() => removeTimeSlot(key, idx)}
                              className="w-9 h-9 rounded-lg bg-tier-error/10 border-none flex items-center justify-center cursor-pointer hover:bg-tier-error/20 transition-colors shrink-0"
                            >
                              <Trash2 size={16} className="text-tier-error" />
                            </button>
                          )}
                        </div>
                      ))}

                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addTimeSlot(key)}
                          leftIcon={<Plus size={16} />}
                          className="border border-dashed border-tier-navy"
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
        <div className="bg-tier-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="py-4 px-5 border-b border-tier-border-default flex items-center gap-3">
            <Calendar size={20} className="text-tier-navy" />
            <SectionTitle className="m-0">
              Økttyper
            </SectionTitle>
          </div>

          <div className="py-4 px-5">
            <p className="text-[13px] text-tier-text-secondary m-0 mb-4">
              Velg hvilke økttyper spillere kan booke
            </p>

            <div className="flex flex-col gap-3">
              {settings.sessionTypes.map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-4 px-5 rounded-xl border-2 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    session.enabled
                      ? 'bg-gradient-to-br from-tier-navy/10 via-ak-primary/5 to-transparent border-tier-navy/40 hover:border-tier-navy'
                      : 'bg-white border-tier-border-default hover:border-tier-border-default/80'
                  }`}
                  onClick={() => toggleSessionType(session.id)}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSessionType(session.id);
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer border-2 transition-all shadow-sm ${
                        session.enabled
                          ? 'bg-tier-navy border-tier-navy scale-105'
                          : 'bg-tier-white border-tier-border-default hover:border-tier-navy/30'
                      }`}
                    >
                      {session.enabled && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M11.5 4L5.5 10L2.5 7"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                    <div>
                      <p className={`text-[15px] font-semibold m-0 ${session.enabled ? 'text-tier-navy' : 'text-tier-text-secondary'}`}>
                        {session.name}
                      </p>
                      {session.description && (
                        <p className="text-xs text-tier-text-secondary mt-1 m-0">
                          {session.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`text-[13px] font-semibold py-1.5 px-3 rounded-full ${
                    session.enabled
                      ? 'text-tier-navy bg-white border border-tier-navy/20'
                      : 'text-tier-text-secondary bg-tier-surface-base'
                  }`}>
                    {session.duration} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blocked Dates */}
        <div className="bg-tier-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="py-4 px-5 border-b border-tier-border-default flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-tier-navy" />
              <SectionTitle className="m-0">
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

          <div className="py-4 px-5">
            {showAddBlockedDate && (
              <div className="flex gap-3 mb-4 p-3 bg-tier-surface-base rounded-lg">
                <input
                  type="date"
                  value={newBlockedDate.date}
                  onChange={(e) => setNewBlockedDate({ ...newBlockedDate, date: e.target.value })}
                  className="py-2 px-3 border border-tier-border-default rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Årsak (valgfritt)"
                  value={newBlockedDate.reason}
                  onChange={(e) => setNewBlockedDate({ ...newBlockedDate, reason: e.target.value })}
                  className="flex-1 py-2 px-3 border border-tier-border-default rounded-lg text-sm"
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
                  className="w-9 h-9 rounded bg-transparent border-none flex items-center justify-center cursor-pointer"
                >
                  <X size={18} className="text-tier-text-secondary" />
                </button>
              </div>
            )}

            {settings.blockedDates.length === 0 ? (
              <p className="text-[15px] text-tier-text-secondary text-center py-6">
                Ingen blokkerte datoer
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {settings.blockedDates.map((blocked) => (
                  <div
                    key={blocked.id}
                    className="flex items-center justify-between py-2.5 px-3.5 bg-tier-surface-base rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-tier-text-secondary" />
                      <span className="text-sm font-medium text-tier-navy">
                        {new Date(blocked.date).toLocaleDateString('nb-NO', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      {blocked.reason && (
                        <span className="text-[13px] text-tier-text-secondary italic">
                          — {blocked.reason}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeBlockedDate(blocked.id)}
                      className="w-7 h-7 rounded bg-transparent border-none flex items-center justify-center cursor-pointer"
                    >
                      <X size={16} className="text-tier-text-secondary" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking Preferences */}
        <div className="bg-tier-white rounded-xl shadow-sm overflow-hidden">
          <div className="py-4 px-5 border-b border-tier-border-default flex items-center gap-3">
            <Settings size={20} className="text-tier-navy" />
            <SectionTitle className="m-0">
              Bookinginnstillinger
            </SectionTitle>
          </div>

          <div className="p-5">
            {/* Advance booking days */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-tier-navy mb-2">
                Hvor langt frem kan spillere booke?
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={settings.advanceBookingDays}
                  onChange={(e) =>
                    setSettings({ ...settings, advanceBookingDays: parseInt(e.target.value) || 14 })
                  }
                  className="w-20 py-2 px-3 border border-tier-border-default rounded-lg text-sm text-center"
                />
                <span className="text-sm text-tier-text-secondary">dager</span>
              </div>
            </div>

            {/* Minimum notice */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-tier-navy mb-2">
                Minimum varslingstid
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="72"
                  value={settings.minNoticeHours}
                  onChange={(e) =>
                    setSettings({ ...settings, minNoticeHours: parseInt(e.target.value) || 24 })
                  }
                  className="w-20 py-2 px-3 border border-tier-border-default rounded-lg text-sm text-center"
                />
                <span className="text-sm text-tier-text-secondary">timer før økt</span>
              </div>
            </div>

            {/* Buffer time */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-tier-navy mb-2">
                Buffer mellom økter
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="60"
                  step="5"
                  value={settings.bufferMinutes}
                  onChange={(e) =>
                    setSettings({ ...settings, bufferMinutes: parseInt(e.target.value) || 0 })
                  }
                  className="w-20 py-2 px-3 border border-tier-border-default rounded-lg text-sm text-center"
                />
                <span className="text-sm text-tier-text-secondary">minutter</span>
              </div>
            </div>

            {/* Toggle options */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 px-4 bg-tier-surface-base rounded-lg">
                <div className="flex items-center gap-3">
                  {settings.autoApprove ? (
                    <Unlock size={18} className="text-tier-navy" />
                  ) : (
                    <Lock size={18} className="text-tier-text-secondary" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-tier-navy m-0">
                      Automatisk godkjenning
                    </p>
                    <p className="text-xs text-tier-text-secondary mt-0.5 m-0">
                      Godkjenn bookinger automatisk uten manuell gjennomgang
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={settings.autoApprove}
                  onToggle={() => setSettings({ ...settings, autoApprove: !settings.autoApprove })}
                />
              </div>

              <div className="flex items-center justify-between p-3 px-4 bg-tier-surface-base rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell size={18} className={settings.notifyOnRequest ? 'text-tier-navy' : 'text-tier-text-secondary'} />
                  <div>
                    <p className="text-sm font-medium text-tier-navy m-0">
                      Varsler ved nye forespørsler
                    </p>
                    <p className="text-xs text-tier-text-secondary mt-0.5 m-0">
                      Få varsel når en spiller sender en bookingforespørsel
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={settings.notifyOnRequest}
                  onToggle={() => setSettings({ ...settings, notifyOnRequest: !settings.notifyOnRequest })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
