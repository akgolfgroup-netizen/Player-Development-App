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
  Plus,
  Users,
  User,
  Check,
  CheckCheck,
} from 'lucide-react';
import { tokens } from '../../design-tokens';

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
            avatarColor: tokens.colors.gold,
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
            avatarColor: tokens.colors.primary,
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
            avatarColor: tokens.colors.error,
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

  // Total unread count
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: `3px solid ${tokens.colors.gray300}`,
            borderTopColor: tokens.colors.primary,
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p style={{ color: tokens.colors.steel }}>Laster meldinger...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1
            style={{
              ...tokens.typography.title1,
              color: tokens.colors.charcoal,
              margin: 0,
            }}
          >
            Meldinger
          </h1>
          {totalUnread > 0 && (
            <p
              style={{
                ...tokens.typography.subheadline,
                color: tokens.colors.steel,
                margin: '4px 0 0',
              }}
            >
              {totalUnread} uleste {totalUnread === 1 ? 'melding' : 'meldinger'}
            </p>
          )}
        </div>

        <button
          onClick={() => navigate('/meldinger/ny')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.white,
            border: 'none',
            borderRadius: tokens.radius.md,
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Plus size={18} />
          Ny melding
        </button>
      </div>

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
              color: tokens.colors.steel,
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
              backgroundColor: tokens.colors.white,
              border: `1px solid ${tokens.colors.gray300}`,
              borderRadius: tokens.radius.md,
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
                    ? tokens.colors.primary
                    : tokens.colors.white,
                color:
                  filterType === filter.key
                    ? tokens.colors.white
                    : tokens.colors.charcoal,
                border: `1px solid ${
                  filterType === filter.key
                    ? tokens.colors.primary
                    : tokens.colors.gray300
                }`,
                borderRadius: tokens.radius.sm,
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
          backgroundColor: tokens.colors.white,
          borderRadius: tokens.radius.lg,
          border: `1px solid ${tokens.colors.gray300}`,
          overflow: 'hidden',
        }}
      >
        {filteredConversations.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
            }}
          >
            <MessageSquare
              size={48}
              style={{ color: tokens.colors.gray300, marginBottom: '16px' }}
            />
            <p
              style={{
                ...tokens.typography.headline,
                color: tokens.colors.charcoal,
                margin: '0 0 8px',
              }}
            >
              Ingen samtaler
            </p>
            <p
              style={{
                ...tokens.typography.subheadline,
                color: tokens.colors.steel,
                margin: 0,
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
                    ? `1px solid ${tokens.colors.gray100}`
                    : 'none',
                backgroundColor:
                  conversation.unreadCount > 0
                    ? `${tokens.colors.primary}08`
                    : 'transparent',
                transition: 'background-color 0.15s',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: tokens.radius.md,
                  backgroundColor: conversation.avatarColor || tokens.colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: tokens.colors.white,
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
                      ...tokens.typography.headline,
                      color: tokens.colors.charcoal,
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
                      backgroundColor: tokens.colors.gray100,
                      borderRadius: '4px',
                      color: tokens.colors.steel,
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
                      <CheckCheck size={14} color={tokens.colors.success} />
                    ) : (
                      <Check size={14} color={tokens.colors.steel} />
                    )}
                    <p
                      style={{
                        ...tokens.typography.subheadline,
                        color: conversation.unreadCount > 0
                          ? tokens.colors.charcoal
                          : tokens.colors.steel,
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
                      ...tokens.typography.caption1,
                      color: conversation.unreadCount > 0
                        ? tokens.colors.primary
                        : tokens.colors.steel,
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
                      backgroundColor: tokens.colors.primary,
                      color: tokens.colors.white,
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
    </div>
  );
}
