/**
 * Booking Request Modal
 * Form for requesting a booking
 */

import React, { useState } from 'react';
import { X, Calendar, Clock, User, MessageSquare } from 'lucide-react';
import Button from '../../../ui/primitives/Button';
import { SectionTitle } from '../../../components/typography';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  slot: {
    date: string;
    startTime: string;
    endTime: string;
  };
  coach: {
    firstName: string;
    lastName: string;
  };
  onSubmit: (data: { reason: string; notes?: string }) => Promise<void>;
  loading: boolean;
}

const BookingRequestModal: React.FC<Props> = ({
  isOpen,
  onClose,
  slot,
  coach,
  onSubmit,
  loading,
}) => {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError('Vennligst oppgi årsak for bestillingen');
      return;
    }

    try {
      await onSubmit({ reason, notes });
      setReason('');
      setNotes('');
      setError('');
    } catch (err) {
      setError('Kunne ikke opprette bestilling. Prøv igjen.');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('nb-NO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-[500px] w-full max-h-[90vh] overflow-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 px-6 border-b border-tier-border-default">
          <SectionTitle className="text-lg font-semibold text-tier-navy m-0">
            Bestill treningstime
          </SectionTitle>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer p-1 text-tier-text-secondary hover:text-tier-navy"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Booking Details */}
          <div className="bg-tier-surface-base rounded-lg p-4 mb-6 space-y-3">
            <div className="flex items-center gap-2 text-tier-navy">
              <User size={18} />
              <span className="font-medium">
                {coach.firstName} {coach.lastName}
              </span>
            </div>

            <div className="flex items-center gap-2 text-tier-text-secondary">
              <Calendar size={18} />
              <span>{formatDate(slot.date)}</span>
            </div>

            <div className="flex items-center gap-2 text-tier-text-secondary">
              <Clock size={18} />
              <span>
                {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
              </span>
            </div>
          </div>

          {/* Reason */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-tier-navy mb-1.5">
              Årsak / Tema for timen <span className="text-tier-error">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-tier-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-tier-navy"
              disabled={loading}
              required
            >
              <option value="">Velg årsak...</option>
              <option value="Svingteknikk">Svingteknikk</option>
              <option value="Putting">Putting</option>
              <option value="Kortspill">Kortspill</option>
              <option value="Strategi">Strategi</option>
              <option value="Mental trening">Mental trening</option>
              <option value="Fysisk trening">Fysisk trening</option>
              <option value="Testgjennomføring">Testgjennomføring</option>
              <option value="Generell veiledning">Generell veiledning</option>
              <option value="Annet">Annet</option>
            </select>
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-tier-navy mb-1.5">
              Tilleggsinfo (valgfritt)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Legg til tilleggsinformasjon om hva du ønsker å jobbe med..."
              className="w-full px-4 py-2 border border-tier-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-tier-navy resize-none"
              rows={4}
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-tier-error-light text-tier-error rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !reason.trim()}
              loading={loading}
              className="flex-1"
            >
              {loading ? 'Sender forespørsel...' : 'Send forespørsel'}
            </Button>
          </div>

          {/* Info Text */}
          <p className="mt-4 text-xs text-tier-text-secondary text-center">
            Treneren vil motta forespørselen din og bekrefte eller avslå den.
          </p>
        </form>
      </div>
    </div>
  );
};

export default BookingRequestModal;
