/**
 * AK Golf Academy - Notification Center
 * Design System v3.0 - Blue Palette 01
 *
 * Viser alle varsler og oppdateringer for spilleren.
 * Støtter ulike varseltyper og handlinger.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Trophy,
  MessageSquare,
  Target,
  TrendingUp,
  Star,
  Check,
  Trash2,
} from 'lucide-react';
import { tokens } from '../../design-tokens';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'training' | 'test' | 'tournament' | 'message';
  title: string;
  message: string;
  link?: string;
  linkLabel?: string;
  priority: 'low' | 'normal' | 'high';
  isRead: boolean;
  createdAt: string;
  metadata?: {
    achievementCode?: string;
    testNumber?: number;
    tournamentName?: string;
  };
}

interface NotificationCenterProps {
  userId?: string;
}

export default function NotificationCenter({ userId }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/v1/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        // Mock data for development
        setNotifications([
          {
            id: '1',
            type: 'achievement',
            title: 'Ny prestasjon!',
            message: 'Du har oppnådd "7-dagers treningsstreak"! Fortsett det gode arbeidet.',
            link: '/achievements',
            linkLabel: 'Se alle prestasjoner',
            priority: 'normal',
            isRead: false,
            createdAt: '2025-12-21T08:00:00Z',
            metadata: { achievementCode: 'streak_7' },
          },
          {
            id: '2',
            type: 'message',
            title: 'Ny melding fra trener',
            message: 'Anders Kristiansen har sendt deg en melding.',
            link: '/meldinger/1',
            linkLabel: 'Les melding',
            priority: 'high',
            isRead: false,
            createdAt: '2025-12-21T09:30:00Z',
          },
          {
            id: '3',
            type: 'training',
            title: 'Treningsplan oppdatert',
            message: 'Treneren din har gjort endringer i ukens treningsplan.',
            link: '/trening/ukens',
            linkLabel: 'Se endringer',
            priority: 'normal',
            isRead: false,
            createdAt: '2025-12-20T16:00:00Z',
          },
          {
            id: '4',
            type: 'test',
            title: 'Test 5 bestått!',
            message: 'Gratulerer! Du bestod Test 5 (Lag Putt) med 85% suksessrate.',
            link: '/testresultater',
            linkLabel: 'Se resultater',
            priority: 'normal',
            isRead: true,
            createdAt: '2025-12-19T14:30:00Z',
            metadata: { testNumber: 5 },
          },
          {
            id: '5',
            type: 'tournament',
            title: 'Påminnelse: Turnering',
            message: 'NM Junior starter om 3 dager. Husk å sjekke starttidspunkt.',
            link: '/mine-turneringer',
            linkLabel: 'Se turneringer',
            priority: 'high',
            isRead: true,
            createdAt: '2025-12-18T10:00:00Z',
            metadata: { tournamentName: 'NM Junior' },
          },
          {
            id: '6',
            type: 'info',
            title: 'Ukens mål oppdatert',
            message: 'Fokuser på putting denne uken for å nærme deg kategori B.',
            link: '/utvikling/kategori',
            linkLabel: 'Se fremgang',
            priority: 'low',
            isRead: true,
            createdAt: '2025-12-17T09:00:00Z',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return { icon: Star, color: tokens.colors.gold };
      case 'success':
        return { icon: CheckCircle, color: tokens.colors.success };
      case 'warning':
        return { icon: AlertCircle, color: tokens.colors.warning };
      case 'error':
        return { icon: AlertCircle, color: tokens.colors.error };
      case 'training':
        return { icon: TrendingUp, color: tokens.colors.primary };
      case 'test':
        return { icon: Target, color: tokens.colors.success };
      case 'tournament':
        return { icon: Trophy, color: tokens.colors.gold };
      case 'message':
        return { icon: MessageSquare, color: tokens.colors.primary };
      default:
        return { icon: Info, color: tokens.colors.steel };
    }
  };

  // Format relative time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Akkurat nå';
    if (diffMins < 60) return `${diffMins} min siden`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'time' : 'timer'} siden`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'dag' : 'dager'} siden`;
    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  };

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    if (filterType === 'unread') {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, filterType]);

  // Count unread
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Mark as read
  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/v1/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await fetch('/api/v1/notifications/read-all', { method: 'PUT' });
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/v1/notifications/${id}`, { method: 'DELETE' });
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

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
        <p style={{ color: tokens.colors.steel }}>Laster varsler...</p>
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
            Varsler
          </h1>
          {unreadCount > 0 && (
            <p
              style={{
                ...tokens.typography.subheadline,
                color: tokens.colors.steel,
                margin: '4px 0 0',
              }}
            >
              {unreadCount} uleste {unreadCount === 1 ? 'varsel' : 'varsler'}
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: 'transparent',
              color: tokens.colors.primary,
              border: `1px solid ${tokens.colors.primary}`,
              borderRadius: tokens.radius.md,
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <Check size={16} />
            Merk alle som lest
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '20px',
          padding: '4px',
          backgroundColor: tokens.colors.gray100,
          borderRadius: tokens.radius.md,
          width: 'fit-content',
        }}
      >
        {[
          { key: 'all', label: 'Alle' },
          { key: 'unread', label: `Uleste (${unreadCount})` },
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setFilterType(filter.key as any)}
            style={{
              padding: '8px 16px',
              backgroundColor:
                filterType === filter.key ? tokens.colors.white : 'transparent',
              color:
                filterType === filter.key
                  ? tokens.colors.charcoal
                  : tokens.colors.steel,
              border: 'none',
              borderRadius: tokens.radius.sm,
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow:
                filterType === filter.key ? tokens.shadows.card : 'none',
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div
        style={{
          backgroundColor: tokens.colors.white,
          borderRadius: tokens.radius.lg,
          border: `1px solid ${tokens.colors.gray300}`,
          overflow: 'hidden',
        }}
      >
        {filteredNotifications.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
            }}
          >
            <Bell
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
              Ingen varsler
            </p>
            <p
              style={{
                ...tokens.typography.subheadline,
                color: tokens.colors.steel,
                margin: 0,
              }}
            >
              {filterType === 'unread'
                ? 'Du har lest alle varslene dine'
                : 'Du har ingen varsler ennå'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => {
            const { icon: Icon, color } = getNotificationIcon(notification.type);
            return (
              <div
                key={notification.id}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '16px',
                  borderBottom:
                    index < filteredNotifications.length - 1
                      ? `1px solid ${tokens.colors.gray100}`
                      : 'none',
                  backgroundColor: notification.isRead
                    ? 'transparent'
                    : `${tokens.colors.primary}06`,
                  transition: 'background-color 0.15s',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: tokens.radius.md,
                    backgroundColor: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} color={color} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '12px',
                      marginBottom: '4px',
                    }}
                  >
                    <h3
                      style={{
                        ...tokens.typography.headline,
                        color: tokens.colors.charcoal,
                        fontWeight: notification.isRead ? 500 : 600,
                        margin: 0,
                      }}
                    >
                      {notification.title}
                      {notification.priority === 'high' && (
                        <span
                          style={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: tokens.colors.error,
                            marginLeft: '8px',
                          }}
                        />
                      )}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          ...tokens.typography.caption1,
                          color: tokens.colors.steel,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatTime(notification.createdAt)}
                      </span>
                      {!notification.isRead && (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: tokens.colors.primary,
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <p
                    style={{
                      ...tokens.typography.subheadline,
                      color: tokens.colors.steel,
                      margin: '0 0 10px',
                    }}
                  >
                    {notification.message}
                  </p>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    {notification.link && (
                      <Link
                        to={notification.link}
                        onClick={() => markAsRead(notification.id)}
                        style={{
                          ...tokens.typography.caption1,
                          color: tokens.colors.primary,
                          fontWeight: 500,
                          textDecoration: 'none',
                        }}
                      >
                        {notification.linkLabel || 'Se mer'}
                      </Link>
                    )}
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: 0,
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: tokens.colors.steel,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        <Check size={12} />
                        Merk som lest
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: tokens.colors.steel,
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={12} />
                      Slett
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
