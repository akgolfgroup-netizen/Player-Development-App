import React, { useState, useMemo, useEffect } from 'react';
import {
  Clock,
  Search,
  Users,
  User,
  Calendar,
  Edit2,
  Trash2,
  Send,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import StateCard from '../../ui/composites/StateCard';
import { messagesAPI } from '../../services/api';

interface ScheduledMessage {
  id: string;
  subject: string;
  preview: string;
  recipients: {
    type: 'player' | 'group' | 'all';
    name: string;
    count?: number;
  };
  scheduledFor: string;
  category: 'training' | 'tournament' | 'general' | 'urgent';
  createdAt: string;
  hasAttachment: boolean;
}

const mockScheduledMessages: ScheduledMessage[] = [
  {
    id: '1',
    subject: 'Påminnelse: Turnering i helgen',
    preview: 'Husk å sjekke inn senest fredag kl 18:00. Ta med...',
    recipients: { type: 'group', name: 'Turneringsspillere', count: 15 },
    scheduledFor: '2025-01-24T08:00:00',
    category: 'tournament',
    createdAt: '2025-01-19T10:30:00',
    hasAttachment: true
  },
  {
    id: '2',
    subject: 'Ukentlig treningsoppdatering',
    preview: 'Denne ukens fokusområder og øvelser...',
    recipients: { type: 'all', name: 'Alle spillere', count: 28 },
    scheduledFor: '2025-01-27T07:00:00',
    category: 'training',
    createdAt: '2025-01-18T14:00:00',
    hasAttachment: false
  },
  {
    id: '3',
    subject: 'Bursdagshilsen',
    preview: 'Gratulerer med dagen! Håper du får en fantastisk dag...',
    recipients: { type: 'player', name: 'Emma Larsen' },
    scheduledFor: '2025-02-15T08:00:00',
    category: 'general',
    createdAt: '2025-01-15T09:00:00',
    hasAttachment: false
  },
  {
    id: '4',
    subject: 'Viktig: Endringer i treningsprogram',
    preview: 'Fra og med 1. februar blir det endringer i...',
    recipients: { type: 'group', name: 'WANG Toppidrett', count: 12 },
    scheduledFor: '2025-01-31T09:00:00',
    category: 'urgent',
    createdAt: '2025-01-19T16:45:00',
    hasAttachment: true
  }
];

export const CoachScheduledMessages: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<ScheduledMessage[]>(mockScheduledMessages);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch scheduled messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await messagesAPI.getScheduled();
        setMessages(response.data?.data || response.data || mockScheduledMessages);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Kunne ikke laste planlagte beskjeder');
        setMessages(mockScheduledMessages);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    if (!searchQuery) return messages;
    const query = searchQuery.toLowerCase();
    return messages.filter(m =>
      m.subject.toLowerCase().includes(query) ||
      m.preview.toLowerCase().includes(query) ||
      m.recipients.name.toLowerCase().includes(query)
    );
  }, [searchQuery, messages]);

  // Sort by scheduled date
  const sortedMessages = useMemo(() => {
    return [...filteredMessages].sort((a, b) =>
      new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
    );
  }, [filteredMessages]);

  const formatScheduledDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const time = date.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });

    if (diffDays === 0) {
      return `I dag kl ${time}`;
    } else if (diffDays === 1) {
      return `I morgen kl ${time}`;
    } else if (diffDays < 7) {
      return `${date.toLocaleDateString('nb-NO', { weekday: 'long' })} kl ${time}`;
    }
    return `${date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })} kl ${time}`;
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getRecipientIcon = (type: string) => {
    switch (type) {
      case 'group': return <Users size={14} />;
      case 'all': return <Users size={14} />;
      default: return <User size={14} />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      training: { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb', label: 'Trening' },
      tournament: { bg: 'rgba(168, 85, 247, 0.1)', text: '#7c3aed', label: 'Turnering' },
      general: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', label: 'Generelt' },
      urgent: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', label: 'Viktig' }
    };
    return styles[category] || styles.general;
  };

  const handleDelete = async (e: React.MouseEvent, messageId: string) => {
    e.stopPropagation();
    if (!confirm('Er du sikker på at du vil slette denne beskjeden?')) return;

    try {
      setActionLoading(messageId);
      await messagesAPI.delete(messageId);
      setMessages(prev => prev.filter(m => m.id !== messageId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kunne ikke slette beskjeden');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendNow = async (e: React.MouseEvent, messageId: string) => {
    e.stopPropagation();
    if (!confirm('Er du sikker på at du vil sende denne beskjeden nå?')) return;

    try {
      setActionLoading(messageId);
      await messagesAPI.sendNow(messageId);
      setMessages(prev => prev.filter(m => m.id !== messageId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kunne ikke sende beskjeden');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (e: React.MouseEvent, messageId: string) => {
    e.stopPropagation();
    navigate(`/coach/messages/compose?edit=${messageId}`);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={24} color="white" />
            </div>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Planlagte beskjeder
              </h1>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                margin: 0
              }}>
                {mockScheduledMessages.length} beskjeder i kø
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/coach/messages/compose')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: 'var(--accent)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          Ny planlagt beskjed
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)'
          }}
        />
        <input
          type="text"
          placeholder="Søk i planlagte beskjeder..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '12px 12px 12px 40px',
            borderRadius: '10px',
            border: `1px solid ${'var(--border-default)'}`,
            backgroundColor: 'var(--bg-primary)',
            fontSize: '14px',
            color: 'var(--text-primary)',
            outline: 'none'
          }}
        />
      </div>

      {/* Timeline View */}
      <div style={{ position: 'relative' }}>
        {sortedMessages.map((message, index) => {
          const categoryStyle = getCategoryBadge(message.category);
          const daysUntil = getDaysUntil(message.scheduledFor);

          return (
            <div key={message.id} style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
              {/* Timeline indicator */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '60px',
                flexShrink: 0
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: daysUntil <= 1
                    ? 'rgba(239, 68, 68, 0.1)'
                    : daysUntil <= 7
                      ? 'rgba(245, 158, 11, 0.1)'
                      : 'rgba(var(--accent-rgb), 0.15)',
                  border: daysUntil <= 1
                    ? '2px solid #dc2626'
                    : daysUntil <= 7
                      ? '2px solid #f59e0b'
                      : `2px solid ${'var(--accent)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock
                    size={18}
                    color={daysUntil <= 1 ? '#dc2626' : daysUntil <= 7 ? '#f59e0b' : 'var(--accent)'}
                  />
                </div>
                {index < sortedMessages.length - 1 && (
                  <div style={{
                    width: '2px',
                    flex: 1,
                    backgroundColor: 'var(--border-default)',
                    marginTop: '8px',
                    minHeight: '40px'
                  }} />
                )}
              </div>

              {/* Message Card */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  border: `1px solid ${'var(--border-default)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Scheduled time badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  backgroundColor: daysUntil <= 1
                    ? 'rgba(239, 68, 68, 0.1)'
                    : daysUntil <= 7
                      ? 'rgba(245, 158, 11, 0.1)'
                      : 'rgba(var(--accent-rgb), 0.1)',
                  borderRadius: '6px',
                  marginBottom: '12px'
                }}>
                  <Calendar
                    size={12}
                    color={daysUntil <= 1 ? '#dc2626' : daysUntil <= 7 ? '#f59e0b' : 'var(--accent)'}
                  />
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: daysUntil <= 1 ? '#dc2626' : daysUntil <= 7 ? '#f59e0b' : 'var(--accent)'
                  }}>
                    {formatScheduledDate(message.scheduledFor)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        margin: 0
                      }}>
                        {message.subject}
                      </h3>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '500',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: categoryStyle.bg,
                        color: categoryStyle.text
                      }}>
                        {categoryStyle.label}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      margin: '0 0 8px 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '500px'
                    }}>
                      {message.preview}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {getRecipientIcon(message.recipients.type)}
                        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                          {message.recipients.name}
                          {message.recipients.count && ` (${message.recipients.count})`}
                        </span>
                      </div>
                      {message.hasAttachment && (
                        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                          📎 Vedlegg
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                    <button
                      onClick={(e) => handleEdit(e, message.id)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: `1px solid ${'var(--border-default)'}`,
                        backgroundColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Rediger"
                    >
                      <Edit2 size={16} color={'var(--text-secondary)'} />
                    </button>
                    <button
                      onClick={(e) => handleSendNow(e, message.id)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Send nå"
                    >
                      <Send size={16} color="#059669" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, message.id)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Slett"
                    >
                      <Trash2 size={16} color="#dc2626" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedMessages.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '16px',
          border: `1px solid ${'var(--border-default)'}`
        }}>
          <Clock size={48} color={'var(--text-tertiary)'} style={{ marginBottom: '16px' }} />
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            margin: '0 0 16px 0'
          }}>
            {searchQuery ? 'Ingen planlagte beskjeder funnet' : 'Ingen planlagte beskjeder'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => navigate('/coach/messages/compose')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'var(--accent)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} />
              Planlegg første beskjed
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CoachScheduledMessages;
