/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AK Golf Academy - Notification Center
 *
 * Archetype: A - List/Index Page
 * Purpose: Display all notifications and updates for the player
 * Supports various notification types and actions
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 * (except dynamic icon colors which require runtime values)
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
import { SectionTitle, SubSectionTitle } from '../../components/typography';

// ============================================================================
// TYPES
// ============================================================================

interface NotificationCenterProps {
  userId?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function NotificationCenter({ userId }: NotificationCenterProps) {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');

  const filteredNotifications = useMemo(() => {
    if (filterType === 'unread') {
      return notifications.filter((n: any) => !n.readAt);
    }
    return notifications;
  }, [notifications, filterType]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="w-10 h-10 border-[3px] border-ak-border-default border-t-ak-brand-primary rounded-full mx-auto mb-4 animate-spin" />
        <p className="text-ak-text-secondary">Laster varsler...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <SectionTitle className="text-[28px] leading-[34px] font-bold text-ak-text-primary m-0">
            Varsler
          </SectionTitle>
          {unreadCount > 0 && (
            <p className="text-[15px] leading-5 text-ak-text-secondary mt-1 mb-0">
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
      <div className="flex gap-1 mb-5 p-1 bg-ak-surface-subtle rounded-lg w-fit">
        {[
          { key: 'all', label: 'Alle' },
          { key: 'unread', label: `Uleste (${unreadCount})` },
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setFilterType(filter.key as any)}
            className={`px-4 py-2 border-none rounded-md text-sm font-medium cursor-pointer transition-all ${
              filterType === filter.key
                ? 'bg-ak-surface-base text-ak-text-primary shadow-sm'
                : 'bg-transparent text-ak-text-secondary'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="bg-ak-surface-base rounded-xl border border-ak-border-default overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <Bell size={48} className="text-ak-border-default mb-4 mx-auto" />
            <p className="text-[17px] leading-[22px] font-semibold text-ak-text-primary mb-2">
              Ingen varsler
            </p>
            <p className="text-[15px] leading-5 text-ak-text-secondary m-0">
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
                className={`flex gap-3.5 p-4 transition-colors ${
                  index < filteredNotifications.length - 1
                    ? 'border-b border-ak-surface-subtle'
                    : ''
                } ${isRead ? 'bg-transparent' : 'bg-ak-brand-primary/5'}`}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon size={20} color={color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <SubSectionTitle
                      className={`text-[17px] leading-[22px] text-ak-text-primary m-0 ${
                        isRead ? 'font-medium' : 'font-semibold'
                      }`}
                    >
                      {notification.title}
                    </SubSectionTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] leading-[18px] text-ak-text-secondary whitespace-nowrap">
                        {formatTime(notification.createdAt)}
                      </span>
                      {!isRead && (
                        <div className="w-2 h-2 rounded-full bg-ak-brand-primary" />
                      )}
                    </div>
                  </div>

                  <p className="text-[15px] leading-5 text-ak-text-secondary mb-2.5">
                    {notification.message}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {link && (
                      <Link
                        to={link}
                        onClick={() => markAsRead(notification.id)}
                        className="text-[13px] leading-[18px] text-ak-brand-primary font-medium no-underline hover:underline"
                      >
                        {linkLabel}
                      </Link>
                    )}
                    {!isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="flex items-center gap-1 p-0 bg-transparent border-none text-ak-text-secondary text-xs cursor-pointer hover:text-ak-text-primary"
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
