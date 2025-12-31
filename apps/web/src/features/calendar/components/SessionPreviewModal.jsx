import React from 'react';
import { X, Clock, MapPin, Play, Check, Edit2, Trash2, User } from 'lucide-react';
import { tokens } from '../../../design-tokens';
import { getSessionIcon } from '../../../components/icons';
import { SubSectionTitle } from '../../../components/typography';

const SessionPreviewModal = ({
  session,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStart
}) => {
  if (!isOpen || !session) return null;

  const getSessionColor = (type) => {
    const colors = {
      teknikk: 'var(--ak-session-teknikk)',
      golfslag: 'var(--ak-session-golfslag)',
      spill: 'var(--ak-session-spill)',
      konkurranse: 'var(--achievement)',
      fysisk: 'var(--achievement)',
      mental: 'var(--text-muted)',
    };
    return colors[type] || tokens.colors.steel;
  };

  const getSessionTypeIcon = (type) => {
    return getSessionIcon(type, { size: 28, color: getSessionColor(type) });
  };

  const getLevelLabel = (level) => {
    const labels = {
      L1: 'Lett',
      L2: 'Moderat',
      L3: 'Middels',
      L4: 'Krevende',
      L5: 'Maksimal',
    };
    return labels[level] || level;
  };

  const sessionColor = getSessionColor(session.type);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with color strip */}
        <div
          className="h-2"
          style={{ backgroundColor: sessionColor }}
        />

        <div className="p-5">
          {/* Close button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="p-1 hover:bg-ak-snow rounded-lg transition-colors"
            >
              <X size={20} className="text-ak-steel" />
            </button>
          </div>

          {/* Session Icon & Title */}
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${sessionColor}15` }}
            >
              {getSessionTypeIcon(session.type)}
            </div>
            <div className="flex-1">
              <SubSectionTitle className="text-lg font-semibold text-ak-charcoal">
                {session.name}
              </SubSectionTitle>
              <p className="text-sm text-ak-steel capitalize">
                {session.type}
              </p>
            </div>
          </div>

          {/* Session Details */}
          <div className="space-y-3 mb-5">
            {/* Time & Duration */}
            <div className="flex items-center gap-3 p-3 bg-ak-snow rounded-xl">
              <Clock size={18} className="text-ak-primary" />
              <div>
                <p className="text-sm font-medium text-ak-charcoal">
                  {session.time}
                </p>
                {session.duration > 0 && (
                  <p className="text-xs text-ak-steel">
                    Varighet: {session.duration} minutter
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            {session.location && (
              <div className="flex items-center gap-3 p-3 bg-ak-snow rounded-xl">
                <MapPin size={18} className="text-ak-primary" />
                <div>
                  <p className="text-sm font-medium text-ak-charcoal">
                    {session.location}
                  </p>
                </div>
              </div>
            )}

            {/* Level */}
            <div className="flex items-center justify-between p-3 bg-ak-snow rounded-xl">
              <span className="text-sm text-ak-charcoal">Nivå</span>
              <span
                className="px-2 py-1 rounded-lg text-xs font-medium"
                style={{
                  backgroundColor: `${sessionColor}20`,
                  color: sessionColor
                }}
              >
                {session.level} - {getLevelLabel(session.level)}
              </span>
            </div>

            {/* Assigned by coach */}
            {session.assignedByCoach && (
              <div className="flex items-center gap-2 p-3 bg-ak-primary/5 rounded-xl">
                <User size={16} className="text-ak-primary" />
                <span className="text-sm text-ak-primary">
                  Tildelt av trener
                </span>
              </div>
            )}

            {/* Reps/Sets if available */}
            {session.reps && (
              <div className="p-3 bg-ak-snow rounded-xl">
                <p className="text-xs text-ak-steel mb-1">Repetisjoner</p>
                <p className="text-sm font-medium text-ak-charcoal">
                  {session.reps}
                </p>
              </div>
            )}

            {/* Notes if available */}
            {session.notes && (
              <div className="p-3 bg-ak-snow rounded-xl">
                <p className="text-xs text-ak-steel mb-1">Notater</p>
                <p className="text-sm text-ak-charcoal">
                  {session.notes}
                </p>
              </div>
            )}
          </div>

          {/* Status Badge */}
          {session.status && (
            <div className="mb-4">
              {session.status === 'completed' ? (
                <div className="flex items-center gap-2 p-3 bg-ak-success/10 rounded-xl">
                  <Check size={18} className="text-ak-success" />
                  <span className="text-sm font-medium text-ak-success">
                    Fullført
                  </span>
                </div>
              ) : session.status === 'rest' ? (
                <div className="flex items-center gap-2 p-3 bg-ak-snow rounded-xl">
                  {getSessionIcon('rest', { size: 18, color: tokens.colors.steel })}
                  <span className="text-sm text-ak-steel">
                    Hviledag
                  </span>
                </div>
              ) : null}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {session.status === 'upcoming' && (
              <button
                onClick={() => onStart?.(session)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-ak-primary text-white rounded-xl font-medium hover:bg-ak-primary-light transition-colors"
              >
                <Play size={18} />
                Start økt
              </button>
            )}

            <button
              onClick={() => onEdit?.(session)}
              className="p-3 bg-ak-snow text-ak-charcoal rounded-xl hover:bg-ak-mist transition-colors"
              title="Rediger"
            >
              <Edit2 size={18} />
            </button>

            <button
              onClick={() => onDelete?.(session)}
              className="p-3 bg-ak-error/10 text-ak-error rounded-xl hover:bg-ak-error/20 transition-colors"
              title="Slett"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPreviewModal;
