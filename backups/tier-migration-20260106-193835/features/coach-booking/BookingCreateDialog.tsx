/**
 * Booking Create Dialog
 * Dialog for creating a new booking when clicking on available time slot
 */

import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import Button from '../../ui/primitives/Button';
import { SubSectionTitle } from '../../components/typography';

interface BookingCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BookingFormData) => void;
  date: string;
  startTime: string;
  endTime: string;
}

export interface BookingFormData {
  playerId: string;
  playerName: string;
  sessionType: string;
  duration: number;
  notes: string;
}

// Mock athletes data
const MOCK_ATHLETES = [
  { id: '1', name: 'Anders Hansen' },
  { id: '2', name: 'Sofie Andersen' },
  { id: '3', name: 'Erik Johansen' },
  { id: '4', name: 'Lars Olsen' },
  { id: '5', name: 'Emma Berg' },
];

const SESSION_TYPES = [
  'Individuell økt',
  'Videoanalyse',
  'På banen',
  'Putting',
  'Kortspill',
  'Langt spill',
];

export default function BookingCreateDialog({
  isOpen,
  onClose,
  onSave,
  date,
  startTime,
  endTime,
}: BookingCreateDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<{ id: string; name: string } | null>(null);
  const [sessionType, setSessionType] = useState('Individuell økt');
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const filteredAthletes = MOCK_ATHLETES.filter((athlete) =>
    athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;

    onSave({
      playerId: selectedPlayer.id,
      playerName: selectedPlayer.name,
      sessionType,
      duration,
      notes,
    });

    // Reset form
    setSelectedPlayer(null);
    setSearchTerm('');
    setSessionType('Individuell økt');
    setDuration(60);
    setNotes('');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[100]"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ak-surface-base rounded-2xl p-6 w-[500px] max-w-[90vw] z-[101] shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <SubSectionTitle className="m-0">Ny booking</SubSectionTitle>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-ak-surface-subtle border-none flex items-center justify-center cursor-pointer hover:bg-ak-border-default transition-colors"
            >
              <X size={18} className="text-ak-text-secondary" />
            </button>
          </div>

          {/* Date and time display */}
          <div className="mb-5 p-4 bg-ak-primary/5 rounded-xl border border-ak-primary/20">
            <p className="text-sm text-ak-text-secondary m-0 mb-2">Valgt tidspunkt</p>
            <p className="text-lg font-semibold text-ak-text-primary m-0">
              {new Date(date).toLocaleDateString('nb-NO', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
            <p className="text-sm text-ak-text-secondary mt-1 m-0">
              {startTime} - {endTime}
            </p>
          </div>

          {/* Player selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-ak-text-primary mb-2">
              Velg spiller *
            </label>

            {selectedPlayer ? (
              <div className="flex items-center justify-between p-3 bg-ak-primary/10 rounded-xl border border-ak-primary/30">
                <span className="text-sm font-medium text-ak-text-primary">
                  {selectedPlayer.name}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPlayer(null)}
                  className="text-xs text-ak-primary hover:underline bg-transparent border-none cursor-pointer"
                >
                  Endre
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-ak-surface-card rounded-lg border border-ak-border-default mb-2">
                  <Search size={18} className="text-ak-text-secondary" />
                  <input
                    type="text"
                    placeholder="Søk etter spiller..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-ak-text-primary placeholder:text-ak-text-tertiary"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto border border-ak-border-default rounded-lg">
                  {filteredAthletes.map((athlete) => (
                    <button
                      key={athlete.id}
                      type="button"
                      onClick={() => setSelectedPlayer(athlete)}
                      className="w-full text-left px-3 py-2 text-sm text-ak-text-primary hover:bg-ak-surface-subtle cursor-pointer border-none bg-transparent transition-colors"
                    >
                      {athlete.name}
                    </button>
                  ))}
                  {filteredAthletes.length === 0 && (
                    <p className="px-3 py-4 text-sm text-ak-text-secondary text-center m-0">
                      Ingen spillere funnet
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Session type */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-ak-text-primary mb-2">
              Type økt *
            </label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="w-full px-3 py-2 bg-ak-surface-card border border-ak-border-default rounded-lg text-sm text-ak-text-primary outline-none focus:border-ak-primary transition-colors"
              required
            >
              {SESSION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-ak-text-primary mb-2">
              Varighet (minutter) *
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-ak-surface-card border border-ak-border-default rounded-lg text-sm text-ak-text-primary outline-none focus:border-ak-primary transition-colors"
              required
            >
              <option value={30}>30 minutter</option>
              <option value={60}>1 time</option>
              <option value={90}>1,5 timer</option>
              <option value={120}>2 timer</option>
            </select>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-ak-text-primary mb-2">
              Notater (valgfritt)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Legg til notater om økten..."
              rows={3}
              className="w-full px-3 py-2 bg-ak-surface-card border border-ak-border-default rounded-lg text-sm text-ak-text-primary placeholder:text-ak-text-tertiary outline-none focus:border-ak-primary transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!selectedPlayer}
              className="flex-1"
            >
              Lagre booking
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
