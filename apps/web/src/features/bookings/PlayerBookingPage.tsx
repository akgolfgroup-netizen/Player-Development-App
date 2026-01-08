/**
 * Player Booking Page - TIER Golf Academy
 * Design System v3.0 - Premium Light
 *
 * Allows players to:
 * - View coach availability
 * - Request booking for available slots
 * - View and manage their bookings
 */

import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import Button from '../../ui/primitives/Button';
import { SectionTitle } from '../../components/typography';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import {
  useCoachAvailability,
  useMyBookings,
  usePlayerCoaches,
  useCreateBooking,
  useCancelBooking
} from '../../hooks/useBookings';
import AvailabilityCalendar from './components/AvailabilityCalendar';
import BookingRequestModal from './components/BookingRequestModal';
import BookingsList from './components/BookingsList';

const PlayerBookingPage: React.FC = () => {
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return {
      startDate: today.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0],
    };
  });
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'availability' | 'my-bookings'>('availability');

  // Fetch data
  const { coaches, loading: coachesLoading, error: coachesError } = usePlayerCoaches();
  const { availability, loading: availabilityLoading, error: availabilityError, refetch: refetchAvailability } =
    useCoachAvailability(selectedCoach || '', dateRange);
  const { bookings, loading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useMyBookings('');
  const { createBooking, loading: creatingBooking } = useCreateBooking();
  const { cancelBooking, loading: cancellingBooking } = useCancelBooking();

  // Select first coach by default
  React.useEffect(() => {
    if (coaches.length > 0 && !selectedCoach) {
      setSelectedCoach(coaches[0].id);
    }
  }, [coaches, selectedCoach]);

  // Handle slot selection
  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  // Handle booking creation
  const handleCreateBooking = async (bookingData: any) => {
    try {
      await createBooking({
        ...bookingData,
        coachId: selectedCoach,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        date: selectedSlot.date,
      });
      setShowBookingModal(false);
      setSelectedSlot(null);
      refetchAvailability();
      refetchBookings();
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string, reason?: string) => {
    if (!window.confirm('Er du sikker på at du vil avbestille denne timen?')) {
      return;
    }

    try {
      await cancelBooking(bookingId, reason);
      refetchBookings();
      refetchAvailability();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  // Loading state
  if (coachesLoading) {
    return <LoadingSpinner message="Laster trenere..." />;
  }

  // Error state
  if (coachesError) {
    return (
      <ErrorState
        message={coachesError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // No coaches found
  if (coaches.length === 0) {
    return (
      <div className="min-h-screen bg-tier-surface-base">
        <PageHeader
          title="Bestill time"
          subtitle="Book treningstimer med din trener"
          helpText="Bestill og administrer treningstimer med din trener. Se ledig kapasitet, velg tidspunkt og send bookingforespørsel. Administrer dine eksisterende bookinger, kanseller eller endre timer. Få oversikt over kommende og tidligere timer."
          actions={null}
        />
        <div className="p-6">
          <div className="bg-white rounded-xl border border-tier-border-default p-8 text-center">
            <User size={48} className="text-tier-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-tier-navy mb-2">
              Ingen trenere funnet
            </h3>
            <p className="text-tier-text-secondary mb-4">
              Du må være tilknyttet en trener for å kunne bestille timer.
            </p>
            <Button variant="primary" onClick={() => window.location.href = '/mer/trenerteam'}>
              Gå til Trenerteam
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const selectedCoachData = coaches.find((c: any) => c.id === selectedCoach);

  return (
    <div className="min-h-screen bg-tier-surface-base">
      <PageHeader
        title="Bestill time"
        subtitle="Book treningstimer med din trener"
        helpText="Bestill og administrer treningstimer med din trener. Se ledig kapasitet, velg tidspunkt og send bookingforespørsel. Administrer dine eksisterende bookinger, kanseller eller endre timer. Få oversikt over kommende og tidligere timer."
        actions={null}
      />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-tier-border-default">
          <button
            onClick={() => setActiveTab('availability')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'availability'
                ? 'text-tier-navy border-b-2 border-tier-navy'
                : 'text-tier-text-secondary hover:text-tier-navy'
            }`}
          >
            <Calendar size={18} className="inline mr-2" />
            Tilgjengelige timer
          </button>
          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'my-bookings'
                ? 'text-tier-navy border-b-2 border-tier-navy'
                : 'text-tier-text-secondary hover:text-tier-navy'
            }`}
          >
            <CheckCircle2 size={18} className="inline mr-2" />
            Mine bestillinger
            {bookings.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-tier-warning text-white text-xs rounded-full">
                {bookings.filter((b: any) => b.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <>
            {/* Coach Selector */}
            <div className="bg-white rounded-xl border border-tier-border-default p-4 mb-6">
              <label className="block text-sm font-medium text-tier-navy mb-2">
                Velg trener
              </label>
              <select
                value={selectedCoach || ''}
                onChange={(e) => setSelectedCoach(e.target.value)}
                className="w-full px-4 py-2 border border-tier-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-tier-navy"
              >
                {coaches.map((coach: any) => (
                  <option key={coach.id} value={coach.id}>
                    {coach.firstName} {coach.lastName}
                  </option>
                ))}
              </select>
              {selectedCoachData && (
                <p className="mt-2 text-sm text-tier-text-secondary">
                  {selectedCoachData.email}
                </p>
              )}
            </div>

            {/* Availability Calendar */}
            {availabilityLoading ? (
              <div className="bg-white rounded-xl border border-tier-border-default p-8">
                <LoadingSpinner message="Laster tilgjengelighet..." />
              </div>
            ) : availabilityError ? (
              <div className="bg-white rounded-xl border border-tier-border-default p-8">
                <ErrorState message={availabilityError} onRetry={refetchAvailability} />
              </div>
            ) : (
              <AvailabilityCalendar
                availability={availability}
                onSlotSelect={handleSlotSelect}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            )}
          </>
        )}

        {/* My Bookings Tab */}
        {activeTab === 'my-bookings' && (
          <>
            {bookingsLoading ? (
              <div className="bg-white rounded-xl border border-tier-border-default p-8">
                <LoadingSpinner message="Laster bestillinger..." />
              </div>
            ) : bookingsError ? (
              <div className="bg-white rounded-xl border border-tier-border-default p-8">
                <ErrorState message={bookingsError} onRetry={refetchBookings} />
              </div>
            ) : (
              <BookingsList
                bookings={bookings}
                onCancel={handleCancelBooking}
                loading={cancellingBooking}
              />
            )}
          </>
        )}
      </div>

      {/* Booking Request Modal */}
      {showBookingModal && selectedSlot && (
        <BookingRequestModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedSlot(null);
          }}
          slot={selectedSlot}
          coach={selectedCoachData}
          onSubmit={handleCreateBooking}
          loading={creatingBooking}
        />
      )}
    </div>
  );
};

export default PlayerBookingPage;
