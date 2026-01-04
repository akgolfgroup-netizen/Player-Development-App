/**
 * useArchive Hook
 * Manages archived items - listing, archiving, restoring, and deleting
 */

import { useState, useCallback, useEffect } from 'react';
import { archiveAPI, ArchivedItem } from '../services/api';

interface UseArchiveReturn {
  items: ArchivedItem[];
  total: number;
  countByType: Record<string, number>;
  loading: boolean;
  error: string | null;
  fetchItems: (entityType?: string) => Promise<void>;
  fetchCount: () => Promise<void>;
  archiveItem: (entityType: string, entityId: string, reason?: string) => Promise<ArchivedItem | null>;
  restoreItem: (id: string) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  bulkDelete: (ids: string[]) => Promise<number>;
}

export function useArchive(): UseArchiveReturn {
  const [items, setItems] = useState<ArchivedItem[]>([]);
  const [total, setTotal] = useState(0);
  const [countByType, setCountByType] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async (entityType?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await archiveAPI.list(entityType);
      if (response.data?.data) {
        setItems(response.data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke hente arkiverte elementer');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCount = useCallback(async () => {
    try {
      const response = await archiveAPI.getCount();
      if (response.data?.data) {
        setTotal(response.data.data.total);
        setCountByType(response.data.data.byType);
      }
    } catch (err) {
      console.error('Failed to fetch archive count:', err);
    }
  }, []);

  const archiveItem = useCallback(async (entityType: string, entityId: string, reason?: string): Promise<ArchivedItem | null> => {
    try {
      const response = await archiveAPI.archive({ entityType, entityId, reason });
      if (response.data?.data) {
        const newItem = response.data.data;
        setItems(prev => [newItem, ...prev]);
        setTotal(prev => prev + 1);
        return newItem;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke arkivere element');
      return null;
    }
  }, []);

  const restoreItem = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await archiveAPI.restore(id);
      if (response.data?.data?.restored) {
        setItems(prev => prev.filter(item => item.id !== id));
        setTotal(prev => Math.max(0, prev - 1));
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke gjenopprette element');
      return false;
    }
  }, []);

  const deleteItem = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await archiveAPI.delete(id);
      if (response.data?.data?.deleted) {
        setItems(prev => prev.filter(item => item.id !== id));
        setTotal(prev => Math.max(0, prev - 1));
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke slette element');
      return false;
    }
  }, []);

  const bulkDelete = useCallback(async (ids: string[]): Promise<number> => {
    try {
      const response = await archiveAPI.bulkDelete(ids);
      if (response.data?.data) {
        const deleted = response.data.data.deleted;
        setItems(prev => prev.filter(item => !ids.includes(item.id)));
        setTotal(prev => Math.max(0, prev - deleted));
        return deleted;
      }
      return 0;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke slette elementer');
      return 0;
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchItems();
    fetchCount();
  }, [fetchItems, fetchCount]);

  return {
    items,
    total,
    countByType,
    loading,
    error,
    fetchItems,
    fetchCount,
    archiveItem,
    restoreItem,
    deleteItem,
    bulkDelete,
  };
}

export default useArchive;
