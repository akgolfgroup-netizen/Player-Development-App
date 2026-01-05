/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AK Golf Academy - Coach Booking Calendar
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 *
 * Kalendervisning for trenerens bookinger.
 * Viser alle bookinger, ledige tider og forespørsler.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  X,
  Settings,
} from 'lucide-react';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import { SectionTitle, SubSectionTitle } from '../../components/typography';

// ============================================================================
// CLASS MAPPINGS
// ============================================================================

const SLOT_STATUS_CLASSES = {
  booked: {
    bg: 'bg-ak-primary/15',
    border: 'border-l-ak-primary',
  },
  pending: {
    bg: 'bg-ak-status-warning/15',
    border: 'border-l-ak-status-warning',
  },
  blocked: {
    bg: 'bg-ak-surface-subtle',
    border: 'border-l-ak-border-default',
  },
  available: {
    bg: 'bg-ak-surface-base',
    border: 'border-l-ak-border-default',
  },
};

interface BookingSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'pending' | 'blocked';
  booking?: {
    id: string;
    playerName: string;
    playerInitials: string;
    sessionType: string;
    notes?: string;
  };
}

interface DaySchedule {
  date: string;
  slots: BookingSlot[];
}

export default function CoachBookingCalendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);

  // Get week dates
  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

  // Fetch schedule
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const startDate = weekDates[0].toISOString().split('T')[0];
        const endDate = weekDates[6].toISOString().split('T')[0];
        const response = await fetch(
          `/api/v1/coach/bookings/schedule?start=${startDate}&end=${endDate}`
        );
        if (response.ok) {
          const data = await response.json();
          setSchedule(data.schedule || []);
        }
      } catch (error) {
        console.error('Failed to fetch schedule:', error);
        // Mock data for development
        const mockSchedule: DaySchedule[] = weekDates.map((date) => ({
          date: date.toISOString().split('T')[0],
          slots: generateMockSlots(date),
        }));
        setSchedule(mockSchedule);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [weekDates]);

  // Generate mock slots for a day
  const generateMockSlots = (date: Date): BookingSlot[] => {
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();

    // No slots on Sunday
    if (dayOfWeek === 0) return [];

    const slots: BookingSlot[] = [];
    const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

    times.forEach((time, idx) => {
      const random = Math.random();
      let status: BookingSlot['status'] = 'available';
      let booking;

      if (random < 0.3) {
        status = 'booked';
        booking = {
          id: `b${idx}`,
          playerName: ['Anders Hansen', 'Sofie Andersen', 'Erik Johansen'][idx % 3],
          playerInitials: ['AH', 'SA', 'EJ'][idx % 3],
          sessionType: ['Individuell økt', 'Videoanalyse', 'På banen'][idx % 3],
        };
      } else if (random < 0.4) {
        status = 'pending';
        booking = {
          id: `p${idx}`,
          playerName: 'Lars Olsen',
          playerInitials: 'LO',
          sessionType: 'Individuell økt',
          notes: 'Ønsker fokus på putting',
        };
      } else if (random < 0.5) {
        status = 'blocked';
      }

      slots.push({
        id: `${dateStr}-${time}`,
        date: dateStr,
        startTime: time,
        endTime: `${parseInt(time) + 1}:00`,
        status,
        booking,
      });
    });

    return slots;
  };

  // Navigation
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get status classes
  const getStatusClasses = (status: string) => {
    return SLOT_STATUS_CLASSES[status as keyof typeof SLOT_STATUS_CLASSES] || SLOT_STATUS_CLASSES.available;
  };

  // Handle slot actions
  const handleApprove = async (slotId: string) => {
    try {
      await fetch(`/api/v1/coach/bookings/${slotId}/approve`, { method: 'PUT' });
      // Refresh schedule
      setSchedule((prev) =>
        prev.map((day) => ({
          ...day,
          slots: day.slots.map((slot) =>
            slot.id === slotId ? { ...slot, status: 'booked' as const } : slot
          ),
        }))
      );
    } catch (error) {
      console.error('Failed to approve booking:', error);
    }
    setSelectedSlot(null);
  };

  const handleDecline = async (slotId: string) => {
    try {
      await fetch(`/api/v1/coach/bookings/${slotId}/decline`, { method: 'PUT' });
      setSchedule((prev) =>
        prev.map((day) => ({
          ...day,
          slots: day.slots.map((slot) =>
            slot.id === slotId
              ? { ...slot, status: 'available' as const, booking: undefined }
              : slot
          ),
        }))
      );
    } catch (error) {
      console.error('Failed to decline booking:', error);
    }
    setSelectedSlot(null);
  };

  // Stats
  const stats = useMemo(() => {
    let booked = 0;
    let pending = 0;
    let available = 0;

    schedule.forEach((day) => {
      day.slots.forEach((slot) => {
        if (slot.status === 'booked') booked++;
        else if (slot.status === 'pending') pending++;
        else if (slot.status === 'available') available++;
      });
    });

    return { booked, pending, available };
  }, [schedule]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ak-surface-subtle flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ak-border-default border-t-ak-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ak-surface-subtle font-sans">
      {/* Header - Standardized layout matching other coach pages */}
      <PageHeader
        title="Booking-kalender"
        subtitle="Administrer dine bookinger og tilgjengelighet"
        actions={
          <div className="flex gap-2.5">
            <Button
              variant="secondary"
              leftIcon={<Clock size={18} />}
              onClick={() => navigate('/coach/booking/requests')}
              className={stats.pending > 0 ? 'border-ak-status-warning text-ak-status-warning' : ''}
            >
              Forespørsler
              {stats.pending > 0 && (
                <span className="ml-2 py-0.5 px-2 bg-ak-status-warning text-white rounded-full text-xs font-semibold">
                  {stats.pending}
                </span>
              )}
            </Button>
            <Button
              variant="primary"
              leftIcon={<Settings size={18} />}
              onClick={() => navigate('/coach/booking/settings')}
            >
              Tilgjengelighet
            </Button>
          </div>
        }
      />

      {/* Quick stats below header */}
      <div className="px-6 pb-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 py-2 px-3.5 bg-ak-primary/10 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-ak-primary" />
            <span className="text-[13px] text-ak-text-primary">
              <strong>{stats.booked}</strong> bookede
            </span>
          </div>
          <div className="flex items-center gap-2 py-2 px-3.5 bg-ak-status-warning/10 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-ak-status-warning" />
            <span className="text-[13px] text-ak-text-primary">
              <strong>{stats.pending}</strong> ventende
            </span>
          </div>
          <div className="flex items-center gap-2 py-2 px-3.5 bg-ak-status-success/10 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-ak-status-success" />
            <span className="text-[13px] text-ak-text-primary">
              <strong>{stats.available}</strong> ledige
            </span>
          </div>
        </div>
      </div>

      {/* Calendar navigation */}
      <div className="bg-ak-surface-base py-4 px-6 flex items-center justify-between border-b border-ak-border-default">
        <div className="flex items-center gap-3">
          <button
            onClick={goToPreviousWeek}
            className="w-9 h-9 rounded-lg bg-ak-surface-subtle border-none flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft size={20} className="text-ak-text-primary" />
          </button>
          <button
            onClick={goToNextWeek}
            className="w-9 h-9 rounded-lg bg-ak-surface-subtle border-none flex items-center justify-center cursor-pointer"
          >
            <ChevronRight size={20} className="text-ak-text-primary" />
          </button>
          <SectionTitle className="m-0">
            {weekDates[0].toLocaleDateString('nb-NO', { day: 'numeric', month: 'long' })} -{' '}
            {weekDates[6].toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
          </SectionTitle>
        </div>

        <button
          onClick={goToToday}
          className="py-2 px-4 bg-ak-surface-base border border-ak-border-default rounded-lg text-[13px] font-medium text-ak-text-primary cursor-pointer"
        >
          I dag
        </button>
      </div>

      {/* Calendar grid */}
      <div className="p-6 overflow-x-auto">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-px bg-ak-border-default rounded-xl overflow-hidden min-w-[900px]">
          {/* Header row */}
          <div className="bg-ak-surface-subtle p-3" />
          {weekDates.map((date) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const daySchedule = schedule.find(
              (s) => s.date === date.toISOString().split('T')[0]
            );
            const bookedCount = daySchedule?.slots.filter((s) => s.status === 'booked').length || 0;

            return (
              <div
                key={date.toISOString()}
                className={`p-3 text-center ${isToday ? 'bg-ak-primary/5' : 'bg-ak-surface-subtle'}`}
              >
                <p className="text-[11px] text-ak-text-secondary m-0 uppercase">
                  {date.toLocaleDateString('nb-NO', { weekday: 'short' })}
                </p>
                <p className={`text-lg font-semibold mt-1 m-0 ${isToday ? 'text-ak-primary' : 'text-ak-text-primary'}`}>
                  {date.getDate()}
                </p>
                {bookedCount > 0 && (
                  <p className="text-[10px] text-ak-primary mt-1 m-0">
                    {bookedCount} booking{bookedCount > 1 ? 'er' : ''}
                  </p>
                )}
              </div>
            );
          })}

          {/* Time slots */}
          {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(
            (time) => (
              <React.Fragment key={time}>
                <div className={`bg-ak-surface-base p-2 text-xs text-ak-text-secondary text-right ${time === '12:00' ? 'border-t-2 border-ak-border-default' : ''}`}>
                  {time}
                </div>
                {weekDates.map((date) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const daySchedule = schedule.find((s) => s.date === dateStr);
                  const slot = daySchedule?.slots.find((s) => s.startTime === time);
                  const statusClasses = slot ? getStatusClasses(slot.status) : getStatusClasses('available');

                  return (
                    <div
                      key={`${dateStr}-${time}`}
                      onClick={() => slot && slot.booking && setSelectedSlot(slot)}
                      className={`p-2 min-h-[60px] ${statusClasses.bg} ${slot?.booking ? `border-l-[3px] ${statusClasses.border}` : ''} ${slot?.booking ? 'cursor-pointer' : 'cursor-default'} ${time === '12:00' ? 'border-t-2 border-t-ak-border-default' : ''}`}
                    >
                      {slot?.booking && (
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-6 h-6 rounded-full bg-ak-primary text-white flex items-center justify-center text-[10px] font-semibold">
                              {slot.booking.playerInitials}
                            </div>
                            <span className="text-xs font-medium text-ak-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                              {slot.booking.playerName}
                            </span>
                          </div>
                          <p className="text-[11px] text-ak-text-secondary m-0">
                            {slot.booking.sessionType}
                          </p>
                          {slot.status === 'pending' && (
                            <span className="inline-block mt-1 py-0.5 px-1.5 bg-ak-status-warning text-white rounded text-[9px] font-semibold">
                              VENTER
                            </span>
                          )}
                        </div>
                      )}
                      {slot?.status === 'blocked' && (
                        <p className="text-[11px] text-ak-text-secondary m-0 italic">
                          Blokkert
                        </p>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            )
          )}
        </div>
      </div>

      {/* Slot detail modal */}
      {selectedSlot && selectedSlot.booking && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={() => setSelectedSlot(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ak-surface-base rounded-xl p-6 w-[400px] max-w-[90vw] z-[101] shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <SubSectionTitle className="m-0">
                Booking-detaljer
              </SubSectionTitle>
              <button
                onClick={() => setSelectedSlot(null)}
                className="w-8 h-8 rounded bg-ak-surface-subtle border-none flex items-center justify-center cursor-pointer"
              >
                <X size={18} className="text-ak-text-secondary" />
              </button>
            </div>

            <div className="mb-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-ak-primary text-white flex items-center justify-center text-base font-semibold">
                  {selectedSlot.booking.playerInitials}
                </div>
                <div>
                  <p className="text-[17px] font-semibold text-ak-text-primary m-0">
                    {selectedSlot.booking.playerName}
                  </p>
                  <p className="text-xs text-ak-text-secondary mt-0.5 m-0">
                    {selectedSlot.booking.sessionType}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mb-3">
                <div className="flex-1 p-3 bg-ak-surface-subtle rounded-lg">
                  <p className="text-xs text-ak-text-secondary m-0">
                    Dato
                  </p>
                  <p className="text-[15px] text-ak-text-primary mt-1 m-0">
                    {new Date(selectedSlot.date).toLocaleDateString('nb-NO', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
                <div className="flex-1 p-3 bg-ak-surface-subtle rounded-lg">
                  <p className="text-xs text-ak-text-secondary m-0">
                    Tid
                  </p>
                  <p className="text-[15px] text-ak-text-primary mt-1 m-0">
                    {selectedSlot.startTime} - {selectedSlot.endTime}
                  </p>
                </div>
              </div>

              {selectedSlot.booking.notes && (
                <div className="p-3 bg-ak-primary/5 rounded-lg border-l-[3px] border-l-ak-primary">
                  <p className="text-xs text-ak-text-secondary m-0">
                    Notat fra spiller
                  </p>
                  <p className="text-[15px] text-ak-text-primary mt-1 m-0">
                    {selectedSlot.booking.notes}
                  </p>
                </div>
              )}
            </div>

            {selectedSlot.status === 'pending' ? (
              <div className="flex gap-3">
                <button
                  onClick={() => handleDecline(selectedSlot.id)}
                  className="flex-1 flex items-center justify-center gap-2 p-3 bg-ak-surface-base text-ak-status-error border border-ak-status-error rounded-lg text-sm font-semibold cursor-pointer"
                >
                  <X size={18} />
                  Avslå
                </button>
                <button
                  onClick={() => handleApprove(selectedSlot.id)}
                  className="flex-1 flex items-center justify-center gap-2 p-3 bg-ak-status-success text-white border-none rounded-lg text-sm font-semibold cursor-pointer"
                >
                  <Check size={18} />
                  Godkjenn
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate(`/coach/athletes/${selectedSlot.booking?.id}`)}
                className="w-full p-3 bg-ak-primary text-white border-none rounded-lg text-sm font-semibold cursor-pointer"
              >
                Se spillerprofil
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
