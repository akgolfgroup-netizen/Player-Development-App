/**
 * TimePickerModal
 * Modal to select a specific time for scheduling/rescheduling workouts
 */

import React, { useState, useEffect } from 'react';
import { X, Clock, Check } from 'lucide-react';
import { SectionTitle } from '../../../components/typography';

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  initialTime?: string;
  title?: string;
}

// Semantic styles
const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--overlay-backdrop)',
    zIndex: 100,
    opacity: 0,
    pointerEvents: 'none' as const,
    transition: 'opacity 0.2s ease',
  },
  overlayOpen: {
    opacity: 1,
    pointerEvents: 'auto' as const,
  },
  modal: {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(0.95)',
    width: '90%',
    maxWidth: '360px',
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-float)',
    zIndex: 101,
    opacity: 0,
    transition: 'opacity 0.2s ease, transform 0.2s ease',
  },
  modalOpen: {
    opacity: 1,
    transform: 'translate(-50%, -50%) scale(1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  title: {
    fontSize: 'var(--font-size-headline)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  closeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-tertiary)',
    transition: 'background-color 0.15s ease',
  },
  content: {
    padding: 'var(--spacing-4)',
  },
  timeDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-4)',
    marginBottom: 'var(--spacing-4)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
  },
  timeValue: {
    fontSize: '48px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  timeSeparator: {
    fontSize: '48px',
    fontWeight: 700,
    color: 'var(--text-tertiary)',
  },
  pickerContainer: {
    display: 'flex',
    gap: 'var(--spacing-4)',
    marginBottom: 'var(--spacing-4)',
  },
  pickerColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  pickerLabel: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
    marginBottom: 'var(--spacing-2)',
    textAlign: 'center' as const,
  },
  pickerScroll: {
    height: '200px',
    overflow: 'auto',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)',
    backgroundColor: 'var(--background-white)',
  },
  pickerOption: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-3)',
    fontSize: 'var(--font-size-subheadline)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    border: 'none',
    backgroundColor: 'transparent',
    width: '100%',
  },
  pickerOptionSelected: {
    backgroundColor: 'var(--accent)',
    color: 'var(--text-inverse)',
  },
  quickOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-4)',
  },
  quickOption: {
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-surface)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    textAlign: 'center' as const,
    transition: 'all 0.15s ease',
  },
  footer: {
    display: 'flex',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-4)',
    borderTop: '1px solid var(--border-subtle)',
  },
  cancelButton: {
    flex: 1,
    padding: 'var(--spacing-3)',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-subheadline)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  confirmButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--accent)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-subheadline)',
    fontWeight: 600,
    color: 'var(--text-inverse)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
};

// Generate hours (6-22)
const hours = Array.from({ length: 17 }, (_, i) => i + 6);
// Generate minutes (0, 15, 30, 45)
const minutes = [0, 15, 30, 45];

// Quick time options
const quickOptions = [
  { label: '08:00', time: '08:00' },
  { label: '10:00', time: '10:00' },
  { label: '12:00', time: '12:00' },
  { label: '14:00', time: '14:00' },
  { label: '16:00', time: '16:00' },
  { label: '18:00', time: '18:00' },
];

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialTime,
  title = 'Velg tidspunkt',
}) => {
  const [selectedHour, setSelectedHour] = useState(10);
  const [selectedMinute, setSelectedMinute] = useState(0);

  // Initialize from initialTime
  useEffect(() => {
    if (isOpen && initialTime) {
      const [h, m] = initialTime.split(':').map(Number);
      setSelectedHour(h);
      setSelectedMinute(m);
    } else if (isOpen) {
      // Default to current hour rounded to nearest 15 min
      const now = new Date();
      setSelectedHour(Math.max(6, Math.min(22, now.getHours())));
      setSelectedMinute(Math.floor(now.getMinutes() / 15) * 15);
    }
  }, [isOpen, initialTime]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    const time = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onSelect(time);
    onClose();
  };

  const handleQuickSelect = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    setSelectedHour(h);
    setSelectedMinute(m);
  };

  if (!isOpen) return null;

  const displayTime = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;

  return (
    <>
      {/* Overlay */}
      <div
        style={{ ...styles.overlay, ...(isOpen ? styles.overlayOpen : {}) }}
        onClick={onClose}
      />

      {/* Modal */}
      <div style={{ ...styles.modal, ...(isOpen ? styles.modalOpen : {}) }}>
        {/* Header */}
        <div style={styles.header}>
          <SectionTitle style={styles.title}>{title}</SectionTitle>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-surface)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Time Display */}
          <div style={styles.timeDisplay}>
            <Clock size={24} style={{ color: 'var(--text-tertiary)' }} />
            <span style={styles.timeValue}>{displayTime}</span>
          </div>

          {/* Quick Options */}
          <div style={styles.quickOptions}>
            {quickOptions.map((option) => (
              <button
                key={option.time}
                style={{
                  ...styles.quickOption,
                  ...(displayTime === option.time
                    ? { backgroundColor: 'var(--accent-muted)', borderColor: 'var(--accent)', color: 'var(--accent)' }
                    : {}),
                }}
                onClick={() => handleQuickSelect(option.time)}
                onMouseEnter={(e) => {
                  if (displayTime !== option.time) {
                    e.currentTarget.style.borderColor = 'var(--border-brand)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (displayTime !== option.time) {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Picker Columns */}
          <div style={styles.pickerContainer}>
            {/* Hour Picker */}
            <div style={styles.pickerColumn}>
              <div style={styles.pickerLabel}>Time</div>
              <div style={styles.pickerScroll}>
                {hours.map((hour) => (
                  <button
                    key={hour}
                    style={{
                      ...styles.pickerOption,
                      ...(selectedHour === hour ? styles.pickerOptionSelected : {}),
                    }}
                    onClick={() => setSelectedHour(hour)}
                  >
                    {hour.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Minute Picker */}
            <div style={styles.pickerColumn}>
              <div style={styles.pickerLabel}>Minutt</div>
              <div style={styles.pickerScroll}>
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    style={{
                      ...styles.pickerOption,
                      ...(selectedMinute === minute ? styles.pickerOptionSelected : {}),
                    }}
                    onClick={() => setSelectedMinute(minute)}
                  >
                    {minute.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button
            style={styles.cancelButton}
            onClick={onClose}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-brand)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
          >
            Avbryt
          </button>
          <button
            style={styles.confirmButton}
            onClick={handleConfirm}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
          >
            <Check size={18} />
            Bekreft
          </button>
        </div>
      </div>
    </>
  );
};

export default TimePickerModal;
