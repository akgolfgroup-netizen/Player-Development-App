/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AK Golf Academy - Coach Booking Calendar
 * Design System v3.0 - Blue Palette 01
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

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return { bg: 'rgba(var(--accent-rgb), 0.15)', border: 'var(--accent)' };
      case 'pending':
        return { bg: 'rgba(var(--warning-rgb), 0.15)', border: 'var(--warning)' };
      case 'blocked':
        return { bg: 'var(--bg-tertiary)', border: 'var(--border-default)' };
      default:
        return { bg: 'var(--bg-primary)', border: 'var(--border-default)' };
    }
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
      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderBottom: `1px solid ${'var(--border-default)'}`,
          padding: '20px 24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '28px', lineHeight: '34px', fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Booking-kalender
            </h1>
            <p
              style={{
                fontSize: '15px', lineHeight: '20px',
                color: 'var(--text-secondary)',
                margin: '4px 0 0',
              }}
            >
              Administrer dine bookinger og tilgjengelighet
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/coach/booking/requests')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: stats.pending > 0 ? 'rgba(var(--warning-rgb), 0.15)' : 'var(--bg-primary)',
                color: stats.pending > 0 ? 'var(--status-pending)' : 'var(--text-primary)',
                border: `1px solid ${stats.pending > 0 ? 'var(--warning)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <Clock size={18} />
              Forespørsler
              {stats.pending > 0 && (
                <span
                  style={{
                    padding: '2px 8px',
                    backgroundColor: 'var(--warning)',
                    color: 'var(--bg-primary)',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {stats.pending}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/coach/booking/settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Settings size={18} />
              Tilgjengelighet
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: 'rgba(var(--accent-rgb), 0.10)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
              }}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              <strong>{stats.booked}</strong> bookede
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: 'rgba(var(--warning-rgb), 0.10)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--warning)',
              }}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              <strong>{stats.pending}</strong> ventende
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: 'rgba(var(--success-rgb), 0.10)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--success)',
              }}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              <strong>{stats.available}</strong> ledige
            </span>
          </div>
        </div>
      </div>

      {/* Calendar navigation */}
      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${'var(--border-default)'}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={goToPreviousWeek}
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-tertiary)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={20} color={'var(--text-primary)'} />
          </button>
          <button
            onClick={goToNextWeek}
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-tertiary)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronRight size={20} color={'var(--text-primary)'} />
          </button>
          <h2
            style={{
              fontSize: '17px', lineHeight: '22px', fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {weekDates[0].toLocaleDateString('nb-NO', { day: 'numeric', month: 'long' })} -{' '}
            {weekDates[6].toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
          </h2>
        </div>

        <button
          onClick={goToToday}
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--bg-primary)',
            border: `1px solid ${'var(--border-default)'}`,
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
        >
          I dag
        </button>
      </div>

      {/* Calendar grid */}
      <div style={{ padding: '24px', overflowX: 'auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '60px repeat(7, 1fr)',
            gap: '1px',
            backgroundColor: 'var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            minWidth: '900px',
          }}
        >
          {/* Header row */}
          <div
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              padding: '12px',
            }}
          />
          {weekDates.map((date) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const daySchedule = schedule.find(
              (s) => s.date === date.toISOString().split('T')[0]
            );
            const bookedCount = daySchedule?.slots.filter((s) => s.status === 'booked').length || 0;

            return (
              <div
                key={date.toISOString()}
                style={{
                  backgroundColor: isToday ? `${'var(--accent)'}08` : 'var(--bg-tertiary)',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    margin: 0,
                    textTransform: 'uppercase',
                  }}
                >
                  {date.toLocaleDateString('nb-NO', { weekday: 'short' })}
                </p>
                <p
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: isToday ? 'var(--accent)' : 'var(--text-primary)',
                    margin: '4px 0 0',
                  }}
                >
                  {date.getDate()}
                </p>
                {bookedCount > 0 && (
                  <p
                    style={{
                      fontSize: '10px',
                      color: 'var(--accent)',
                      margin: '4px 0 0',
                    }}
                  >
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
                <div
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    padding: '8px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    textAlign: 'right',
                    borderTop: time === '12:00' ? `2px solid ${'var(--border-default)'}` : undefined,
                  }}
                >
                  {time}
                </div>
                {weekDates.map((date) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const daySchedule = schedule.find((s) => s.date === dateStr);
                  const slot = daySchedule?.slots.find((s) => s.startTime === time);
                  const statusColor = slot ? getStatusColor(slot.status) : getStatusColor('available');

                  return (
                    <div
                      key={`${dateStr}-${time}`}
                      onClick={() => slot && slot.booking && setSelectedSlot(slot)}
                      style={{
                        backgroundColor: statusColor.bg,
                        borderLeft: slot?.booking ? `3px solid ${statusColor.border}` : undefined,
                        padding: '8px',
                        minHeight: '60px',
                        cursor: slot?.booking ? 'pointer' : 'default',
                        borderTop: time === '12:00' ? `2px solid ${'var(--border-default)'}` : undefined,
                      }}
                    >
                      {slot?.booking && (
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginBottom: '4px',
                            }}
                          >
                            <div
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                backgroundColor: 'var(--accent)',
                                color: 'var(--bg-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: 600,
                              }}
                            >
                              {slot.booking.playerInitials}
                            </div>
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: 500,
                                color: 'var(--text-primary)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {slot.booking.playerName}
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: '11px',
                              color: 'var(--text-secondary)',
                              margin: 0,
                            }}
                          >
                            {slot.booking.sessionType}
                          </p>
                          {slot.status === 'pending' && (
                            <span
                              style={{
                                display: 'inline-block',
                                marginTop: '4px',
                                padding: '2px 6px',
                                backgroundColor: 'var(--warning)',
                                color: 'var(--bg-primary)',
                                borderRadius: '4px',
                                fontSize: '9px',
                                fontWeight: 600,
                              }}
                            >
                              VENTER
                            </span>
                          )}
                        </div>
                      )}
                      {slot?.status === 'blocked' && (
                        <p
                          style={{
                            fontSize: '11px',
                            color: 'var(--text-secondary)',
                            margin: 0,
                            fontStyle: 'italic',
                          }}
                        >
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
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 100,
            }}
            onClick={() => setSelectedSlot(null)}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              width: '400px',
              maxWidth: '90vw',
              zIndex: 101,
              boxShadow: 'var(--shadow-dropdown)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                Booking-detaljer
              </h3>
              <button
                onClick={() => setSelectedSlot(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-tertiary)',
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

            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}
                >
                  {selectedSlot.booking.playerInitials}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    {selectedSlot.booking.playerName}
                  </p>
                  <p
                    style={{
                      fontSize: '12px', lineHeight: '16px',
                      color: 'var(--text-secondary)',
                      margin: '2px 0 0',
                    }}
                  >
                    {selectedSlot.booking.sessionType}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <p style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', margin: 0 }}>
                    Dato
                  </p>
                  <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)', margin: '4px 0 0' }}>
                    {new Date(selectedSlot.date).toLocaleDateString('nb-NO', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <p style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', margin: 0 }}>
                    Tid
                  </p>
                  <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)', margin: '4px 0 0' }}>
                    {selectedSlot.startTime} - {selectedSlot.endTime}
                  </p>
                </div>
              </div>

              {selectedSlot.booking.notes && (
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: `${'var(--accent)'}08`,
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `3px solid ${'var(--accent)'}`,
                  }}
                >
                  <p style={{ fontSize: '12px', lineHeight: '16px', color: 'var(--text-secondary)', margin: 0 }}>
                    Notat fra spiller
                  </p>
                  <p style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)', margin: '4px 0 0' }}>
                    {selectedSlot.booking.notes}
                  </p>
                </div>
              )}
            </div>

            {selectedSlot.status === 'pending' ? (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleDecline(selectedSlot.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--error)',
                    border: `1px solid ${'var(--error)'}`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} />
                  Avslå
                </button>
                <button
                  onClick={() => handleApprove(selectedSlot.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: 'var(--success)',
                    color: 'var(--bg-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Check size={18} />
                  Godkjenn
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate(`/coach/athletes/${selectedSlot.booking?.id}`)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
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
