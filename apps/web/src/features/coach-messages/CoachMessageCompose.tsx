import React, { useState, useMemo } from 'react';
import {
  Send,
  Users,
  User,
  X,
  Paperclip,
  FileText,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { messagesAPI } from '../../services/api';
import { sanitizeText, sanitizeSearchQuery } from '../../utils/sanitize';
import Button from '../../ui/primitives/Button';
import Card from '../../ui/primitives/Card';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';

interface Recipient {
  id: string;
  name: string;
  type: 'player' | 'group';
  avatar?: string;
  memberCount?: number;
  category?: string;
}

const mockPlayers: Recipient[] = [
  { id: 'p1', name: 'Emma Larsen', type: 'player', category: 'A' },
  { id: 'p2', name: 'Thomas Berg', type: 'player', category: 'B' },
  { id: 'p3', name: 'Sofie Andersen', type: 'player', category: 'A' },
  { id: 'p4', name: 'Jonas Pedersen', type: 'player', category: 'B' },
  { id: 'p5', name: 'Erik Hansen', type: 'player', category: 'A' },
  { id: 'p6', name: 'Mia Kristiansen', type: 'player', category: 'C' },
  { id: 'p7', name: 'Lars Johansen', type: 'player', category: 'A' },
  { id: 'p8', name: 'Ida Eriksen', type: 'player', category: 'B' },
];

const mockGroups: Recipient[] = [
  { id: 'g1', name: 'WANG Toppidrett', type: 'group', memberCount: 12 },
  { id: 'g2', name: 'Team Junior', type: 'group', memberCount: 8 },
  { id: 'g3', name: 'Turneringsspillere', type: 'group', memberCount: 15 },
  { id: 'g4', name: 'Nybegynnere 2025', type: 'group', memberCount: 6 },
];

export const CoachMessageCompose: React.FC = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [showRecipientPicker, setShowRecipientPicker] = useState(false);
  const [sendToAll, setSendToAll] = useState(false);
  const [category, setCategory] = useState<'training' | 'tournament' | 'general' | 'urgent'>('general');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [attachments, setAttachments] = useState<{ name: string; type: string }[]>([]);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const allRecipients = useMemo(() => {
    return [...mockGroups, ...mockPlayers];
  }, []);

  const filteredRecipients = useMemo(() => {
    if (!recipientSearch) return allRecipients;
    const query = sanitizeSearchQuery(recipientSearch.toLowerCase());
    return allRecipients.filter(r => r.name.toLowerCase().includes(query));
  }, [recipientSearch, allRecipients]);

  const addRecipient = (recipient: Recipient) => {
    if (!selectedRecipients.find(r => r.id === recipient.id)) {
      setSelectedRecipients([...selectedRecipients, recipient]);
    }
    setRecipientSearch('');
    setShowRecipientPicker(false);
  };

  const removeRecipient = (recipientId: string) => {
    setSelectedRecipients(selectedRecipients.filter(r => r.id !== recipientId));
  };

  const handleSend = async () => {
    setSending(true);
    setSendError(null);

    // Sanitize user input before sending
    const messageData = {
      recipients: sendToAll ? ['all'] : selectedRecipients.map(r => r.id),
      subject: sanitizeText(subject),
      message: sanitizeText(message),
      category,
      ...(isScheduled && scheduleDate && scheduleTime ? {
        scheduledFor: new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
      } : {}),
    };

    try {
      if (isScheduled) {
        await messagesAPI.schedule(messageData);
      } else {
        await messagesAPI.send(messageData);
      }
      navigate('/coach/messages');
    } catch (err: any) {
      setSendError(err.response?.data?.message || err.message || 'Kunne ikke sende beskjed.');
    } finally {
      setSending(false);
    }
  };

  const canSend = subject.trim() && message.trim() && (sendToAll || selectedRecipients.length > 0);

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      {/* Header - using PageHeader from design system */}
      <PageHeader
        title="Ny beskjed"
        subtitle="Send til spillere eller grupper"
        onBack={() => navigate('/coach/messages')}
      />

      <div style={{ padding: '0 24px 24px' }}>

      <Card variant="default" padding="none" style={{ overflow: 'hidden' }}>
        {/* Recipients Section */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-default)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', width: '60px' }}>
              Til:
            </span>
            <div style={{ flex: 1 }}>
              {sendToAll ? (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: 'var(--bg-success-subtle)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--success)',
                  fontSize: '13px',
                  fontWeight: 500,
                }}>
                  <Users size={14} />
                  Alle spillere
                  <button
                    onClick={() => setSendToAll(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                    }}
                  >
                    <X size={14} color="var(--success)" />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  {selectedRecipients.map(recipient => (
                    <div key={recipient.id} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: recipient.type === 'group'
                        ? 'var(--bg-warning-subtle)'
                        : 'var(--bg-accent-subtle)',
                      borderRadius: 'var(--radius-full)',
                      color: recipient.type === 'group'
                        ? 'var(--warning)'
                        : 'var(--accent)',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}>
                      {recipient.type === 'group' ? <Users size={14} /> : <User size={14} />}
                      {recipient.name}
                      {recipient.memberCount && ` (${recipient.memberCount})`}
                      <button
                        onClick={() => removeRecipient(recipient.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Legg til mottaker..."
                      value={recipientSearch}
                      onChange={(e) => {
                        setRecipientSearch(e.target.value);
                        setShowRecipientPicker(true);
                      }}
                      onFocus={() => setShowRecipientPicker(true)}
                      style={{
                        border: 'none',
                        background: 'none',
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        width: '180px',
                      }}
                    />
                    {showRecipientPicker && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        width: '280px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-default)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        zIndex: 100,
                        marginTop: '4px',
                      }}>
                        <div
                          onClick={() => {
                            setSendToAll(true);
                            setSelectedRecipients([]);
                            setShowRecipientPicker(false);
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            borderBottom: '1px solid var(--border-default)',
                            backgroundColor: 'var(--bg-success-subtle)',
                          }}
                        >
                          <Users size={16} color="var(--success)" />
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--success)', margin: 0 }}>
                              Alle spillere
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                              Send til alle dine spillere
                            </p>
                          </div>
                        </div>
                        {filteredRecipients.map(recipient => (
                          <div
                            key={recipient.id}
                            onClick={() => addRecipient(recipient)}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                            }}
                          >
                            <div style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: recipient.type === 'group'
                                ? 'var(--bg-warning-subtle)'
                                : 'var(--bg-accent-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              {recipient.type === 'group'
                                ? <Users size={14} color="var(--warning)" />
                                : <User size={14} color="var(--accent)" />
                              }
                            </div>
                            <div>
                              <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
                                {recipient.name}
                              </p>
                              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                                {recipient.type === 'group'
                                  ? `${recipient.memberCount} medlemmer`
                                  : `Kategori ${recipient.category}`
                                }
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', width: '60px' }}>
              Type:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { key: 'general', label: 'Generelt' },
                { key: 'training', label: 'Trening' },
                { key: 'tournament', label: 'Turnering' },
                { key: 'urgent', label: 'Viktig' },
              ].map(cat => {
                const isSelected = category === cat.key;
                return (
                  <Button
                    key={cat.key}
                    variant={isSelected ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setCategory(cat.key as typeof category)}
                  >
                    {cat.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subject */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-default)',
        }}>
          <input
            type="text"
            placeholder="Emne..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              background: 'none',
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
        </div>

        {/* Message Body */}
        <div style={{ padding: '16px 20px' }}>
          <textarea
            placeholder="Skriv din beskjed her..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: '100%',
              minHeight: '200px',
              border: 'none',
              background: 'none',
              fontSize: '14px',
              lineHeight: '1.6',
              color: 'var(--text-primary)',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-default)',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}>
            {attachments.map((att, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                color: 'var(--text-secondary)',
              }}>
                <FileText size={14} />
                {att.name}
                <button
                  onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-default)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Paperclip size={16} />}
              onClick={() => setAttachments([...attachments, { name: 'Dokument.pdf', type: 'pdf' }])}
            >
              Vedlegg
            </Button>
            <Button
              variant={isScheduled ? 'primary' : 'ghost'}
              size="sm"
              leftIcon={<Clock size={16} />}
              onClick={() => setIsScheduled(!isScheduled)}
            >
              Planlegg
            </Button>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {isScheduled && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-default)',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                  }}
                />
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-default)',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            )}
            <Button
              variant="primary"
              disabled={!canSend}
              leftIcon={isScheduled ? <Clock size={16} /> : <Send size={16} />}
              onClick={handleSend}
            >
              {isScheduled ? 'Planlegg' : 'Send'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Click outside to close picker */}
      {showRecipientPicker && (
        <div
          onClick={() => setShowRecipientPicker(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50
          }}
        />
      )}
      </div>
    </div>
  );
};

export default CoachMessageCompose;
