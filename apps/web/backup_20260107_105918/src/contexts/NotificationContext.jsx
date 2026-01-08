import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

// Push notification permission status
const PUSH_PERMISSION = {
  DEFAULT: 'default',
  GRANTED: 'granted',
  DENIED: 'denied',
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [pushPermission, setPushPermission] = useState(PUSH_PERMISSION.DEFAULT);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Check push notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPushPermission(Notification.permission);
    }
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Request push notification permission
  const requestPushPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      return permission === PUSH_PERMISSION.GRANTED;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }, []);

  // Show a browser push notification
  const showPushNotification = useCallback((title, options = {}) => {
    if (pushPermission !== PUSH_PERMISSION.GRANTED) {
      console.warn('Push notifications not permitted');
      return null;
    }

    const defaultOptions = {
      icon: '/logo192.png',
      badge: '/badge-icon.png',
      vibrate: [200, 100, 200],
      requireInteraction: false,
      ...options,
    };

    try {
      const notification = new Notification(title, defaultOptions);

      notification.onclick = () => {
        window.focus();
        if (options.onClick) options.onClick();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Failed to show push notification:', error);
      return null;
    }
  }, [pushPermission]);

  // Show in-app notification (toast)
  const showNotification = useCallback((message, type = 'info', duration = 3000, options = {}) => {
    const id = Date.now();
    const notification = {
      id,
      message,
      type,
      title: options.title,
      action: options.action,
      actionLabel: options.actionLabel,
      persistent: duration === 0,
      timestamp: new Date(),
    };

    setNotifications(prev => [...prev, notification]);

    // Also show push notification if enabled and app is in background
    if (options.showPush && document.hidden && pushPermission === PUSH_PERMISSION.GRANTED) {
      showPushNotification(options.title || 'TIER Golf Academy', {
        body: message,
        tag: options.tag,
        onClick: options.action,
      });
    }

    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }

    return id;
  }, [pushPermission, showPushNotification]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Real-time updates with Server-Sent Events
  const connectRealtime = useCallback((userId, token) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    if (!userId || !token) {
      console.warn('Cannot connect to realtime: missing userId or token');
      return;
    }

    try {
      // Use notifications/stream endpoint with token in query param
      // (EventSource doesn't support custom headers)
      const apiUrl = process.env.REACT_APP_API_URL || '/api/v1';
      const eventSource = new EventSource(
        `${apiUrl}/notifications/stream?token=${token}`
      );

      eventSource.onopen = () => {
        console.log('Realtime connection established');
        setRealtimeConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleRealtimeMessage(data);
        } catch (error) {
          console.error('Failed to parse realtime message:', error);
        }
      };

      eventSource.onerror = () => {
        console.warn('Realtime connection error, attempting reconnect...');
        setRealtimeConnected(false);
        eventSource.close();

        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isOnline) {
            connectRealtime(userId, token);
          }
        }, 5000);
      };

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error('Failed to connect to realtime:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const disconnectRealtime = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setRealtimeConnected(false);
  }, []);

  // Handle incoming realtime messages
  const handleRealtimeMessage = useCallback((data) => {
    switch (data.type) {
      case 'notification':
        showNotification(data.message, data.notificationType || 'info', data.duration, {
          title: data.title,
          showPush: true,
          tag: data.id,
        });
        setUnreadCount(prev => prev + 1);
        break;

      case 'message':
        showNotification(`Ny melding fra ${data.from}`, 'info', 5000, {
          title: 'Ny melding',
          showPush: true,
          action: () => window.location.href = `/messages/${data.conversationId}`,
          actionLabel: 'Vis melding',
        });
        break;

      case 'session_reminder':
        showNotification(
          `Treningsokt "${data.sessionTitle}" starter om ${data.minutesUntil} minutter`,
          'warning',
          0,
          {
            title: 'Paominnelse',
            showPush: true,
            action: () => window.location.href = `/sessions/${data.sessionId}`,
            actionLabel: 'Vis okt',
          }
        );
        break;

      case 'achievement':
        showNotification(
          `Du har lest opp "${data.achievementTitle}"!`,
          'success',
          5000,
          {
            title: 'Ny prestasjon!',
            showPush: true,
          }
        );
        break;

      case 'goal_progress':
        showNotification(
          data.message,
          'info',
          4000,
          {
            title: 'Malframgang',
            showPush: false,
          }
        );
        break;

      case 'coach_note':
        showNotification(
          `Treneren din har lagt til et notat`,
          'info',
          5000,
          {
            title: 'Nytt trenernotat',
            showPush: true,
            action: () => window.location.href = '/notater',
            actionLabel: 'Se notat',
          }
        );
        break;

      default:
        console.log('Unknown realtime message type:', data.type);
    }
  }, [showNotification]);

  // Mark notifications as read
  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectRealtime();
    };
  }, [disconnectRealtime]);

  const value = {
    // In-app notifications
    notifications,
    showNotification,
    removeNotification,
    clearAllNotifications,
    success: (message, duration, options) => showNotification(message, 'success', duration, options),
    error: (message, duration, options) => showNotification(message, 'error', duration, options),
    info: (message, duration, options) => showNotification(message, 'info', duration, options),
    warning: (message, duration, options) => showNotification(message, 'warning', duration, options),

    // Push notifications
    pushPermission,
    requestPushPermission,
    showPushNotification,
    isPushSupported: 'Notification' in window,
    isPushEnabled: pushPermission === PUSH_PERMISSION.GRANTED,

    // Real-time updates
    connectRealtime,
    disconnectRealtime,
    realtimeConnected,
    isOnline,

    // Unread count
    unreadCount,
    markAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
