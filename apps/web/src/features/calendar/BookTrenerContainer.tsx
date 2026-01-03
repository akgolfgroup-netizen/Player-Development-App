/**
 * BookTrenerContainer
 *
 * Archetype: C - Dashboard/Calendar Page
 * Purpose: Book a session with a trainer
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useState } from 'react';
import {
  Calendar, Clock, User, ChevronLeft, ChevronRight, Check,
  Video, MapPin, Star
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import apiClient from '../../services/apiClient';
import Button from '../../ui/primitives/Button';
import { SubSectionTitle, CardTitle } from '../../components/typography';

// ============================================================================
// TYPES
// ============================================================================

interface Coach {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  avatar: string | null;
  rating: number;
  reviews: number;
  nextAvailable: string;
}

interface TimeSlot {
  time: string;
  duration: number;
  available: boolean;
}

interface SessionType {
  id: string;
  label: string;
  duration: number;
  price: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const COACHES: Coach[] = [
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

const AVAILABLE_SLOTS: Record<string, TimeSlot[]> = {
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

const SESSION_TYPES: SessionType[] = [
  { id: 'individual', label: 'Individuell økt', duration: 60, price: 800 },
  { id: 'video_analysis', label: 'Videoanalyse', duration: 45, price: 600 },
  { id: 'on_course', label: 'På banen', duration: 90, price: 1200 },
  { id: 'online', label: 'Online økt', duration: 45, price: 500 },
];

// ============================================================================
// COACH CARD
// ============================================================================

interface CoachCardProps {
  coach: Coach;
  selected: boolean;
  onSelect: (coach: Coach) => void;
}

const CoachCard: React.FC<CoachCardProps> = ({ coach, selected, onSelect }) => (
  <div
    onClick={() => onSelect(coach)}
    className={`
      bg-ak-surface-base rounded-xl p-3.5 cursor-pointer transition-all shadow-sm
      hover:-translate-y-0.5 border-2
      ${selected ? 'border-ak-brand-primary' : 'border-transparent'}
    `}
  >
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-ak-brand-primary flex items-center justify-center text-white text-lg font-semibold">
        {coach.name.split(' ').map((n) => n[0]).join('')}
      </div>
      <div className="flex-1">
        <CardTitle className="text-sm font-semibold text-ak-text-primary m-0">
          {coach.name}
        </CardTitle>
        <p className="text-xs text-ak-text-secondary mt-0.5 mb-0">
          {coach.role}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <Star size={12} className="fill-ak-status-warning text-ak-status-warning" />
          <span className="text-xs font-medium text-ak-text-primary">
            {coach.rating}
          </span>
          <span className="text-[11px] text-ak-text-secondary">
            ({coach.reviews} anmeldelser)
          </span>
        </div>
      </div>
      {selected && (
        <div className="w-6 h-6 rounded-full bg-ak-brand-primary flex items-center justify-center">
          <Check size={14} className="text-white" />
        </div>
      )}
    </div>
    <div className="flex gap-1.5 mt-2.5 flex-wrap">
      {coach.specialties.map((specialty, idx) => (
        <span
          key={idx}
          className="text-[10px] px-2 py-0.5 rounded bg-ak-surface-subtle text-ak-text-secondary"
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

interface DateSelectorProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onSelectDate }) => {
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
    <div className="bg-ak-surface-base rounded-[14px] p-4 mb-5">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setWeekOffset(weekOffset - 1)}
          className="p-2 rounded-lg border-none bg-ak-surface-subtle cursor-pointer"
        >
          <ChevronLeft size={18} className="text-ak-text-primary" />
        </button>
        <SubSectionTitle className="text-sm font-semibold text-ak-text-primary m-0">
          {weekDates[0].toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' })}
        </SubSectionTitle>
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="p-2 rounded-lg border-none bg-ak-surface-subtle cursor-pointer"
        >
          <ChevronRight size={18} className="text-ak-text-primary" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
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
              className={`
                flex flex-col items-center py-2.5 px-1 rounded-[10px] border-2 cursor-pointer
                ${isSelected ? 'border-ak-brand-primary bg-ak-brand-primary/15' : 'border-transparent'}
                ${!isSelected && isToday ? 'bg-ak-surface-subtle' : ''}
                ${isPast ? 'cursor-not-allowed opacity-40' : ''}
              `}
            >
              <span className="text-[10px] text-ak-text-secondary uppercase">
                {date.toLocaleDateString('nb-NO', { weekday: 'short' })}
              </span>
              <span className={`
                text-base font-semibold my-1
                ${isSelected ? 'text-ak-brand-primary' : 'text-ak-text-primary'}
              `}>
                {date.getDate()}
              </span>
              {hasSlots && !isPast && (
                <div className="w-1.5 h-1.5 rounded-full bg-ak-status-success" />
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

interface TimeSlotsProps {
  date: string | null;
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ date, selectedSlot, onSelectSlot }) => {
  const slots = date ? AVAILABLE_SLOTS[date] || [] : [];

  if (!date) {
    return (
      <div className="bg-ak-surface-base rounded-[14px] p-6 text-center">
        <Calendar size={32} className="text-ak-text-secondary mb-2 mx-auto" />
        <p className="text-sm text-ak-text-secondary m-0">
          Velg en dato for å se tilgjengelige tider
        </p>
      </div>
    );
  }

  return (
    <div className="bg-ak-surface-base rounded-[14px] p-4 mb-5">
      <SubSectionTitle className="text-sm font-semibold text-ak-text-primary mb-3">
        Tilgjengelige tider - {new Date(date).toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })}
      </SubSectionTitle>

      {slots.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
          {slots.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => slot.available && onSelectSlot(slot)}
              disabled={!slot.available}
              className={`
                py-3 px-2 rounded-lg border-2 text-sm font-medium
                ${!slot.available
                  ? 'bg-ak-border-default text-ak-text-secondary cursor-not-allowed line-through border-transparent'
                  : selectedSlot?.time === slot.time
                    ? 'border-ak-brand-primary bg-ak-brand-primary/15 text-ak-text-primary cursor-pointer'
                    : 'bg-ak-surface-subtle text-ak-text-primary cursor-pointer border-transparent'
                }
              `}
            >
              {slot.time}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ak-text-secondary m-0">
          Ingen tilgjengelige tider denne dagen
        </p>
      )}
    </div>
  );
};

// ============================================================================
// SESSION TYPE SELECTOR
// ============================================================================

interface SessionTypeSelectorProps {
  selected: SessionType | null;
  onSelect: (type: SessionType) => void;
}

const SessionTypeSelector: React.FC<SessionTypeSelectorProps> = ({ selected, onSelect }) => (
  <div className="bg-ak-surface-base rounded-[14px] p-4 mb-5">
    <SubSectionTitle className="text-sm font-semibold text-ak-text-primary mb-3">
      Type økt
    </SubSectionTitle>
    <div className="flex flex-col gap-2">
      {SESSION_TYPES.map((type) => (
        <button
          key={type.id}
          onClick={() => onSelect(type)}
          className={`
            flex items-center justify-between py-3 px-3.5 rounded-[10px] cursor-pointer
            ${selected?.id === type.id
              ? 'border-2 border-ak-brand-primary bg-ak-brand-primary/10'
              : 'border border-ak-border-default bg-ak-surface-base'
            }
          `}
        >
          <div className="flex items-center gap-2.5">
            {type.id === 'online' ? <Video size={18} className="text-ak-brand-primary" /> :
             type.id === 'on_course' ? <MapPin size={18} className="text-ak-status-success" /> :
             <User size={18} className="text-ak-text-primary" />}
            <div className="text-left">
              <div className="text-sm font-medium text-ak-text-primary">
                {type.label}
              </div>
              <div className="text-xs text-ak-text-secondary">
                {type.duration} min
              </div>
            </div>
          </div>
          <div className="text-sm font-semibold text-ak-brand-primary">
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

interface BookingSummaryProps {
  coach: Coach | null;
  date: string | null;
  slot: TimeSlot | null;
  sessionType: SessionType | null;
  onConfirm: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ coach, date, slot, sessionType, onConfirm }) => {
  const canBook = coach && date && slot && sessionType;

  return (
    <div className="bg-ak-surface-base rounded-[14px] p-4 sticky top-5">
      <SubSectionTitle className="text-[15px] font-semibold text-ak-text-primary mb-4">
        Bookingoppsummering
      </SubSectionTitle>

      {coach && (
        <div className="flex items-center gap-2.5 mb-3 p-2.5 bg-ak-surface-subtle rounded-lg">
          <User size={16} className="text-ak-text-secondary" />
          <span className="text-[13px] text-ak-text-primary">
            {coach.name}
          </span>
        </div>
      )}

      {date && slot && (
        <div className="flex items-center gap-2.5 mb-3 p-2.5 bg-ak-surface-subtle rounded-lg">
          <Calendar size={16} className="text-ak-text-secondary" />
          <span className="text-[13px] text-ak-text-primary">
            {new Date(date).toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })} kl. {slot.time}
          </span>
        </div>
      )}

      {sessionType && (
        <div className="flex items-center gap-2.5 mb-4 p-2.5 bg-ak-surface-subtle rounded-lg">
          <Clock size={16} className="text-ak-text-secondary" />
          <span className="text-[13px] text-ak-text-primary">
            {sessionType.label} ({sessionType.duration} min)
          </span>
        </div>
      )}

      {sessionType && (
        <div className="flex justify-between items-center py-3 border-t border-ak-border-default mb-4">
          <span className="text-sm text-ak-text-secondary">Total</span>
          <span className="text-lg font-bold text-ak-text-primary">
            {sessionType.price} kr
          </span>
        </div>
      )}

      <Button
        variant="primary"
        onClick={onConfirm}
        disabled={!canBook}
        className="w-full"
      >
        Bekreft booking
      </Button>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const BookTrenerContainer: React.FC = () => {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

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
      setBookingError((err as Error).message || 'Kunne ikke fullføre bestillingen');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Unused state for future implementation
  void isSubmitting;
  void bookingSuccess;
  void bookingError;

  return (
    <div className="min-h-screen bg-ak-surface-subtle">
      <PageHeader
        title="Book trener"
        subtitle="Reserver en time med din trener"
        actions={null}
      />

      <div className="py-4 px-6 max-w-7xl mx-auto grid grid-cols-[1fr_320px] gap-6">
        <div>
          {/* Coach Selection */}
          <div className="mb-6">
            <SubSectionTitle className="text-sm font-semibold text-ak-text-primary mb-3">
              Velg trener
            </SubSectionTitle>
            <div className="flex flex-col gap-2.5">
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
