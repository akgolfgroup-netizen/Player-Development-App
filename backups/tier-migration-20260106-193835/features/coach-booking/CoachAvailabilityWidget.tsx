/**
 * AK Golf Academy - Coach Availability Widget
 * Design System v3.0 - Premium Light
 *
 * Compact widget showing coach's current week availability.
 * Uses coachesAPI.getAvailability() backend endpoint.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Settings,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { coachesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../ui/primitives/Button';

// Types for availability
interface AvailabilitySlot {
  id: string;
  coachId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  maxBookings: number;
  sessionType?: string;
  validFrom: string;
  validUntil?: string;
  isActive: boolean;
}

// Day names in Norwegian
const DAY_NAMES = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
const FULL_DAY_NAMES = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];

interface CoachAvailabilityWidgetProps {
  coachId?: string;
  compact?: boolean;
  onSettingsClick?: () => void;
}

export const CoachAvailabilityWidget: React.FC<CoachAvailabilityWidgetProps> = ({
  coachId: propCoachId,
  compact = false,
  onSettingsClick,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Use provided coachId or fall back to logged-in coach
  const coachId = propCoachId || user?.coachId || user?.id;

  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!coachId) {
        setLoading(false);
        return;
      }

      try {
        setError(null);

        // Get current week's date range
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

        const startDate = startOfWeek.toISOString().split('T')[0];
        const endDate = endOfWeek.toISOString().split('T')[0];

        const response = await coachesAPI.getAvailability(coachId, startDate, endDate);

        if (response?.data?.data) {
          setAvailability(response.data.data as AvailabilitySlot[]);
        }
      } catch (err) {
        console.error('Failed to fetch availability:', err);
        setError('Kunne ikke laste tilgjengelighet');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [coachId]);

  // Group availability by day
  const availabilityByDay = useMemo(() => {
    const byDay: Record<number, AvailabilitySlot[]> = {};

    availability.forEach((slot) => {
      if (!byDay[slot.dayOfWeek]) {
        byDay[slot.dayOfWeek] = [];
      }
      byDay[slot.dayOfWeek].push(slot);
    });

    // Sort slots by start time within each day
    Object.keys(byDay).forEach((day) => {
      byDay[Number(day)].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return byDay;
  }, [availability]);

  // Get today's day of week (0-6)
  const today = new Date().getDay();

  // Calculate total available hours this week
  const totalHours = useMemo(() => {
    let minutes = 0;
    availability.forEach((slot) => {
      const [startH, startM] = slot.startTime.split(':').map(Number);
      const [endH, endM] = slot.endTime.split(':').map(Number);
      minutes += (endH * 60 + endM) - (startH * 60 + startM);
    });
    return Math.round(minutes / 60);
  }, [availability]);

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      navigate('/coach/booking/settings');
    }
  };

  if (loading) {
    return (
      <div className="bg-ak-surface-base rounded-2xl p-5 border border-ak-border-default">
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-ak-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-ak-surface-base rounded-2xl p-5 border border-ak-border-default">
        <div className="flex items-center gap-2 text-ak-status-warning">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (compact) {
    // Compact version for dashboard
    return (
      <div className="bg-ak-surface-base rounded-2xl p-4 border border-ak-border-default">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-ak-primary" />
            <span className="text-sm font-semibold text-ak-text-primary">
              Tilgjengelighet
            </span>
          </div>
          <button
            onClick={handleSettingsClick}
            className="p-1.5 hover:bg-ak-surface-subtle rounded-lg transition-colors"
          >
            <Settings size={16} className="text-ak-text-tertiary" />
          </button>
        </div>

        {availability.length === 0 ? (
          <p className="text-sm text-ak-text-secondary text-center py-4">
            Ingen tilgjengelighet satt opp
          </p>
        ) : (
          <>
            {/* Summary stats */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-ak-text-tertiary" />
                <span className="text-sm text-ak-text-secondary">
                  {totalHours}t denne uken
                </span>
              </div>
              <div className="text-sm text-ak-text-secondary">
                {Object.keys(availabilityByDay).length} dager
              </div>
            </div>

            {/* Mini week view */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                const slots = availabilityByDay[day] || [];
                const isToday = day === today;
                const hasSlots = slots.length > 0;

                return (
                  <div
                    key={day}
                    className={`flex-1 text-center py-2 rounded-lg text-xs font-medium ${
                      hasSlots
                        ? isToday
                          ? 'bg-ak-primary text-white'
                          : 'bg-ak-status-success/10 text-ak-status-success'
                        : 'bg-ak-surface-subtle text-ak-text-tertiary'
                    }`}
                  >
                    {DAY_NAMES[day]}
                  </div>
                );
              })}
            </div>
          </>
        )}

        <button
          onClick={() => navigate('/coach/booking')}
          className="flex items-center justify-center gap-1 w-full mt-3 py-2 text-sm text-ak-primary hover:bg-ak-primary/5 rounded-lg transition-colors"
        >
          Se kalender
          <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  // Full version
  return (
    <div className="bg-ak-surface-base rounded-2xl p-5 border border-ak-border-default">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-ak-primary" />
          <h3 className="text-base font-semibold text-ak-text-primary">
            Ukens tilgjengelighet
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSettingsClick}>
          <Settings size={16} />
          Innstillinger
        </Button>
      </div>

      {availability.length === 0 ? (
        <div className="text-center py-8 bg-ak-surface-subtle rounded-xl border border-dashed border-ak-border-default">
          <Calendar size={32} className="mx-auto text-ak-text-tertiary mb-2" />
          <p className="text-sm text-ak-text-secondary mb-3">
            Ingen tilgjengelighet satt opp
          </p>
          <Button variant="primary" size="sm" onClick={handleSettingsClick}>
            Sett opp tilgjengelighet
          </Button>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-ak-surface-subtle rounded-xl p-3 text-center">
              <span className="text-2xl font-bold text-ak-primary">
                {totalHours}
              </span>
              <p className="text-xs text-ak-text-secondary">Timer tilgjengelig</p>
            </div>
            <div className="bg-ak-surface-subtle rounded-xl p-3 text-center">
              <span className="text-2xl font-bold text-ak-primary">
                {Object.keys(availabilityByDay).length}
              </span>
              <p className="text-xs text-ak-text-secondary">Dager med timer</p>
            </div>
          </div>

          {/* Week schedule */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 0].map((day) => {
              const slots = availabilityByDay[day] || [];
              const isToday = day === today;

              return (
                <div
                  key={day}
                  className={`flex items-center gap-3 py-2 px-3 rounded-xl ${
                    isToday ? 'bg-ak-primary/5 border border-ak-primary/20' : ''
                  }`}
                >
                  <div className="w-16">
                    <span
                      className={`text-sm font-medium ${
                        isToday ? 'text-ak-primary' : 'text-ak-text-primary'
                      }`}
                    >
                      {FULL_DAY_NAMES[day]}
                    </span>
                  </div>
                  <div className="flex-1">
                    {slots.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {slots.map((slot) => (
                          <span
                            key={slot.id}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-ak-status-success/10 text-ak-status-success text-xs font-medium rounded"
                          >
                            <Clock size={12} />
                            {slot.startTime}-{slot.endTime}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-ak-text-tertiary">
                        Ikke tilgjengelig
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CoachAvailabilityWidget;
