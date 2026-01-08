/**
 * useNotifications Hook
 * Fetches and manages notifications with polling
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as notificationsApi from '../services/notificationsApi';

const POLL_INTERVAL = 45000; // 45 seconds

/**
 * Hook for managing notifications with automatic polling
 * @param {Object} options
 * @param {boolean} options.autoFetch - Whether to fetch on mount (default: true)
 * @param {boolean} options.polling - Whether to enable polling (default: true)
 * @param {number} options.pollInterval - Polling interval in ms (default: 45000)
 */
export function useNotifications(options = {}) {
  const {
    autoFetch = true,
    polling = true,
    pollInterval = POLL_INTERVAL,
  } = options;

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollIntervalRef = useRef(null);

  /**
   * Fetch notifications from API
   */
  const fetchNotifications = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await notificationsApi.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('[useNotifications] Failed to fetch:', err);
      setError(err.message || 'Kunne ikke laste varsler');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Mark a single notification as read
   */
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationsApi.markNotificationRead(notificationId);

      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, readAt: new Date().toISOString() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('[useNotifications] Failed to mark as read:', err);
      throw err;
    }
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsApi.markAllNotificationsRead();

      // Update local state
      const now = new Date().toISOString();
      setNotifications((prev) =>
        prev.map((n) => (n.readAt ? n : { ...n, readAt: now }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('[useNotifications] Failed to mark all as read:', err);
      throw err;
    }
  }, []);

  /**
   * Refresh notifications
   */
  const refresh = useCallback(() => {
    return fetchNotifications(false);
  }, [fetchNotifications]);

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchNotifications();
    }
  }, [autoFetch, fetchNotifications]);

  // Set up polling
  useEffect(() => {
    if (polling && pollInterval > 0) {
      pollIntervalRef.current = setInterval(() => {
        fetchNotifications(false); // Silent refresh (no loading state)
      }, pollInterval);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [polling, pollInterval, fetchNotifications]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh,
  };
}

export default useNotifications;
