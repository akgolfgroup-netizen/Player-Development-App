import React, { useState, useMemo } from 'react';
import {
  Send,
  ArrowLeft,
  Users,
  User,
  X,
  Paperclip,
  FileText,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tokens as designTokens } from '../../design-tokens';
import { messagesAPI } from '../../services/api';
import { sanitizeText, sanitizeSearchQuery } from '../../utils/sanitize';

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

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'training': return { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb', border: '#2563eb' };
      case 'tournament': return { bg: 'rgba(168, 85, 247, 0.1)', text: '#7c3aed', border: '#7c3aed' };
      case 'urgent': return { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', border: '#dc2626' };
      default: return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: '#6b7280' };
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: designTokens.colors.background.primary, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/coach/messages')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: `1px solid ${designTokens.colors.border.light}`,
            backgroundColor: designTokens.colors.background.card,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={20} color={designTokens.colors.text.secondary} />
        </button>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: designTokens.colors.text.primary,
            margin: 0
          }}>
            Ny beskjed
          </h1>
          <p style={{
            fontSize: '14px',
            color: designTokens.colors.text.secondary,
            margin: 0
          }}>
            Send til spillere eller grupper
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: designTokens.colors.background.card,
        borderRadius: '16px',
        border: `1px solid ${designTokens.colors.border.light}`,
        overflow: 'hidden'
      }}>
        {/* Recipients Section */}
        <div style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${designTokens.colors.border.light}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: designTokens.colors.text.secondary, width: '60px' }}>
              Til:
            </span>
            <div style={{ flex: 1 }}>
              {sendToAll ? (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '20px',
                  color: '#059669',
                  fontSize: '13px',
                  fontWeight: '500'
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
                      display: 'flex'
                    }}
                  >
                    <X size={14} color="#059669" />
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
                        ? 'rgba(168, 85, 247, 0.1)'
                        : designTokens.colors.primary[100],
                      borderRadius: '20px',
                      color: recipient.type === 'group'
                        ? '#7c3aed'
                        : designTokens.colors.primary[700],
                      fontSize: '13px',
                      fontWeight: '500'
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
                          display: 'flex'
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
                        color: designTokens.colors.text.primary,
                        outline: 'none',
                        width: '180px'
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
                        backgroundColor: designTokens.colors.background.card,
                        borderRadius: '12px',
                        border: `1px solid ${designTokens.colors.border.light}`,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        zIndex: 100,
                        marginTop: '4px'
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
                            borderBottom: `1px solid ${designTokens.colors.border.light}`,
                            backgroundColor: 'rgba(16, 185, 129, 0.05)'
                          }}
                        >
                          <Users size={16} color="#059669" />
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '500', color: '#059669', margin: 0 }}>
                              Alle spillere
                            </p>
                            <p style={{ fontSize: '12px', color: designTokens.colors.text.tertiary, margin: 0 }}>
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
                              gap: '10px'
                            }}
                          >
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: recipient.type === 'group'
                                ? 'rgba(168, 85, 247, 0.1)'
                                : designTokens.colors.primary[100],
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {recipient.type === 'group'
                                ? <Users size={14} color="#7c3aed" />
                                : <User size={14} color={designTokens.colors.primary[600]} />
                              }
                            </div>
                            <div>
                              <p style={{ fontSize: '14px', fontWeight: '500', color: designTokens.colors.text.primary, margin: 0 }}>
                                {recipient.name}
                              </p>
                              <p style={{ fontSize: '12px', color: designTokens.colors.text.tertiary, margin: 0 }}>
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
            <span style={{ fontSize: '14px', fontWeight: '500', color: designTokens.colors.text.secondary, width: '60px' }}>
              Type:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { key: 'general', label: 'Generelt' },
                { key: 'training', label: 'Trening' },
                { key: 'tournament', label: 'Turnering' },
                { key: 'urgent', label: 'Viktig' }
              ].map(cat => {
                const colors = getCategoryColor(cat.key);
                const isSelected = category === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setCategory(cat.key as typeof category)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: isSelected ? `2px solid ${colors.border}` : `1px solid ${designTokens.colors.border.light}`,
                      backgroundColor: isSelected ? colors.bg : 'transparent',
                      color: isSelected ? colors.text : designTokens.colors.text.secondary,
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subject */}
        <div style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${designTokens.colors.border.light}`
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
              fontWeight: '600',
              color: designTokens.colors.text.primary,
              outline: 'none'
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
              color: designTokens.colors.text.primary,
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div style={{
            padding: '12px 20px',
            borderTop: `1px solid ${designTokens.colors.border.light}`,
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {attachments.map((att, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: designTokens.colors.background.secondary,
                borderRadius: '8px',
                fontSize: '13px',
                color: designTokens.colors.text.secondary
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
                    display: 'flex'
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
          borderTop: `1px solid ${designTokens.colors.border.light}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setAttachments([...attachments, { name: 'Dokument.pdf', type: 'pdf' }])}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${designTokens.colors.border.light}`,
                backgroundColor: 'transparent',
                color: designTokens.colors.text.secondary,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <Paperclip size={16} />
              Vedlegg
            </button>
            <button
              onClick={() => setIsScheduled(!isScheduled)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: isScheduled
                  ? `2px solid ${designTokens.colors.primary[500]}`
                  : `1px solid ${designTokens.colors.border.light}`,
                backgroundColor: isScheduled ? designTokens.colors.primary[50] : 'transparent',
                color: isScheduled ? designTokens.colors.primary[600] : designTokens.colors.text.secondary,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <Clock size={16} />
              Planlegg
            </button>
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
                    borderRadius: '8px',
                    border: `1px solid ${designTokens.colors.border.light}`,
                    fontSize: '13px',
                    color: designTokens.colors.text.primary
                  }}
                />
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${designTokens.colors.border.light}`,
                    fontSize: '13px',
                    color: designTokens.colors.text.primary
                  }}
                />
              </div>
            )}
            <button
              onClick={handleSend}
              disabled={!canSend}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: canSend
                  ? designTokens.colors.primary[500]
                  : designTokens.colors.border.light,
                color: canSend ? 'white' : designTokens.colors.text.tertiary,
                fontSize: '14px',
                fontWeight: '600',
                cursor: canSend ? 'pointer' : 'not-allowed'
              }}
            >
              {isScheduled ? (
                <>
                  <Clock size={16} />
                  Planlegg
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>

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
  );
};

export default CoachMessageCompose;
