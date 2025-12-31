/**
 * AK Golf Academy - Conversation View
 * Design System v3.0 - Blue Palette 01
 *
 * Chat-visning for en enkelt samtale.
 * Støtter tekst, bilder og svar på meldinger.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Paperclip,
  Check,
  CheckCheck,
  Reply,
  X,
  Users,
  User,
  Info,
} from 'lucide-react';
import { SectionTitle } from '../../components/typography';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'player' | 'coach' | 'parent' | 'system';
  content: string;
  messageType: 'text' | 'image' | 'system';
  metadata?: {
    imageUrl?: string;
  };
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
  isRead: boolean;
  createdAt: string;
  isOwn: boolean;
}

interface ConversationInfo {
  id: string;
  name: string;
  groupType: 'direct' | 'team' | 'coach_player';
  avatarInitials: string;
  avatarColor: string;
  members: Array<{
    id: string;
    name: string;
    type: string;
    isOnline?: boolean;
  }>;
}

export default function ConversationView() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [conversation, setConversation] = useState<ConversationInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  // Fetch conversation and messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch conversation info
        const convResponse = await fetch(`/api/v1/messages/conversations/${conversationId}`);
        if (convResponse.ok) {
          const convData = await convResponse.json();
          setConversation(convData.conversation);
        }

        // Fetch messages
        const msgResponse = await fetch(`/api/v1/messages/conversations/${conversationId}/messages`);
        if (msgResponse.ok) {
          const msgData = await msgResponse.json();
          setMessages(msgData.messages || []);
        }
      } catch (error) {
        console.error('Failed to fetch conversation:', error);
        // Mock data for development
        setConversation({
          id: conversationId || '1',
          name: 'Anders Kristiansen (Trener)',
          groupType: 'coach_player',
          avatarInitials: 'AK',
          avatarColor: 'var(--achievement)',
          members: [
            { id: '1', name: 'Anders Kristiansen', type: 'coach', isOnline: true },
          ],
        });
        setMessages([
          {
            id: '1',
            senderId: 'coach1',
            senderName: 'Anders Kristiansen',
            senderType: 'coach',
            content: 'Hei! Hvordan gikk treningsøkten i går?',
            messageType: 'text',
            isRead: true,
            createdAt: '2025-12-20T14:30:00Z',
            isOwn: false,
          },
          {
            id: '2',
            senderId: 'player1',
            senderName: 'Du',
            senderType: 'player',
            content: 'Hei! Det gikk bra, fokuserte mye på putting som du foreslo. Merket forbedring!',
            messageType: 'text',
            isRead: true,
            createdAt: '2025-12-20T15:15:00Z',
            isOwn: true,
          },
          {
            id: '3',
            senderId: 'coach1',
            senderName: 'Anders Kristiansen',
            senderType: 'coach',
            content: 'Flott! Husk å fortsette med de korte puttene (1-2m). Det er der de fleste slag spares.',
            messageType: 'text',
            replyTo: {
              id: '2',
              content: 'Hei! Det gikk bra, fokuserte mye på putting...',
              senderName: 'Du',
            },
            isRead: true,
            createdAt: '2025-12-20T15:45:00Z',
            isOwn: false,
          },
          {
            id: '4',
            senderId: 'coach1',
            senderName: 'Anders Kristiansen',
            senderType: 'coach',
            content: 'Husk å fokusere på putting i dag! Test 5 (lag putt) er viktig for å nå kategori B.',
            messageType: 'text',
            isRead: false,
            createdAt: '2025-12-21T09:30:00Z',
            isOwn: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [conversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    if (messages.length > 0) {
      fetch(`/api/v1/messages/conversations/${conversationId}/read`, {
        method: 'PUT',
      }).catch(() => {});
    }
  }, [conversationId, messages.length]);

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });
  };

  // Format date header
  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'I dag';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'I går';
    } else {
      return date.toLocaleDateString('nb-NO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      const response = await fetch(`/api/v1/messages/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: messageContent,
          replyToId: replyingTo?.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.message]);
      } else {
        // Optimistic update for demo
        const newMsg: Message = {
          id: Date.now().toString(),
          senderId: 'player1',
          senderName: 'Du',
          senderType: 'player',
          content: messageContent,
          messageType: 'text',
          replyTo: replyingTo
            ? {
                id: replyingTo.id,
                content: replyingTo.content.substring(0, 50) + '...',
                senderName: replyingTo.senderName,
              }
            : undefined,
          isRead: false,
          createdAt: new Date().toISOString(),
          isOwn: true,
        };
        setMessages([...messages, newMsg]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
      setReplyingTo(null);
      inputRef.current?.focus();
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: `3px solid ${'var(--border-default)'}`,
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p style={{ color: 'var(--text-secondary)' }}>Laster samtale...</p>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--error)' }}>Samtale ikke funnet</p>
        <Link
          to="/meldinger"
          style={{ color: 'var(--accent)', marginTop: '16px', display: 'block' }}
        >
          Tilbake til meldinger
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 48px)',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          backgroundColor: 'var(--bg-primary)',
          borderBottom: `1px solid ${'var(--border-default)'}`,
          borderRadius: `${'var(--radius-lg)'} ${'var(--radius-lg)'} 0 0`,
        }}
      >
        <button
          onClick={() => navigate('/meldinger')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            color: 'var(--text-primary)',
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-md)',
            backgroundColor: conversation.avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--bg-primary)',
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          {conversation.avatarInitials}
        </div>

        <div style={{ flex: 1 }}>
          <SectionTitle
            style={{
              fontSize: '17px', lineHeight: '22px', fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {conversation.name}
          </SectionTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {conversation.groupType === 'team' ? (
              <Users size={12} color={'var(--text-secondary)'} />
            ) : (
              <User size={12} color={'var(--text-secondary)'} />
            )}
            <span style={{ fontSize: '13px', lineHeight: '18px', color: 'var(--text-secondary)' }}>
              {conversation.members.length}{' '}
              {conversation.members.length === 1 ? 'medlem' : 'medlemmer'}
            </span>
            {conversation.members.some((m) => m.isOnline) && (
              <>
                <span style={{ color: 'var(--border-default)' }}>•</span>
                <span
                  style={{
                    fontSize: '13px', lineHeight: '18px',
                    color: 'var(--success)',
                  }}
                >
                  Aktiv nå
                </span>
              </>
            )}
          </div>
        </div>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          <Info size={20} />
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        {Object.entries(groupedMessages).map(([date, dateMessages]: [string, Message[]]) => (
          <div key={date}>
            {/* Date header */}
            <div
              style={{
                textAlign: 'center',
                margin: '16px 0',
              }}
            >
              <span
                style={{
                  fontSize: '13px', lineHeight: '18px',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-primary)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  border: `1px solid ${'var(--border-default)'}`,
                }}
              >
                {formatDateHeader(dateMessages[0].createdAt)}
              </span>
            </div>

            {/* Messages for this date */}
            {dateMessages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                  }}
                >
                  {/* Reply preview */}
                  {message.replyTo && (
                    <div
                      style={{
                        padding: '8px 12px',
                        backgroundColor: message.isOwn
                          ? 'rgba(var(--accent-rgb), 0.20)'
                          : 'var(--bg-tertiary)',
                        borderRadius: `${'var(--radius-md)'} ${'var(--radius-md)'} 0 0`,
                        borderLeft: `3px solid ${
                          message.isOwn ? 'var(--accent)' : 'var(--achievement)'
                        }`,
                        marginBottom: '-4px',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '12px', lineHeight: '16px',
                          color: 'var(--accent)',
                          fontWeight: 600,
                          margin: '0 0 2px',
                        }}
                      >
                        {message.replyTo.senderName}
                      </p>
                      <p
                        style={{
                          fontSize: '13px', lineHeight: '18px',
                          color: 'var(--text-secondary)',
                          margin: 0,
                        }}
                      >
                        {message.replyTo.content}
                      </p>
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    style={{
                      padding: '10px 14px',
                      backgroundColor: message.isOwn
                        ? 'var(--accent)'
                        : 'var(--bg-primary)',
                      color: message.isOwn ? 'var(--bg-primary)' : 'var(--text-primary)',
                      borderRadius: message.replyTo
                        ? `0 0 ${'var(--radius-md)'} ${'var(--radius-md)'}`
                        : 'var(--radius-md)',
                      boxShadow: message.isOwn ? 'none' : 'var(--shadow-card)',
                    }}
                  >
                    {!message.isOwn && conversation.groupType === 'team' && (
                      <p
                        style={{
                          fontSize: '12px', lineHeight: '16px',
                          color: 'var(--achievement)',
                          fontWeight: 600,
                          margin: '0 0 4px',
                        }}
                      >
                        {message.senderName}
                      </p>
                    )}
                    <p
                      style={{
                        fontSize: '15px', lineHeight: '20px',
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {message.content}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '4px',
                        marginTop: '4px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px', lineHeight: '16px',
                          color: message.isOwn
                            ? 'rgba(255,255,255,0.7)'
                            : 'var(--text-secondary)',
                        }}
                      >
                        {formatTime(message.createdAt)}
                      </span>
                      {message.isOwn && (
                        message.isRead ? (
                          <CheckCheck size={14} color="rgba(255,255,255,0.7)" />
                        ) : (
                          <Check size={14} color="rgba(255,255,255,0.7)" />
                        )
                      )}
                    </div>
                  </div>

                  {/* Quick reply button */}
                  {!message.isOwn && (
                    <button
                      onClick={() => setReplyingTo(message)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '4px',
                        padding: '4px 8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      <Reply size={12} />
                      Svar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyingTo && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            backgroundColor: 'var(--bg-tertiary)',
            borderTop: `1px solid ${'var(--border-default)'}`,
          }}
        >
          <Reply size={16} color={'var(--accent)'} />
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: '12px', lineHeight: '16px',
                color: 'var(--accent)',
                fontWeight: 600,
                margin: 0,
              }}
            >
              Svarer til {replyingTo.senderName}
            </p>
            <p
              style={{
                fontSize: '13px', lineHeight: '18px',
                color: 'var(--text-secondary)',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {replyingTo.content}
            </p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Input area */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-primary)',
          borderTop: `1px solid ${'var(--border-default)'}`,
          borderRadius: `0 0 ${'var(--radius-lg)'} ${'var(--radius-lg)'}`,
        }}
      >
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          <Paperclip size={20} />
        </button>

        <div style={{ flex: 1 }}>
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Skriv en melding..."
            rows={1}
            style={{
              width: '100%',
              padding: '10px 14px',
              backgroundColor: 'var(--bg-tertiary)',
              border: `1px solid ${'var(--border-default)'}`,
              borderRadius: 'var(--radius-md)',
              fontSize: '15px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || sending}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            backgroundColor: newMessage.trim()
              ? 'var(--accent)'
              : 'var(--border-default)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
            color: 'var(--bg-primary)',
            transition: 'background-color 0.15s',
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
