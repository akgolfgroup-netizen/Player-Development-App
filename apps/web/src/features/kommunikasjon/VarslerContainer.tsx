/**
 * VarslerContainer
 *
 * Archetype: A - List/Index Page
 * Purpose: Display user notifications
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  Calendar,
  Trophy,
  Target,
  MessageSquare,
  Award,
  AlertCircle,
  Clock,
  Trash2,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import Button from '../../ui/primitives/Button';
import { CardTitle } from '../../components/typography';
import { notificationsAPI } from '../../services/api';

// ============================================================================
// TYPES
// ============================================================================

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const NOTIFICATIONS: Notification[] = [
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

const getNotificationConfig = (type: string) => {
  switch (type) {
    case 'training':
      return { icon: Calendar, colorClass: 'text-ak-brand-primary bg-ak-brand-primary/15' };
    case 'tournament':
      return { icon: Trophy, colorClass: 'text-ak-status-warning bg-ak-status-warning/15' };
    case 'achievement':
      return { icon: Award, colorClass: 'text-ak-status-success bg-ak-status-success/15' };
    case 'message':
      return { icon: MessageSquare, colorClass: 'text-ak-brand-primary bg-ak-brand-primary/15' };
    case 'reminder':
      return { icon: Clock, colorClass: 'text-ak-status-warning bg-ak-status-warning/15' };
    case 'test':
      return { icon: Target, colorClass: 'text-ak-status-success bg-ak-status-success/15' };
    case 'alert':
      return { icon: AlertCircle, colorClass: 'text-ak-status-error bg-ak-status-error/15' };
    default:
      return { icon: Bell, colorClass: 'text-ak-text-secondary bg-ak-surface-subtle' };
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
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

interface NotificationCardProps {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onRead,
  onDelete,
}) => {
  const config = getNotificationConfig(notification.type);
  const Icon = config.icon;

  return (
    <div
      className={`
        flex items-start gap-3.5 p-3.5 rounded-xl shadow-sm cursor-pointer transition-all
        ${notification.read ? 'bg-ak-surface-base' : 'bg-ak-brand-primary/5 border-l-[3px] border-ak-brand-primary'}
        hover:bg-ak-surface-subtle
      `}
      onClick={() => {
        if (!notification.read) onRead(notification.id);
      }}
    >
      <div
        className={`w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 ${config.colorClass}`}
      >
        <Icon size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <CardTitle
            className={`text-sm m-0 text-ak-text-primary ${notification.read ? 'font-medium' : 'font-semibold'}`}
          >
            {notification.title}
          </CardTitle>
          <span className="text-[11px] text-ak-text-secondary">
            {formatTimestamp(notification.timestamp)}
          </span>
        </div>
        <p className="text-[13px] text-ak-text-secondary m-0 leading-relaxed">
          {notification.message}
        </p>
      </div>

      <div className="flex gap-1">
        {!notification.read && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRead(notification.id);
            }}
            className="p-1.5 rounded-md border-none bg-transparent cursor-pointer text-ak-text-secondary hover:bg-ak-surface-subtle"
            title="Merk som lest"
          >
            <Check size={16} />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="p-1.5 rounded-md border-none bg-transparent cursor-pointer text-ak-text-secondary hover:bg-ak-surface-subtle"
          title="Slett"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const VarslerContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await notificationsAPI.getAll();
        if (
          response?.data?.data?.notifications &&
          Array.isArray(response.data.data.notifications)
        ) {
          const apiNotifications = response.data.data.notifications.map(
            (n: {
              id: string;
              notificationType: string;
              title: string;
              message: string;
              createdAt: string;
              readAt: string | null;
              metadata?: { actionUrl?: string };
            }) => ({
              id: n.id,
              type: mapNotificationType(n.notificationType),
              title: n.title,
              message: n.message,
              timestamp: n.createdAt,
              read: n.readAt !== null,
              actionUrl:
                n.metadata?.actionUrl || getDefaultActionUrl(n.notificationType),
            })
          );
          setNotifications(
            apiNotifications.length > 0 ? apiNotifications : NOTIFICATIONS
          );
        } else {
          setNotifications(NOTIFICATIONS);
        }
      } catch (err) {
        console.warn('Failed to fetch notifications, using mock data:', err);
        setNotifications(NOTIFICATIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const mapNotificationType = (type: string) => {
    const typeMap: Record<string, string> = {
      training_plan: 'training',
      session_reminder: 'reminder',
      tournament: 'tournament',
      achievement: 'achievement',
      message: 'message',
      test_result: 'test',
      breaking_point: 'alert',
    };
    return typeMap[type] || 'reminder';
  };

  const getDefaultActionUrl = (type: string) => {
    const urlMap: Record<string, string> = {
      training_plan: '/trening/ukens',
      session_reminder: '/kalender',
      tournament: '/turneringskalender',
      achievement: '/achievements',
      message: '/meldinger',
      test_result: '/testresultater',
      breaking_point: '/utvikling/breaking-points',
    };
    return urlMap[type] || '/';
  };

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

  const handleRead = async (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    try {
      await notificationsAPI.markRead(id);
    } catch (err) {
      console.warn('Failed to mark notification as read:', err);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: false } : n))
      );
    }
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = async () => {
    const previousState = [...notifications];
    setNotifications(notifications.map((n) => ({ ...n, read: true })));

    try {
      await notificationsAPI.markAllRead();
    } catch (err) {
      console.warn('Failed to mark all notifications as read:', err);
      setNotifications(previousState);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ak-surface-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="text-ak-brand-primary animate-spin mx-auto" />
          <p className="mt-4 text-ak-text-secondary">Laster varsler...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ak-surface-subtle">
      <PageHeader
        title="Varsler"
        subtitle={`${unreadCount} uleste varsler`}
        actions={null}
      />

      <div className="p-6 w-full">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-1.5 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`
                  px-3.5 py-2 rounded-lg border-none text-[13px] font-medium cursor-pointer whitespace-nowrap
                  ${filter === f.key
                    ? 'bg-ak-brand-primary text-white'
                    : 'bg-ak-surface-base text-ak-text-primary'
                  }
                `}
              >
                {f.label}
                {f.key === 'unread' && unreadCount > 0 && (
                  <span
                    className={`
                      ml-1.5 px-1.5 py-0.5 rounded-[10px] text-[11px]
                      ${filter === f.key
                        ? 'bg-white/30 text-white'
                        : 'bg-ak-status-error text-white'
                      }
                    `}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              leftIcon={<Check size={14} />}
            >
              Merk alle som lest
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-2">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onRead={handleRead}
              onDelete={handleDelete}
            />
          ))}

          {filteredNotifications.length === 0 && (
            <div className="bg-ak-surface-base rounded-[14px] p-10 text-center">
              <Bell size={40} className="text-ak-text-secondary mb-3 mx-auto" />
              <p className="text-sm text-ak-text-secondary m-0">
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
