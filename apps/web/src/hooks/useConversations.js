/**
 * useConversations - Hooks for managing conversations and messages
 *
 * Provides access to:
 * - Conversation list
 * - Conversation details with messages
 * - Message sending/editing/deleting
 * - Real-time updates via polling
 * - Unread count tracking
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

/**
 * Hook for fetching all conversations
 */
export function useConversations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/conversations');
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load conversations');
      console.error('[Conversations] Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations: data?.conversations || [],
    total: data?.total || 0,
    loading,
    error,
    refetch: fetchConversations,
  };
}

/**
 * Hook for fetching a single conversation with messages
 * @param {string} conversationId - Conversation ID
 * @param {object} options - Query options (limit, before)
 */
export function useConversation(conversationId, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConversation = useCallback(async () => {
    if (!conversationId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(`/conversations/${conversationId}`, {
        params: options,
      });

      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load conversation');
      console.error('[Conversations] Error fetching conversation:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, options.limit, options.before]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  return {
    conversation: data?.conversation || null,
    messages: data?.messages || [],
    participants: data?.participants || [],
    loading,
    error,
    refetch: fetchConversation,
  };
}

/**
 * Hook for creating a new conversation
 */
export function useCreateConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createConversation = useCallback(async (conversationData) => {
    if (!conversationData) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post('/conversations', conversationData);

      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create conversation');
      console.error('[Conversations] Error creating conversation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createConversation,
    loading,
    error,
  };
}

/**
 * Hook for sending a message
 */
export function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (conversationId, messageData) => {
    if (!conversationId || !messageData) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post(
        `/conversations/${conversationId}/messages`,
        messageData
      );

      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to send message');
      console.error('[Conversations] Error sending message:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sendMessage,
    loading,
    error,
  };
}

/**
 * Hook for editing a message
 */
export function useEditMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editMessage = useCallback(async (messageId, content) => {
    if (!messageId || !content) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.patch(`/messages/${messageId}`, {
        content,
      });

      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to edit message');
      console.error('[Conversations] Error editing message:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    editMessage,
    loading,
    error,
  };
}

/**
 * Hook for deleting a message
 */
export function useDeleteMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteMessage = useCallback(async (messageId) => {
    if (!messageId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.delete(`/messages/${messageId}`);

      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to delete message');
      console.error('[Conversations] Error deleting message:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteMessage,
    loading,
    error,
  };
}

/**
 * Hook for marking messages as read
 */
export function useMarkAsRead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const markAsRead = useCallback(async (conversationId) => {
    if (!conversationId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post(`/conversations/${conversationId}/read`);

      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to mark as read');
      console.error('[Conversations] Error marking as read:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    markAsRead,
    loading,
    error,
  };
}

/**
 * Hook for getting unread count
 */
export function useUnreadCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/unread-count');

      setCount(response.data.count || 0);
    } catch (err) {
      setError(err.message || 'Failed to get unread count');
      console.error('[Conversations] Error fetching unread count:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();

    // Poll every 30 seconds for unread count
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return {
    unreadCount: count,
    loading,
    error,
    refetch: fetchUnreadCount,
  };
}
