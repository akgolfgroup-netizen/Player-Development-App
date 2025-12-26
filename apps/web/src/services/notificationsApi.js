/**
 * Notifications API Service
 * Handles all notification-related API calls
 */

import apiClient from './apiClient';

/**
 * Get notifications for the current user
 * @param {Object} options
 * @param {boolean} options.unreadOnly - Filter to only unread notifications
 * @returns {Promise<{ notifications: Array, unreadCount: number }>}
 */
export async function getNotifications({ unreadOnly = false } = {}) {
  const params = new URLSearchParams();
  if (unreadOnly) {
    params.append('unreadOnly', '1');
  }

  const response = await apiClient.get(`/notifications?${params.toString()}`);
  return response.data.data;
}

/**
 * Mark a notification as read
 * @param {string} notificationId - The notification ID
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function markNotificationRead(notificationId) {
  const response = await apiClient.patch(`/notifications/${notificationId}/read`);
  return response.data;
}

/**
 * Mark all notifications as read
 * @returns {Promise<{ success: boolean, message: string, count: number }>}
 */
export async function markAllNotificationsRead() {
  const response = await apiClient.post('/notifications/read-all');
  return response.data;
}

export default {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};
