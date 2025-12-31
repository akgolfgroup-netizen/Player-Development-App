/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AK Golf Academy - Notification Center
 * Design System v3.0 - Blue Palette 01
 *
 * Viser alle varsler og oppdateringer for spilleren.
 * Støtter ulike varseltyper og handlinger.
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Trophy,
  MessageSquare,
  Target,
  TrendingUp,
  Star,
  Check,
  Video,
  PlayCircle,
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import Button from '../../ui/primitives/Button';

interface NotificationCenterProps {
  userId?: string;
}

export default function NotificationCenter({ userId }: NotificationCenterProps) {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');

  // Get icon for notification type
  const getNotificationIcon = (notificationType: string) => {
    switch (notificationType) {
      case 'video_shared':
        return { icon: PlayCircle, color: 'var(--accent)' };
      case 'video_reviewed':
        return { icon: CheckCircle, color: 'var(--success)' };
      case 'comment_created':
        return { icon: MessageSquare, color: 'var(--accent)' };
      case 'achievement':
        return { icon: Star, color: 'var(--achievement)' };
      case 'success':
        return { icon: CheckCircle, color: 'var(--success)' };
      case 'warning':
        return { icon: AlertCircle, color: 'var(--warning)' };
      case 'error':
        return { icon: AlertCircle, color: 'var(--error)' };
      case 'training':
        return { icon: TrendingUp, color: 'var(--accent)' };
      case 'test':
        return { icon: Target, color: 'var(--success)' };
      case 'tournament':
        return { icon: Trophy, color: 'var(--achievement)' };
      case 'message':
        return { icon: MessageSquare, color: 'var(--accent)' };
      default:
        return { icon: Video, color: 'var(--text-secondary)' };
    }
  };

  // Get link for notification based on type and metadata
  const getNotificationLink = (notification: any) => {
    const metadata = notification.metadata || {};
    switch (notification.notificationType) {
      case 'video_shared':
      case 'video_reviewed':
      case 'comment_created':
        return metadata.videoId ? `/videos/${metadata.videoId}` : '/videos';
      default:
        return null;
    }
  };

  // Get link label for notification
  const getNotificationLinkLabel = (notificationType: string) => {
    switch (notificationType) {
      case 'video_shared':
        return 'Se video';
      case 'video_reviewed':
        return 'Se tilbakemelding';
      case 'comment_created':
        return 'Se kommentar';
      default:
        return 'Se mer';
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
      return notifications.filter((n: any) => !n.readAt);
    }
    return notifications;
  }, [notifications, filterType]);

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
        <p style={{ color: 'var(--text-secondary)' }}>Laster varsler...</p>
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
              fontSize: '28px', lineHeight: '34px', fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Varsler
          </h1>
          {unreadCount > 0 && (
            <p
              style={{
                fontSize: '15px', lineHeight: '20px',
                color: 'var(--text-secondary)',
                margin: '4px 0 0',
              }}
            >
              {unreadCount} uleste {unreadCount === 1 ? 'varsel' : 'varsler'}
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={markAllAsRead}
            leftIcon={<Check size={16} />}
          >
            Merk alle som lest
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '20px',
          padding: '4px',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
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
                filterType === filter.key ? 'var(--bg-primary)' : 'transparent',
              color:
                filterType === filter.key
                  ? 'var(--text-primary)'
                  : 'var(--text-secondary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow:
                filterType === filter.key ? 'var(--shadow-card)' : 'none',
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-lg)',
          border: `1px solid ${'var(--border-default)'}`,
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
              style={{ color: 'var(--border-default)', marginBottom: '16px' }}
            />
            <p
              style={{
                fontSize: '17px', lineHeight: '22px', fontWeight: 600,
                color: 'var(--text-primary)',
                margin: '0 0 8px',
              }}
            >
              Ingen varsler
            </p>
            <p
              style={{
                fontSize: '15px', lineHeight: '20px',
                color: 'var(--text-secondary)',
                margin: 0,
              }}
            >
              {filterType === 'unread'
                ? 'Du har lest alle varslene dine'
                : 'Du har ingen varsler ennå'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification: any, index: number) => {
            const { icon: Icon, color } = getNotificationIcon(notification.notificationType);
            const link = getNotificationLink(notification);
            const linkLabel = getNotificationLinkLabel(notification.notificationType);
            const isRead = !!notification.readAt;
            return (
              <div
                key={notification.id}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '16px',
                  borderBottom:
                    index < filteredNotifications.length - 1
                      ? `1px solid ${'var(--bg-tertiary)'}`
                      : 'none',
                  backgroundColor: isRead
                    ? 'transparent'
                    : `${'var(--accent)'}06`,
                  transition: 'background-color 0.15s',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-md)',
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
                        fontSize: '17px', lineHeight: '22px',
                        color: 'var(--text-primary)',
                        fontWeight: isRead ? 500 : 600,
                        margin: 0,
                      }}
                    >
                      {notification.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '13px', lineHeight: '18px',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatTime(notification.createdAt)}
                      </span>
                      {!isRead && (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent)',
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: '15px', lineHeight: '20px',
                      color: 'var(--text-secondary)',
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
                    {link && (
                      <Link
                        to={link}
                        onClick={() => markAsRead(notification.id)}
                        style={{
                          fontSize: '13px', lineHeight: '18px',
                          color: 'var(--accent)',
                          fontWeight: 500,
                          textDecoration: 'none',
                        }}
                      >
                        {linkLabel}
                      </Link>
                    )}
                    {!isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: 0,
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        <Check size={12} />
                        Merk som lest
                      </button>
                    )}
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
