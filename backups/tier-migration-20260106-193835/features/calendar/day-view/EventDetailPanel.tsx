/**
 * Event Detail Panel Component
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 *
 * Desktop: Side panel (slides in from right)
 * Mobile: Bottom sheet (slides up)
 *
 * Actions available:
 * - Start
 * - Utsett / Flytt (Reschedule)
 * - Kort ned (Shorten: 45 → 30 → 15)
 * - Marker fullført (Complete)
 * - Se øktinnhold (View content - read only)
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Clock,
  ChevronDown,
  Check,
  MapPin,
  Calendar,
  Eye,
  Timer,
  Target,
} from 'lucide-react';
import { EventDetailPanelProps, RescheduleOption, ShortenOption, Workout } from './types';

// Hook to detect mobile viewport
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// Format duration
const formatDuration = (minutes: number): string => {
  if (minutes >= 60) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs} time ${mins} min` : `${hrs} time`;
  }
  return `${minutes} min`;
};

// Translate category
const translateCategory = (category: string): string => {
  const translations: Record<string, string> = {
    teknikk: 'Teknikk',
    golfslag: 'Golfslag',
    spill: 'Spill',
    konkurranse: 'Konkurranse',
    fysisk: 'Fysisk',
    mental: 'Mental',
  };
  return translations[category] || category;
};

export const EventDetailPanel: React.FC<EventDetailPanelProps> = ({
  event,
  isOpen,
  onClose,
  onStart,
  onReschedule,
  onShorten,
  onComplete,
  onOpenTimePicker,
  onViewContent,
}) => {
  const isMobile = useIsMobile();
  const [showReschedule, setShowReschedule] = useState(false);
  const [showShorten, setShowShorten] = useState(false);

  // Close dropdowns when panel closes
  useEffect(() => {
    if (!isOpen) {
      setShowReschedule(false);
      setShowShorten(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!event) return null;

  const isAKWorkout = event.type === 'ak_workout' && event.workout;
  const workout = event.workout;
  const external = event.external;

  const rescheduleOptions: { label: string; option: RescheduleOption }[] = [
    { label: 'Om 15 minutter', option: { type: 'delay', minutes: 15 } },
    { label: 'Om 30 minutter', option: { type: 'delay', minutes: 30 } },
    { label: 'Om 60 minutter', option: { type: 'delay', minutes: 60 } },
  ];

  const shortenOptions: ShortenOption[] = [45, 30, 15];

  const renderWorkoutContent = () => {
    if (!workout) return null;

    return (
      <>
        {/* Header with badge */}
        <div className="mb-4">
          {workout.status === 'in_progress' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-ak-status-success/10 text-ak-status-success">
              <Play size={12} />
              Pågår
            </span>
          )}
          {workout.status === 'completed' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-ak-status-success/10 text-ak-status-success">
              <Check size={12} />
              Fullført
            </span>
          )}
          {workout.isRecommended && workout.status === 'scheduled' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-ak-primary/10 text-ak-primary">
              Anbefalt
            </span>
          )}
        </div>

        {/* Info section */}
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wide mb-3 text-ak-text-tertiary">
            Detaljer
          </div>

          <div className="flex items-center gap-3 py-3 border-b border-ak-border-subtle">
            <Timer size={18} className="flex-shrink-0 text-ak-text-tertiary" />
            <div className="flex-1">
              <div className="text-xs text-ak-text-tertiary">Varighet</div>
              <div className="text-base font-medium text-ak-text-primary">
                {formatDuration(workout.duration)}
              </div>
            </div>
          </div>

          {workout.scheduledTime && (
            <div className="flex items-center gap-3 py-3 border-b border-ak-border-subtle">
              <Clock size={18} className="flex-shrink-0 text-ak-text-tertiary" />
              <div className="flex-1">
                <div className="text-xs text-ak-text-tertiary">Tidspunkt</div>
                <div className="text-base font-medium text-ak-text-primary">
                  {workout.scheduledTime}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 py-3 border-b border-ak-border-subtle">
            <Target size={18} className="flex-shrink-0 text-ak-text-tertiary" />
            <div className="flex-1">
              <div className="text-xs text-ak-text-tertiary">Kategori</div>
              <div className="text-base font-medium text-ak-text-primary">
                {translateCategory(workout.category)}
              </div>
            </div>
          </div>

          {workout.location && (
            <div className="flex items-center gap-3 py-3 border-b border-ak-border-subtle">
              <MapPin size={18} className="flex-shrink-0 text-ak-text-tertiary" />
              <div className="flex-1">
                <div className="text-xs text-ak-text-tertiary">Sted</div>
                <div className="text-base font-medium text-ak-text-primary">
                  {workout.location}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description if available */}
        {workout.description && (
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-wide mb-3 text-ak-text-tertiary">
              Beskrivelse
            </div>
            <p className="text-base leading-relaxed text-ak-text-secondary">
              {workout.description}
            </p>
          </div>
        )}
      </>
    );
  };

  const renderExternalContent = () => {
    if (!external) return null;

    return (
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wide mb-3 text-ak-text-tertiary">
          Detaljer
        </div>

        <div className="flex items-center gap-3 py-3 border-b border-ak-border-subtle">
          <Clock size={18} className="flex-shrink-0 text-ak-text-tertiary" />
          <div className="flex-1">
            <div className="text-xs text-ak-text-tertiary">Tid</div>
            <div className="text-base font-medium text-ak-text-primary">
              {external.startTime} - {external.endTime}
            </div>
          </div>
        </div>

        {external.source && (
          <div className="flex items-center gap-3 py-3 border-b border-ak-border-subtle">
            <Calendar size={18} className="flex-shrink-0 text-ak-text-tertiary" />
            <div className="flex-1">
              <div className="text-xs text-ak-text-tertiary">Kilde</div>
              <div className="text-base font-medium text-ak-text-primary">
                {external.source}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderActions = () => {
    if (!isAKWorkout || !workout) return null;

    // In progress: Show complete button
    if (workout.status === 'in_progress') {
      return (
        <div className="p-4 border-t border-ak-border-subtle flex-shrink-0 bg-ak-surface-subtle">
          <button
            onClick={onComplete}
            className="flex items-center justify-center gap-2 w-full p-4 rounded-lg text-base font-semibold transition-colors bg-ak-primary text-white hover:bg-ak-primary/90"
            aria-label={`Marker ${workout.name} som fullført`}
          >
            <Check size={18} aria-hidden="true" />
            Marker som fullført
          </button>
        </div>
      );
    }

    // Completed: Show view content only
    if (workout.status === 'completed') {
      return (
        <div className="p-4 border-t border-ak-border-subtle flex-shrink-0 bg-ak-surface-subtle">
          <button
            onClick={() => onViewContent?.(workout)}
            className="flex items-center justify-center gap-2 flex-1 min-w-[120px] p-3 rounded-lg text-sm font-medium transition-all border border-ak-border-default text-ak-text-secondary bg-ak-surface-card hover:border-ak-primary"
            aria-label="Se innhold i økten"
          >
            <Eye size={16} aria-hidden="true" />
            Se øktinnhold
          </button>
        </div>
      );
    }

    // Scheduled: Full action set
    return (
      <div className="p-4 border-t border-ak-border-subtle flex-shrink-0 bg-ak-surface-subtle">
        <button
          onClick={onStart}
          className="flex items-center justify-center gap-2 w-full p-4 mb-3 rounded-lg text-base font-semibold transition-colors bg-ak-primary text-white hover:bg-ak-primary/90"
          aria-label={`Start ${workout.name}`}
        >
          <Play size={18} aria-hidden="true" />
          Start økt
        </button>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowReschedule(!showReschedule)}
            className="flex items-center justify-center gap-2 flex-1 min-w-[120px] p-3 rounded-lg text-sm font-medium transition-all border border-ak-border-default text-ak-text-secondary bg-ak-surface-card hover:border-ak-primary"
            aria-expanded={showReschedule}
            aria-haspopup="menu"
            aria-label="Utsett trening"
          >
            <Clock size={16} aria-hidden="true" />
            Utsett
            <ChevronDown
              size={14}
              className={`transition-transform ${showReschedule ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>

          <button
            onClick={() => setShowShorten(!showShorten)}
            className="flex items-center justify-center gap-2 flex-1 min-w-[120px] p-3 rounded-lg text-sm font-medium transition-all border border-ak-border-default text-ak-text-secondary bg-ak-surface-card hover:border-ak-primary"
            aria-expanded={showShorten}
            aria-haspopup="menu"
            aria-label="Kort ned varighet"
          >
            <Timer size={16} aria-hidden="true" />
            Kort ned
            <ChevronDown
              size={14}
              className={`transition-transform ${showShorten ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Reschedule options */}
        {showReschedule && (
          <div
            className="mt-2 rounded-lg border border-ak-border-default overflow-hidden bg-ak-surface-card"
            role="menu"
            aria-label="Utsett trening"
          >
            {rescheduleOptions.map(({ label, option }) => (
              <button
                key={label}
                onClick={() => {
                  onReschedule(option);
                  setShowReschedule(false);
                }}
                className="block w-full px-4 py-3 text-left text-sm border-b border-ak-border-subtle transition-colors text-ak-text-primary hover:bg-ak-surface-subtle"
                role="menuitem"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => {
                setShowReschedule(false);
                onOpenTimePicker?.();
              }}
              className="block w-full px-4 py-3 text-left text-sm transition-colors text-ak-text-primary hover:bg-ak-surface-subtle"
              role="menuitem"
            >
              Velg tidspunkt...
            </button>
          </div>
        )}

        {/* Shorten options */}
        {showShorten && (
          <div className="flex gap-2 mt-2" role="radiogroup" aria-label="Velg varighet">
            {shortenOptions.map((duration) => (
              <button
                key={duration}
                onClick={() => {
                  onShorten(duration);
                  setShowShorten(false);
                }}
                className={`flex-1 p-3 rounded-lg text-sm font-medium text-center transition-all border ${
                  workout.duration === duration
                    ? 'bg-ak-primary/10 border-ak-primary text-ak-primary'
                    : 'bg-ak-surface-card border-ak-border-default text-ak-text-secondary hover:border-ak-primary'
                }`}
                role="radio"
                aria-checked={workout.duration === duration}
                aria-label={`${duration} minutter`}
              >
                {duration} min
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const panelTitle = isAKWorkout ? workout?.name : external?.title;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel - Desktop side panel or Mobile bottom sheet */}
      <div
        className={`fixed z-[101] flex flex-col transition-transform duration-300 ease-out bg-ak-surface-card ${
          isMobile
            ? `left-0 right-0 bottom-0 max-h-[85vh] rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] pb-safe ${
                isOpen ? 'translate-y-0' : 'translate-y-full'
              }`
            : `top-0 right-0 bottom-0 w-[400px] max-w-full shadow-lg ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
              }`
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-detail-title"
        aria-describedby="event-detail-content"
      >
        {/* Bottom sheet handle (mobile only) */}
        {isMobile && (
          <div className="w-9 h-1 rounded-full mx-auto mt-2 flex-shrink-0 bg-ak-border-default" aria-hidden="true" />
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-ak-border-subtle flex-shrink-0">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-full transition-colors text-ak-text-tertiary hover:bg-ak-surface-subtle"
            aria-label="Lukk panel"
          >
            <X size={20} aria-hidden="true" />
          </button>
          <div className="flex-1 ml-3 text-lg font-semibold text-ak-text-primary" id="event-detail-title">
            {panelTitle}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4" id="event-detail-content">
          {isAKWorkout ? renderWorkoutContent() : renderExternalContent()}
        </div>

        {/* Actions */}
        {renderActions()}
      </div>
    </>
  );
};

export default EventDetailPanel;
