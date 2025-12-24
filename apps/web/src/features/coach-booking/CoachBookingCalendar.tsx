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
import { tokens } from '../../design-tokens';

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
        return { bg: `${tokens.colors.primary}15`, border: tokens.colors.primary };
      case 'pending':
        return { bg: `${tokens.colors.warning}15`, border: tokens.colors.warning };
      case 'blocked':
        return { bg: tokens.colors.gray100, border: tokens.colors.gray300 };
      default:
        return { bg: tokens.colors.white, border: tokens.colors.gray200 };
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
                ...tokens.typography.title1,
                color: tokens.colors.charcoal,
                margin: 0,
              }}
            >
              Booking-kalender
            </h1>
            <p
              style={{
                ...tokens.typography.subheadline,
                color: tokens.colors.steel,
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
                backgroundColor: stats.pending > 0 ? `${tokens.colors.warning}15` : tokens.colors.white,
                color: stats.pending > 0 ? '#8B6914' : tokens.colors.charcoal,
                border: `1px solid ${stats.pending > 0 ? tokens.colors.warning : tokens.colors.gray300}`,
                borderRadius: tokens.radius.md,
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
                    backgroundColor: tokens.colors.warning,
                    color: tokens.colors.white,
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
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.white,
                border: 'none',
                borderRadius: tokens.radius.md,
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
              backgroundColor: `${tokens.colors.primary}10`,
              borderRadius: tokens.radius.md,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: tokens.colors.primary,
              }}
            />
            <span style={{ fontSize: '13px', color: tokens.colors.charcoal }}>
              <strong>{stats.booked}</strong> bookede
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: `${tokens.colors.warning}10`,
              borderRadius: tokens.radius.md,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: tokens.colors.warning,
              }}
            />
            <span style={{ fontSize: '13px', color: tokens.colors.charcoal }}>
              <strong>{stats.pending}</strong> ventende
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: `${tokens.colors.success}10`,
              borderRadius: tokens.radius.md,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: tokens.colors.success,
              }}
            />
            <span style={{ fontSize: '13px', color: tokens.colors.charcoal }}>
              <strong>{stats.available}</strong> ledige
            </span>
          </div>
        </div>
      </div>

      {/* Calendar navigation */}
      <div
        style={{
          backgroundColor: tokens.colors.white,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${tokens.colors.gray200}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={goToPreviousWeek}
            style={{
              width: 36,
              height: 36,
              borderRadius: tokens.radius.md,
              backgroundColor: tokens.colors.gray100,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={20} color={tokens.colors.charcoal} />
          </button>
          <button
            onClick={goToNextWeek}
            style={{
              width: 36,
              height: 36,
              borderRadius: tokens.radius.md,
              backgroundColor: tokens.colors.gray100,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronRight size={20} color={tokens.colors.charcoal} />
          </button>
          <h2
            style={{
              ...tokens.typography.headline,
              color: tokens.colors.charcoal,
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
            backgroundColor: tokens.colors.white,
            border: `1px solid ${tokens.colors.gray300}`,
            borderRadius: tokens.radius.md,
            fontSize: '13px',
            fontWeight: 500,
            color: tokens.colors.charcoal,
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
            backgroundColor: tokens.colors.gray200,
            borderRadius: tokens.radius.lg,
            overflow: 'hidden',
            minWidth: '900px',
          }}
        >
          {/* Header row */}
          <div
            style={{
              backgroundColor: tokens.colors.gray100,
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
                  backgroundColor: isToday ? `${tokens.colors.primary}08` : tokens.colors.gray100,
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    color: tokens.colors.steel,
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
                    color: isToday ? tokens.colors.primary : tokens.colors.charcoal,
                    margin: '4px 0 0',
                  }}
                >
                  {date.getDate()}
                </p>
                {bookedCount > 0 && (
                  <p
                    style={{
                      fontSize: '10px',
                      color: tokens.colors.primary,
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
                    backgroundColor: tokens.colors.white,
                    padding: '8px',
                    fontSize: '12px',
                    color: tokens.colors.steel,
                    textAlign: 'right',
                    borderTop: time === '12:00' ? `2px solid ${tokens.colors.gray300}` : undefined,
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
                        borderTop: time === '12:00' ? `2px solid ${tokens.colors.gray300}` : undefined,
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
                                backgroundColor: tokens.colors.primary,
                                color: tokens.colors.white,
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
                                color: tokens.colors.charcoal,
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
                              color: tokens.colors.steel,
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
                                backgroundColor: tokens.colors.warning,
                                color: tokens.colors.white,
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
                            color: tokens.colors.steel,
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
              backgroundColor: tokens.colors.white,
              borderRadius: tokens.radius.lg,
              padding: '24px',
              width: '400px',
              maxWidth: '90vw',
              zIndex: 101,
              boxShadow: tokens.shadows.dropdown,
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
                  ...tokens.typography.title3,
                  color: tokens.colors.charcoal,
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
                  borderRadius: tokens.radius.sm,
                  backgroundColor: tokens.colors.gray100,
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
                    backgroundColor: tokens.colors.primary,
                    color: tokens.colors.white,
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
                      ...tokens.typography.headline,
                      color: tokens.colors.charcoal,
                      margin: 0,
                    }}
                  >
                    {selectedSlot.booking.playerName}
                  </p>
                  <p
                    style={{
                      ...tokens.typography.caption1,
                      color: tokens.colors.steel,
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
                    backgroundColor: tokens.colors.gray100,
                    borderRadius: tokens.radius.md,
                  }}
                >
                  <p style={{ ...tokens.typography.caption1, color: tokens.colors.steel, margin: 0 }}>
                    Dato
                  </p>
                  <p style={{ ...tokens.typography.subheadline, color: tokens.colors.charcoal, margin: '4px 0 0' }}>
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
                    backgroundColor: tokens.colors.gray100,
                    borderRadius: tokens.radius.md,
                  }}
                >
                  <p style={{ ...tokens.typography.caption1, color: tokens.colors.steel, margin: 0 }}>
                    Tid
                  </p>
                  <p style={{ ...tokens.typography.subheadline, color: tokens.colors.charcoal, margin: '4px 0 0' }}>
                    {selectedSlot.startTime} - {selectedSlot.endTime}
                  </p>
                </div>
              </div>

              {selectedSlot.booking.notes && (
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: `${tokens.colors.primary}08`,
                    borderRadius: tokens.radius.md,
                    borderLeft: `3px solid ${tokens.colors.primary}`,
                  }}
                >
                  <p style={{ ...tokens.typography.caption1, color: tokens.colors.steel, margin: 0 }}>
                    Notat fra spiller
                  </p>
                  <p style={{ ...tokens.typography.subheadline, color: tokens.colors.charcoal, margin: '4px 0 0' }}>
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
                    backgroundColor: tokens.colors.white,
                    color: tokens.colors.error,
                    border: `1px solid ${tokens.colors.error}`,
                    borderRadius: tokens.radius.md,
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
                    backgroundColor: tokens.colors.success,
                    color: tokens.colors.white,
                    border: 'none',
                    borderRadius: tokens.radius.md,
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
                  backgroundColor: tokens.colors.primary,
                  color: tokens.colors.white,
                  border: 'none',
                  borderRadius: tokens.radius.md,
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
