import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';

export default function DagensPlan({ events: propEvents }) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const hours = Array.from({ length: 14 }, (_, i) => i + 6);

  // Default demo events if none provided
  const defaultEvents = [
    { id: '1', title: 'Putting Drills', startTime: '08:00', endTime: '09:30', location: 'Indoor Range', type: 'training', sessionId: 'session-1' },
    { id: '2', title: 'Trenermeeting', startTime: '10:00', endTime: '10:30', location: 'Klubbhus', type: 'meeting' },
    { id: '3', title: 'Langspill - Driver', startTime: '13:00', endTime: '15:00', location: 'Driving Range', type: 'training', sessionId: 'session-2' },
    { id: '4', title: 'Shortgame Practice', startTime: '16:00', endTime: '17:30', location: 'Pitch & Putt', type: 'training', sessionId: 'session-3' },
  ];

  const events = propEvents || defaultEvents;

  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('nb-NO', options);
  };

  const goToPrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const goToNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  return (
    <Card variant="default" padding="none">
      <header style={{
        padding: '20px',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}>
            Dagens plan
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginTop: '4px',
          }}>
            {formatDate(selectedDate)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" size="sm" onClick={goToPrevDay}>
            <ChevronLeft size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={goToNextDay}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </header>

      {/* Fixed height container with overflow protection */}
      <div style={{
        position: 'relative',
        height: '520px',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
        }}>
          <div style={{
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: '64px 1fr',
            gap: '16px',
          }}>
            {/* Hour labels column */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}>
              {hours.map((h) => (
                <div
                  key={h}
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-tertiary)',
                    lineHeight: '1',
                  }}
                >
                  {String(h).padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {/* Events column - simple vertical list */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {events.map((e) => (
                <div
                  key={e.id}
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--accent)',
                    color: 'white',
                    padding: '12px 16px',
                    cursor: e.sessionId ? 'pointer' : 'default',
                    transition: 'opacity 0.2s',
                  }}
                  onClick={() => e.sessionId && navigate(`/session/${e.sessionId}`)}
                  onMouseEnter={(evt) => {
                    if (e.sessionId) {
                      evt.currentTarget.style.opacity = '0.9';
                    }
                  }}
                  onMouseLeave={(evt) => {
                    evt.currentTarget.style.opacity = '1';
                  }}
                >
                  <div style={{
                    fontWeight: 600,
                    fontSize: '14px',
                  }}>
                    {e.title}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginTop: '4px',
                  }}>
                    {e.startTime} - {e.endTime} • {e.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
