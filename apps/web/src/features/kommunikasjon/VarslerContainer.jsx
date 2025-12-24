import React, { useState } from 'react';
import {
  Bell, Check, ChevronRight, Calendar, Trophy, Target,
  MessageSquare, Award, AlertCircle, Clock, Filter, Trash2
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA
// ============================================================================

const NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'training',
    title: 'Ny treningsplan tilgjengelig',
    message: 'Anders har oppdatert ukeplanen din for neste uke.',
    timestamp: '2025-01-18T14:30:00',
    read: false,
    actionUrl: '/trening/ukens',
  },
  {
    id: 'n2',
    type: 'tournament',
    title: 'Pakmelding bekreftet',
    message: 'Du er pameldt Junior Masters Oslo 25.-26. januar.',
    timestamp: '2025-01-18T10:00:00',
    read: false,
    actionUrl: '/turneringskalender',
  },
  {
    id: 'n3',
    type: 'achievement',
    title: 'Ny prestasjon!',
    message: 'Du har oppnadd "Driver over 250m"!',
    timestamp: '2025-01-17T16:45:00',
    read: true,
    actionUrl: '/achievements',
  },
  {
    id: 'n4',
    type: 'message',
    title: 'Ny melding fra Anders',
    message: 'Bra jobba pa treningen i dag! Husk a fokusere pa...',
    timestamp: '2025-01-17T14:30:00',
    read: true,
    actionUrl: '/meldinger',
  },
  {
    id: 'n5',
    type: 'reminder',
    title: 'Paminelse: Trening i morgen',
    message: 'Du har teknikk-trening kl. 10:00 pa range.',
    timestamp: '2025-01-17T08:00:00',
    read: true,
    actionUrl: '/kalender',
  },
  {
    id: 'n6',
    type: 'test',
    title: 'Ny testresultat tilgjengelig',
    message: 'Dine resultater fra driving-testen er klare.',
    timestamp: '2025-01-15T12:00:00',
    read: true,
    actionUrl: '/testresultater',
  },
  {
    id: 'n7',
    type: 'alert',
    title: 'Breaking Point oppdatert',
    message: 'Trener har kommentert pa "Sving tempo".',
    timestamp: '2025-01-14T09:00:00',
    read: true,
    actionUrl: '/utvikling/breaking-points',
  },
];

// ============================================================================
// HELPERS
// ============================================================================

const getNotificationConfig = (type) => {
  switch (type) {
    case 'training':
      return { icon: Calendar, color: tokens.colors.primary };
    case 'tournament':
      return { icon: Trophy, color: tokens.colors.gold };
    case 'achievement':
      return { icon: Award, color: tokens.colors.success };
    case 'message':
      return { icon: MessageSquare, color: tokens.colors.primary };
    case 'reminder':
      return { icon: Clock, color: tokens.colors.warning };
    case 'test':
      return { icon: Target, color: tokens.colors.success };
    case 'alert':
      return { icon: AlertCircle, color: tokens.colors.error };
    default:
      return { icon: Bell, color: tokens.colors.steel };
  }
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Akkurat na';
  if (diffMins < 60) return `${diffMins} min siden`;
  if (diffHours < 24) return `${diffHours} timer siden`;
  if (diffDays === 1) return 'I gar';
  if (diffDays < 7) return `${diffDays} dager siden`;
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
};

// ============================================================================
// NOTIFICATION CARD
// ============================================================================

const NotificationCard = ({ notification, onRead, onDelete }) => {
  const config = getNotificationConfig(notification.type);
  const Icon = config.icon;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        padding: '14px 16px',
        backgroundColor: notification.read ? tokens.colors.white : `${tokens.colors.primary}05`,
        borderRadius: '12px',
        borderLeft: notification.read ? 'none' : `3px solid ${tokens.colors.primary}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onClick={() => {
        if (!notification.read) onRead(notification.id);
        // Navigate to actionUrl in a real app
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = tokens.colors.snow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = notification.read ? tokens.colors.white : `${tokens.colors.primary}05`;
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: `${config.color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={20} color={config.color} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: notification.read ? 500 : 600,
            color: tokens.colors.charcoal,
            margin: 0,
          }}>
            {notification.title}
          </h4>
          <span style={{ fontSize: '11px', color: tokens.colors.steel }}>
            {formatTimestamp(notification.timestamp)}
          </span>
        </div>
        <p style={{
          fontSize: '13px',
          color: tokens.colors.steel,
          margin: 0,
          lineHeight: 1.4,
        }}>
          {notification.message}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '4px' }}>
        {!notification.read && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRead(notification.id);
            }}
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
            title="Merk som lest"
          >
            <Check size={16} color={tokens.colors.steel} />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
          }}
          title="Slett"
        >
          <Trash2 size={16} color={tokens.colors.steel} />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const VarslerContainer = () => {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'Alle' },
    { key: 'unread', label: 'Uleste' },
    { key: 'training', label: 'Trening' },
    { key: 'tournament', label: 'Turneringer' },
    { key: 'message', label: 'Meldinger' },
  ];

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRead = (id) => {
    setNotifications(notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Varsler"
        subtitle={`${unreadCount} uleste varsler`}
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Header Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: filter === f.key ? tokens.colors.primary : tokens.colors.white,
                  color: filter === f.key ? tokens.colors.white : tokens.colors.charcoal,
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {f.label}
                {f.key === 'unread' && unreadCount > 0 && (
                  <span style={{
                    marginLeft: '6px',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    backgroundColor: filter === f.key ? 'rgba(255,255,255,0.3)' : tokens.colors.error,
                    color: tokens.colors.white,
                    fontSize: '11px',
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: tokens.colors.white,
                color: tokens.colors.primary,
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Check size={14} />
              Merk alle som lest
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onRead={handleRead}
              onDelete={handleDelete}
            />
          ))}

          {filteredNotifications.length === 0 && (
            <div style={{
              backgroundColor: tokens.colors.white,
              borderRadius: '14px',
              padding: '40px',
              textAlign: 'center',
            }}>
              <Bell size={40} color={tokens.colors.steel} style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', color: tokens.colors.steel, margin: 0 }}>
                {filter === 'unread' ? 'Ingen uleste varsler' : 'Ingen varsler funnet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VarslerContainer;
