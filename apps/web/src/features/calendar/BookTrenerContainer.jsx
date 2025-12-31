import React, { useState } from 'react';
import {
  Calendar, Clock, User, ChevronLeft, ChevronRight, Check,
  Video, MapPin, Star
} from 'lucide-react';
// UiCanon: Using CSS variables
import { PageHeader } from '../../components/layout/PageHeader';
import apiClient from '../../services/apiClient';
import Button from '../../ui/primitives/Button';
import { SubSectionTitle, CardTitle } from '../../components/typography';

// ============================================================================
// MOCK DATA
// ============================================================================

const COACHES = [
  {
    id: 'c1',
    name: 'Anders Kristiansen',
    role: 'Hovedtrener',
    specialties: ['Sving', 'Teknikk', 'Mental trening'],
    avatar: null,
    rating: 4.9,
    reviews: 45,
    nextAvailable: '2025-01-20',
  },
  {
    id: 'c2',
    name: 'Maria Hansen',
    role: 'Kortspill-spesialist',
    specialties: ['Kortspill', 'Bunker', 'Putting'],
    avatar: null,
    rating: 4.8,
    reviews: 32,
    nextAvailable: '2025-01-19',
  },
  {
    id: 'c3',
    name: 'Erik Olsen',
    role: 'Fysisk trener',
    specialties: ['Styrke', 'Mobilitet', 'Skadeforebygging'],
    avatar: null,
    rating: 4.7,
    reviews: 28,
    nextAvailable: '2025-01-21',
  },
];

const AVAILABLE_SLOTS = {
  '2025-01-20': [
    { time: '09:00', duration: 60, available: true },
    { time: '10:00', duration: 60, available: false },
    { time: '11:00', duration: 60, available: true },
    { time: '13:00', duration: 60, available: true },
    { time: '14:00', duration: 60, available: true },
    { time: '15:00', duration: 60, available: false },
  ],
  '2025-01-21': [
    { time: '09:00', duration: 60, available: true },
    { time: '10:00', duration: 60, available: true },
    { time: '11:00', duration: 60, available: false },
    { time: '13:00', duration: 60, available: true },
  ],
  '2025-01-22': [
    { time: '10:00', duration: 60, available: true },
    { time: '11:00', duration: 60, available: true },
    { time: '14:00', duration: 60, available: true },
    { time: '15:00', duration: 60, available: true },
  ],
};

const SESSION_TYPES = [
  { id: 'individual', label: 'Individuell okt', duration: 60, price: 800 },
  { id: 'video_analysis', label: 'Videoanalyse', duration: 45, price: 600 },
  { id: 'on_course', label: 'Pa banen', duration: 90, price: 1200 },
  { id: 'online', label: 'Online okt', duration: 45, price: 500 },
];

// ============================================================================
// COACH CARD
// ============================================================================

const CoachCard = ({ coach, selected, onSelect }) => (
  <div
    onClick={() => onSelect(coach)}
    className="hover:-translate-y-0.5 transition-transform"
    style={{
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '12px',
      padding: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: selected ? `2px solid ${'var(--accent)'}` : '2px solid transparent',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--bg-primary)',
        fontSize: '18px',
        fontWeight: 600,
      }}>
        {coach.name.split(' ').map((n) => n[0]).join('')}
      </div>
      <div style={{ flex: 1 }}>
        <CardTitle style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
        }}>
          {coach.name}
        </CardTitle>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          margin: '2px 0 0 0',
        }}>
          {coach.role}
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginTop: '4px',
        }}>
          <Star size={12} fill={'var(--achievement)'} color={'var(--achievement)'} />
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>
            {coach.rating}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            ({coach.reviews} anmeldelser)
          </span>
        </div>
      </div>
      {selected && (
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Check size={14} color={'var(--bg-primary)'} />
        </div>
      )}
    </div>
    <div style={{
      display: 'flex',
      gap: '6px',
      marginTop: '10px',
      flexWrap: 'wrap',
    }}>
      {coach.specialties.map((specialty, idx) => (
        <span
          key={idx}
          style={{
            fontSize: '10px',
            padding: '3px 8px',
            borderRadius: '4px',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
          }}
        >
          {specialty}
        </span>
      ))}
    </div>
  </div>
);

// ============================================================================
// DATE SELECTOR
// ============================================================================

const DateSelector = ({ selectedDate, onSelectDate }) => {
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + (weekOffset * 7));

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();

  return (
    <div style={{
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '14px',
      padding: '16px',
      marginBottom: '20px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
      }}>
        <button
          onClick={() => setWeekOffset(weekOffset - 1)}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'var(--bg-secondary)',
            cursor: 'pointer',
          }}
        >
          <ChevronLeft size={18} color={'var(--text-primary)'} />
        </button>
        <SubSectionTitle style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
        }}>
          {weekDates[0].toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' })}
        </SubSectionTitle>
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'var(--bg-secondary)',
            cursor: 'pointer',
          }}
        >
          <ChevronRight size={18} color={'var(--text-primary)'} />
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '6px',
      }}>
        {weekDates.map((date) => {
          const dateStr = date.toISOString().split('T')[0];
          const isSelected = dateStr === selectedDate;
          const hasSlots = AVAILABLE_SLOTS[dateStr]?.some((s) => s.available);
          const isToday = date.toDateString() === new Date().toDateString();
          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <button
              key={dateStr}
              onClick={() => !isPast && onSelectDate(dateStr)}
              disabled={isPast}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px 4px',
                borderRadius: '10px',
                border: isSelected ? `2px solid ${'var(--accent)'}` : '2px solid transparent',
                backgroundColor: isSelected ? 'rgba(var(--accent-rgb), 0.15)' :
                               isToday ? 'var(--bg-secondary)' : 'transparent',
                cursor: isPast ? 'not-allowed' : 'pointer',
                opacity: isPast ? 0.4 : 1,
              }}
            >
              <span style={{
                fontSize: '10px',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
              }}>
                {date.toLocaleDateString('nb-NO', { weekday: 'short' })}
              </span>
              <span style={{
                fontSize: '16px',
                fontWeight: 600,
                color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                margin: '4px 0',
              }}>
                {date.getDate()}
              </span>
              {hasSlots && !isPast && (
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success)',
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// TIME SLOTS
// ============================================================================

const TimeSlots = ({ date, selectedSlot, onSelectSlot }) => {
  const slots = AVAILABLE_SLOTS[date] || [];

  if (!date) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '14px',
        padding: '24px',
        textAlign: 'center',
      }}>
        <Calendar size={32} color={'var(--text-secondary)'} style={{ marginBottom: '8px' }} />
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          Velg en dato for a se tilgjengelige tider
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '14px',
      padding: '16px',
      marginBottom: '20px',
    }}>
      <SubSectionTitle style={{
        fontSize: '14px',
        fontWeight: 600,
        color: 'var(--text-primary)',
        marginBottom: '12px',
      }}>
        Tilgjengelige tider - {new Date(date).toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })}
      </SubSectionTitle>

      {slots.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
          gap: '8px',
        }}>
          {slots.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => slot.available && onSelectSlot(slot)}
              disabled={!slot.available}
              style={{
                padding: '12px 8px',
                borderRadius: '8px',
                border: selectedSlot?.time === slot.time
                  ? `2px solid ${'var(--accent)'}`
                  : '2px solid transparent',
                backgroundColor: !slot.available ? 'var(--border-default)' :
                               selectedSlot?.time === slot.time ? 'rgba(var(--accent-rgb), 0.15)' : 'var(--bg-secondary)',
                color: !slot.available ? 'var(--text-secondary)' : 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: slot.available ? 'pointer' : 'not-allowed',
                textDecoration: !slot.available ? 'line-through' : 'none',
              }}
            >
              {slot.time}
            </button>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          Ingen tilgjengelige tider denne dagen
        </p>
      )}
    </div>
  );
};

// ============================================================================
// SESSION TYPE SELECTOR
// ============================================================================

const SessionTypeSelector = ({ selected, onSelect }) => (
  <div style={{
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '20px',
  }}>
    <SubSectionTitle style={{
      fontSize: '14px',
      fontWeight: 600,
      color: 'var(--text-primary)',
      marginBottom: '12px',
    }}>
      Type okt
    </SubSectionTitle>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {SESSION_TYPES.map((type) => (
        <button
          key={type.id}
          onClick={() => onSelect(type)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: '10px',
            border: selected?.id === type.id
              ? `2px solid ${'var(--accent)'}`
              : '1px solid var(--border-default)',
            backgroundColor: selected?.id === type.id
              ? 'rgba(var(--accent-rgb), 0.1)'
              : 'var(--bg-primary)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {type.id === 'online' ? <Video size={18} color={'var(--accent)'} /> :
             type.id === 'on_course' ? <MapPin size={18} color={'var(--success)'} /> :
             <User size={18} color={'var(--text-primary)'} />}
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}>
                {type.label}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {type.duration} min
              </div>
            </div>
          </div>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--accent)',
          }}>
            {type.price} kr
          </div>
        </button>
      ))}
    </div>
  </div>
);

// ============================================================================
// BOOKING SUMMARY
// ============================================================================

const BookingSummary = ({ coach, date, slot, sessionType, onConfirm }) => {
  const canBook = coach && date && slot && sessionType;

  return (
    <div style={{
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '14px',
      padding: '16px',
      position: 'sticky',
      top: '20px',
    }}>
      <SubSectionTitle style={{
        fontSize: '15px',
        fontWeight: 600,
        color: 'var(--text-primary)',
        marginBottom: '16px',
      }}>
        Bookingoppsummering
      </SubSectionTitle>

      {coach && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px',
          padding: '10px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
        }}>
          <User size={16} color={'var(--text-secondary)'} />
          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
            {coach.name}
          </span>
        </div>
      )}

      {date && slot && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px',
          padding: '10px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
        }}>
          <Calendar size={16} color={'var(--text-secondary)'} />
          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
            {new Date(date).toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })} kl. {slot.time}
          </span>
        </div>
      )}

      {sessionType && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
          padding: '10px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
        }}>
          <Clock size={16} color={'var(--text-secondary)'} />
          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
            {sessionType.label} ({sessionType.duration} min)
          </span>
        </div>
      )}

      {sessionType && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0',
          borderTop: '1px solid var(--border-default)',
          marginBottom: '16px',
        }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total</span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {sessionType.price} kr
          </span>
        </div>
      )}

      <Button
        variant="primary"
        onClick={onConfirm}
        disabled={!canBook}
        style={{ width: '100%' }}
      >
        Bekreft booking
      </Button>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const BookTrenerContainer = () => {
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSessionType, setSelectedSessionType] = useState(null);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [bookingSuccess, setBookingSuccess] = useState(false);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [bookingError, setBookingError] = useState(null);

  const handleConfirm = async () => {
    if (!selectedCoach || !selectedDate || !selectedSlot || !selectedSessionType) {
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      // Create start and end times from selected date and slot
      const startTime = new Date(`${selectedDate}T${selectedSlot.time}:00`);
      const endTime = new Date(startTime.getTime() + selectedSessionType.duration * 60000);

      await apiClient.post('/bookings', {
        coachId: selectedCoach.id,
        sessionType: selectedSessionType.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      setBookingSuccess(true);
    } catch (err) {
      console.error('Booking failed:', err);
      setBookingError(err.message || 'Kunne ikke fullføre bestillingen');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <PageHeader
        title="Book trener"
        subtitle="Reserver en time med din trener"
      />

      <div style={{
        padding: '16px 24px 24px',
        maxWidth: '1536px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '24px',
      }}>
        <div>
          {/* Coach Selection */}
          <div style={{ marginBottom: '24px' }}>
            <SubSectionTitle style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '12px',
            }}>
              Velg trener
            </SubSectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {COACHES.map((coach) => (
                <CoachCard
                  key={coach.id}
                  coach={coach}
                  selected={selectedCoach?.id === coach.id}
                  onSelect={setSelectedCoach}
                />
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <DateSelector
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setSelectedSlot(null);
            }}
          />

          {/* Time Slots */}
          <TimeSlots
            date={selectedDate}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
          />

          {/* Session Type */}
          <SessionTypeSelector
            selected={selectedSessionType}
            onSelect={setSelectedSessionType}
          />
        </div>

        {/* Booking Summary */}
        <div>
          <BookingSummary
            coach={selectedCoach}
            date={selectedDate}
            slot={selectedSlot}
            sessionType={selectedSessionType}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default BookTrenerContainer;
