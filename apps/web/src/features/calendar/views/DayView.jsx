import React from 'react';
import { MapPin, Play, Check } from 'lucide-react';
import { tokens } from '../../../design-tokens';

const hours = Array.from({ length: 18 }, (_, i) => i + 5); // 05:00 - 22:00

const DayView = ({ date, sessions = [], onSessionClick, onTimeSlotClick }) => {
  const formatHour = (hour) => `${hour.toString().padStart(2, '0')}:00`;

  const getSessionsForHour = (hour) => {
    return sessions.filter(session => {
      const sessionHour = parseInt(session.time?.split(':')[0] || 0);
      return sessionHour === hour;
    });
  };

  const getSessionColor = (type) => {
    const colors = {
      teknikk: 'var(--ak-session-teknikk)',
      golfslag: 'var(--ak-session-golfslag)',
      spill: 'var(--ak-session-spill)',
      konkurranse: 'var(--ak-achievement-gold)',
      fysisk: 'var(--ak-achievement-gold-light)',
      mental: 'var(--ak-text-muted)',
    };
    return colors[type] || tokens.colors.steel;
  };

  const dayNames = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
  const monthNames = ['januar', 'februar', 'mars', 'april', 'mai', 'juni',
                      'juli', 'august', 'september', 'oktober', 'november', 'desember'];

  return (
    <div className="bg-white rounded-xl border border-ak-mist overflow-hidden">
      {/* Day Header */}
      <div className="bg-ak-primary text-white p-4">
        <div className="text-sm opacity-75">{dayNames[date.getDay()]}</div>
        <div className="text-2xl font-bold">
          {date.getDate()}. {monthNames[date.getMonth()]}
        </div>
      </div>

      {/* Time Grid */}
      <div className="divide-y divide-ak-mist max-h-[600px] overflow-y-auto">
        {hours.map(hour => {
          const hourSessions = getSessionsForHour(hour);

          return (
            <div
              key={hour}
              className="flex min-h-[60px] hover:bg-ak-snow/50 cursor-pointer"
              onClick={() => !hourSessions.length && onTimeSlotClick?.(hour)}
            >
              {/* Time Label */}
              <div className="w-16 flex-shrink-0 p-2 text-right border-r border-ak-mist">
                <span className="text-xs text-ak-steel font-medium">
                  {formatHour(hour)}
                </span>
              </div>

              {/* Sessions */}
              <div className="flex-1 p-2 space-y-1">
                {hourSessions.map(session => (
                  <div
                    key={session.id}
                    className="rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                    style={{
                      backgroundColor: `${getSessionColor(session.type)}15`,
                      borderLeft: `4px solid ${getSessionColor(session.type)}`
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSessionClick?.(session);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-ak-steel">{session.time}</span>
                          {session.duration > 0 && (
                            <span className="text-xs text-ak-steel">• {session.duration} min</span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-ak-charcoal">{session.name}</h4>
                        {session.location && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-ak-steel">
                            <MapPin size={12} />
                            <span>{session.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {session.status === 'completed' ? (
                          <div className="w-6 h-6 rounded-full bg-ak-success flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        ) : session.status !== 'rest' && (
                          <button
                            className="w-8 h-8 rounded-full bg-ak-primary flex items-center justify-center hover:bg-ak-primary-light transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Start session
                            }}
                          >
                            <Play size={14} className="text-white ml-0.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayView;
