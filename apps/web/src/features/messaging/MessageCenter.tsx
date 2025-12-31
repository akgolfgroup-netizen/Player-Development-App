/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AK Golf Academy - Message Center
 * Design System v3.0 - Blue Palette 01
 *
 * Hovedkomponent for meldingssystemet.
 * Viser alle samtaler og gir tilgang til chat.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Search,
  Users,
  User,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import MembersList, { Member } from '../../ui/composites/MembersList.composite';
import { SubSectionTitle } from '../../components/typography';

interface ChatGroup {
  id: string;
  name: string;
  groupType: 'direct' | 'team' | 'coach_player';
  avatarUrl?: string;
  avatarInitials?: string;
  avatarColor?: string;
  lastMessage?: {
    content: string;
    senderName: string;
    sentAt: string;
    isRead: boolean;
  };
  unreadCount: number;
  members: Array<{
    id: string;
    name: string;
    type: 'player' | 'coach' | 'parent';
  }>;
}

interface MessageCenterProps {
  userId?: string;
  filterType?: 'all' | 'unread' | 'coach';
}

export default function MessageCenter({ userId, filterType: initialFilterType }: MessageCenterProps) {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ChatGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'coach'>(initialFilterType || 'all');
  const [showContacts, setShowContacts] = useState(false);
  const [contacts, setContacts] = useState<Member[]>([]);

  // Sync filter when prop changes
  useEffect(() => {
    if (initialFilterType) {
      setFilterType(initialFilterType);
    }
  }, [initialFilterType]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/v1/messages/conversations');
        if (response.ok) {
          const data = await response.json();
          setConversations(data.conversations || []);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
        // Mock data for development
        setConversations([
          {
            id: '1',
            name: 'Anders Kristiansen (Trener)',
            groupType: 'coach_player',
            avatarInitials: 'AK',
            avatarColor: 'var(--achievement)',
            lastMessage: {
              content: 'Husk å fokusere på putting i dag!',
              senderName: 'Anders',
              sentAt: '2025-12-21T09:30:00Z',
              isRead: false,
            },
            unreadCount: 2,
            members: [
              { id: '1', name: 'Anders Kristiansen', type: 'coach' },
            ],
          },
          {
            id: '2',
            name: 'WANG Toppidrett',
            groupType: 'team',
            avatarInitials: 'WT',
            avatarColor: 'var(--accent)',
            lastMessage: {
              content: 'Samling på lørdag kl 10:00',
              senderName: 'Trener',
              sentAt: '2025-12-20T14:00:00Z',
              isRead: true,
            },
            unreadCount: 0,
            members: [
              { id: '1', name: 'Anders', type: 'coach' },
              { id: '2', name: 'Lars', type: 'player' },
              { id: '3', name: 'Erik', type: 'player' },
            ],
          },
          {
            id: '3',
            name: 'Team Norway U18',
            groupType: 'team',
            avatarInitials: 'TN',
            avatarColor: 'var(--error)',
            lastMessage: {
              content: 'Treningsplan for neste uke er klar',
              senderName: 'Landslagstrener',
              sentAt: '2025-12-19T16:45:00Z',
              isRead: true,
            },
            unreadCount: 0,
            members: [],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/v1/messages/contacts');
        if (response.ok) {
          const data = await response.json();
          setContacts(data.contacts || []);
        }
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
        // Mock data for development
        setContacts([
          {
            id: 'c1',
            name: 'Anders Kristiansen',
            email: 'anders@akgolf.no',
            role: 'Hovedtrener',
            avatarInitials: 'AK',
            avatarColor: 'var(--achievement)',
            type: 'coach',
            isOnline: true,
          },
          {
            id: 'c2',
            name: 'Erik Johansen',
            email: 'erik@demo.no',
            avatarInitials: 'EJ',
            avatarColor: 'var(--success)',
            category: 'Kat. A',
            type: 'player',
            lastSeen: '2t siden',
          },
          {
            id: 'c3',
            name: 'Sofie Andersen',
            email: 'sofie@demo.no',
            avatarInitials: 'SA',
            avatarColor: 'var(--accent)',
            category: 'Kat. A',
            type: 'player',
            isOnline: true,
          },
          {
            id: 'c4',
            name: 'Lars Olsen',
            email: 'lars@demo.no',
            avatarInitials: 'LO',
            avatarColor: 'var(--error)',
            category: 'Kat. B',
            type: 'player',
            lastSeen: '1d siden',
          },
          {
            id: 'c5',
            name: 'Emma Berg',
            email: 'emma@demo.no',
            avatarInitials: 'EB',
            avatarColor: 'var(--accent)',
            category: 'Kat. B',
            type: 'player',
            lastSeen: '3t siden',
          },
        ]);
      }
    };

    fetchContacts();
  }, []);

  // Filter and search conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!conv.name.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Type filter
      if (filterType === 'unread' && conv.unreadCount === 0) {
        return false;
      }
      if (filterType === 'coach' && conv.groupType !== 'coach_player') {
        return false;
      }

      return true;
    });
  }, [conversations, searchQuery, filterType]);

  // Format relative time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Nå';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}t`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  };

  // Get group type icon
  const getGroupIcon = (type: string) => {
    switch (type) {
      case 'team':
        return <Users size={14} />;
      case 'coach_player':
        return <User size={14} />;
      default:
        return <MessageSquare size={14} />;
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
        <p style={{ color: 'var(--text-secondary)' }}>Laster meldinger...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Search and filters */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        {/* Search */}
        <div
          style={{
            flex: 1,
            position: 'relative',
          }}
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
            }}
          />
          <input
            type="text"
            placeholder="Søk i samtaler..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              backgroundColor: 'var(--bg-primary)',
              border: `1px solid ${'var(--border-default)'}`,
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { key: 'all', label: 'Alle' },
            { key: 'unread', label: 'Uleste' },
            { key: 'coach', label: 'Trener' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterType(filter.key as any)}
              style={{
                padding: '8px 14px',
                backgroundColor:
                  filterType === filter.key
                    ? 'var(--accent)'
                    : 'var(--bg-primary)',
                color:
                  filterType === filter.key
                    ? 'var(--bg-primary)'
                    : 'var(--text-primary)',
                border: `1px solid ${
                  filterType === filter.key
                    ? 'var(--accent)'
                    : 'var(--border-default)'
                }`,
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations list */}
      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-lg)',
          border: `1px solid ${'var(--border-default)'}`,
          overflow: 'hidden',
        }}
      >
        {filteredConversations.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--spacing-12) var(--spacing-4)',
              textAlign: 'center',
            }}
          >
            <MessageSquare
              style={{ width: '48px', height: '48px', color: 'var(--text-muted)', marginBottom: 'var(--spacing-4)' }}
            />
            <h3
              style={{
                fontSize: 'var(--font-size-headline)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-2)',
              }}
            >
              Ingen meldinger
            </h3>
            <p
              style={{
                fontSize: 'var(--font-size-footnote)',
                color: 'var(--text-tertiary)',
                marginBottom: 'var(--spacing-4)',
                maxWidth: '320px',
              }}
            >
              {searchQuery
                ? 'Ingen samtaler matcher søket ditt'
                : 'Start en ny samtale med treneren din'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation, index) => (
            <Link
              key={conversation.id}
              to={`/meldinger/${conversation.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                textDecoration: 'none',
                borderBottom:
                  index < filteredConversations.length - 1
                    ? `1px solid ${'var(--bg-tertiary)'}`
                    : 'none',
                backgroundColor:
                  conversation.unreadCount > 0
                    ? `${'var(--accent)'}08`
                    : 'transparent',
                transition: 'background-color 0.15s',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: conversation.avatarColor || 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--bg-primary)',
                  fontWeight: 700,
                  fontSize: '16px',
                  flexShrink: 0,
                }}
              >
                {conversation.avatarInitials}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '17px', lineHeight: '22px',
                      color: 'var(--text-primary)',
                      fontWeight: conversation.unreadCount > 0 ? 700 : 600,
                    }}
                  >
                    {conversation.name}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 6px',
                      backgroundColor: 'var(--bg-tertiary)',
                      borderRadius: '4px',
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                    }}
                  >
                    {getGroupIcon(conversation.groupType)}
                    {conversation.groupType === 'team' && 'Gruppe'}
                    {conversation.groupType === 'coach_player' && 'Trener'}
                  </span>
                </div>

                {conversation.lastMessage && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {conversation.lastMessage.isRead ? (
                      <CheckCheck size={14} color={'var(--success)'} />
                    ) : (
                      <Check size={14} color={'var(--text-secondary)'} />
                    )}
                    <p
                      style={{
                        fontSize: '13px', lineHeight: '18px',
                        color: conversation.unreadCount > 0
                          ? 'var(--text-primary)'
                          : 'var(--text-secondary)',
                        fontWeight: conversation.unreadCount > 0 ? 500 : 400,
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                )}
              </div>

              {/* Time and unread badge */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '6px',
                  flexShrink: 0,
                }}
              >
                {conversation.lastMessage && (
                  <span
                    style={{
                      fontSize: '12px', lineHeight: '16px',
                      color: conversation.unreadCount > 0
                        ? 'var(--accent)'
                        : 'var(--text-secondary)',
                    }}
                  >
                    {formatTime(conversation.lastMessage.sentAt)}
                  </span>
                )}
                {conversation.unreadCount > 0 && (
                  <span
                    style={{
                      minWidth: 20,
                      height: 20,
                      borderRadius: '10px',
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg-primary)',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 6px',
                    }}
                  >
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Contacts Section */}
      <div style={{ marginTop: '24px' }}>
        <button
          onClick={() => setShowContacts(!showContacts)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '16px 20px',
            backgroundColor: 'var(--bg-primary)',
            border: `1px solid ${'var(--border-default)'}`,
            borderRadius: showContacts ? 'var(--radius-lg) var(--radius-lg) 0 0' : 'var(--radius-lg)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={20} color="white" />
            </div>
            <div>
              <SubSectionTitle
                style={{
                  fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                Kontakter
              </SubSectionTitle>
              <p
                style={{
                  fontSize: '13px', lineHeight: '18px',
                  color: 'var(--text-secondary)',
                  margin: '2px 0 0',
                }}
              >
                {contacts.length} personer · {contacts.filter(c => c.isOnline).length} online
              </p>
            </div>
          </div>
          {showContacts ? (
            <ChevronUp size={20} color="var(--text-secondary)" />
          ) : (
            <ChevronDown size={20} color="var(--text-secondary)" />
          )}
        </button>

        {showContacts && (
          <div
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: `1px solid ${'var(--border-default)'}`,
              borderTop: 'none',
              borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            <MembersList
              members={contacts}
              onMemberClick={(member) => {
                // Navigate to or create conversation with this contact
                navigate(`/meldinger/ny?contact=${member.id}`);
              }}
              showEmail={true}
              showStatus={true}
              showRole={true}
              size="md"
              emptyMessage="Ingen kontakter tilgjengelig"
            />
          </div>
        )}
      </div>
    </div>
  );
}
