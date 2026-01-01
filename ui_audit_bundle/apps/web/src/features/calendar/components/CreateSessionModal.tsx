/**
 * CreateSessionModal Component
 *
 * MVP modal for creating a new session:
 * - Title
 * - Date
 * - Start time
 * - Duration
 * - Category
 *
 * Uses semantic tokens only (no raw hex values).
 */

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SectionTitle } from '../../../components/typography';

interface CreateSessionModalProps {
  isOpen: boolean;
  initialDate?: Date;
  initialTime?: string;
  onClose: () => void;
  onSubmit: (session: NewSession) => void;
}

export interface NewSession {
  title: string;
  date: string;
  start: string;
  duration: number;
  category: string;
}

const CATEGORIES = [
  { value: 'putting', label: 'Putting' },
  { value: 'range', label: 'Range' },
  { value: 'mental', label: 'Mental' },
  { value: 'testing', label: 'Testing' },
  { value: 'training', label: 'Generell trening' },
  { value: 'mobility', label: 'Mobilitet' },
  { value: 'threshold', label: 'Terskel' },
];

const DURATION_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 time' },
  { value: 90, label: '1,5 time' },
  { value: 120, label: '2 timer' },
];

function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  isOpen,
  initialDate,
  initialTime,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState(30);
  const [category, setCategory] = useState('training');

  // Initialize with initial values
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDate(initialDate ? formatDateForInput(initialDate) : formatDateForInput(new Date()));
      setStartTime(initialTime || '09:00');
      setDuration(30);
      setCategory('training');
    }
  }, [isOpen, initialDate, initialTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      date,
      start: startTime,
      duration,
      category,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'var(--overlay-backdrop)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-xl overflow-hidden"
          style={{
            backgroundColor: 'var(--calendar-surface-card)',
            boxShadow: 'var(--shadow-float)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: 'var(--calendar-border)' }}
          >
            <SectionTitle
              className="text-lg font-semibold"
              style={{ color: 'var(--calendar-text-primary)' }}
            >
              Ny økt
            </SectionTitle>
            <button
              onClick={onClose}
              className="p-1 rounded-lg transition-colors"
              style={{ color: 'var(--calendar-text-tertiary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--calendar-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Title */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--calendar-text-secondary)' }}
              >
                Tittel *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="F.eks. Putting – 100 putts"
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: 'var(--calendar-surface-elevated)',
                  border: '1px solid var(--calendar-border)',
                  color: 'var(--calendar-text-primary)',
                }}
                required
                autoFocus
              />
            </div>

            {/* Date */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--calendar-text-secondary)' }}
              >
                Dato
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: 'var(--calendar-surface-elevated)',
                  border: '1px solid var(--calendar-border)',
                  color: 'var(--calendar-text-primary)',
                }}
                required
              />
            </div>

            {/* Start time and duration in row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Start time */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: 'var(--calendar-text-secondary)' }}
                >
                  Starttid
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: 'var(--calendar-surface-elevated)',
                    border: '1px solid var(--calendar-border)',
                    color: 'var(--calendar-text-primary)',
                  }}
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: 'var(--calendar-text-secondary)' }}
                >
                  Varighet
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: 'var(--calendar-surface-elevated)',
                    border: '1px solid var(--calendar-border)',
                    color: 'var(--calendar-text-primary)',
                  }}
                >
                  {DURATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--calendar-text-secondary)' }}
              >
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: 'var(--calendar-surface-elevated)',
                  border: '1px solid var(--calendar-border)',
                  color: 'var(--calendar-text-primary)',
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                style={{
                  backgroundColor: 'var(--calendar-surface-elevated)',
                  color: 'var(--calendar-text-secondary)',
                }}
              >
                Avbryt
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                style={{
                  backgroundColor: 'var(--ak-primary)',
                  color: 'var(--text-inverse)',
                }}
              >
                Opprett økt
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateSessionModal;
