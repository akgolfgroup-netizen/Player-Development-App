/**
 * Admin Panel Hooks
 * API integration for admin-only operations (requires admin role)
 */

import { useState, useCallback, useEffect } from 'react';
import apiClient from '../services/apiClient';

// ============================================================================
// SYSTEM STATUS
// ============================================================================

export function useSystemStatus(options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/admin/system/status');
      setData(response.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load system status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options.autoLoad !== false) {
      fetchStatus();
    }
  }, [fetchStatus, options.autoLoad]);

  return { status: data, loading, error, refetch: fetchStatus };
}

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export function useFeatureFlags(options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFlags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/admin/feature-flags');
      setData(response.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load feature flags');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options.autoLoad !== false) {
      fetchFlags();
    }
  }, [fetchFlags, options.autoLoad]);

  return { flags: data, loading, error, refetch: fetchFlags };
}

export function useCreateFeatureFlag() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createFlag = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post('/admin/feature-flags', data);
      return response.data.data;
    } catch (err) {
      setError(err.message || 'Failed to create feature flag');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createFlag, loading, error };
}

export function useUpdateFeatureFlag() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateFlag = useCallback(async (flagId, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.patch(`/admin/feature-flags/${flagId}`, data);
      return response.data.data;
    } catch (err) {
      setError(err.message || 'Failed to update feature flag');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateFlag, loading, error };
}

export function useDeleteFeatureFlag() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteFlag = useCallback(async (flagId) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.delete(`/admin/feature-flags/${flagId}`);
    } catch (err) {
      setError(err.message || 'Failed to delete feature flag');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteFlag, loading, error };
}

// ============================================================================
// SUPPORT CASES
// ============================================================================

export function useSupportCases(filters = {}, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filters.status) params.status = filters.status;

      const response = await apiClient.get('/admin/support-cases', { params });
      setData(response.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load support cases');
    } finally {
      setLoading(false);
    }
  }, [filters.status]);

  useEffect(() => {
    if (options.autoLoad !== false) {
      fetchCases();
    }
  }, [fetchCases, options.autoLoad]);

  return { cases: data, loading, error, refetch: fetchCases };
}

export function useSupportCase(caseId, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCase = useCallback(async () => {
    if (!caseId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/admin/support-cases/${caseId}`);
      setData(response.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load support case');
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    if (options.autoLoad !== false) {
      fetchCase();
    }
  }, [fetchCase, options.autoLoad]);

  return { supportCase: data, loading, error, refetch: fetchCase };
}

export function useCreateSupportCase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCase = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post('/admin/support-cases', data);
      return response.data.data;
    } catch (err) {
      setError(err.message || 'Failed to create support case');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createCase, loading, error };
}

export function useUpdateSupportCase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCase = useCallback(async (caseId, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.patch(`/admin/support-cases/${caseId}`, data);
      return response.data.data;
    } catch (err) {
      setError(err.message || 'Failed to update support case');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateCase, loading, error };
}

// ============================================================================
// TIERS
// ============================================================================

export function useTiers(options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTiers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/admin/tiers');
      setData(response.data.data?.tiers || []);
    } catch (err) {
      setError(err.message || 'Failed to load tiers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options.autoLoad !== false) {
      fetchTiers();
    }
  }, [fetchTiers, options.autoLoad]);

  return { tiers: data, loading, error, refetch: fetchTiers };
}

export function useUpdateTier() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTier = useCallback(async (tierId, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.patch(`/admin/tiers/${tierId}`, data);
      return response.data.data;
    } catch (err) {
      setError(err.message || 'Failed to update tier');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTier, loading, error };
}
