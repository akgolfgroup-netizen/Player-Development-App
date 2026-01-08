/**
 * Intake Form Hooks
 * Hooks for player intake form submission and retrieval
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api';

/**
 * Get player's intake form
 */
export function usePlayerIntake(playerId, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIntake = useCallback(async () => {
    if (!playerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/intake/player/${playerId}`);
      setData(response.data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        // No intake form found - this is okay, player hasn't filled it yet
        setData(null);
      } else {
        setError(err.message || 'Failed to load intake form');
        console.error('[Intake] Error fetching intake:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    if (options.enabled !== false) {
      fetchIntake();
    }
  }, [fetchIntake, options.enabled]);

  return {
    intake: data,
    loading,
    error,
    refetch: fetchIntake,
  };
}

/**
 * Submit or update intake form
 */
export function useSubmitIntake() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = useCallback(async (playerId, formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post('/intake', {
        playerId,
        ...formData,
      });

      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to submit intake form';
      setError(errorMessage);
      console.error('[Intake] Error submitting intake:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    submit,
    loading,
    error,
  };
}

/**
 * Generate training plan from completed intake
 */
export function useGeneratePlanFromIntake() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async (intakeId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post(`/intake/${intakeId}/generate-plan`);

      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to generate plan';
      setError(errorMessage);
      console.error('[Intake] Error generating plan:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    generate,
    loading,
    error,
  };
}

/**
 * Get all intakes for a tenant (admin)
 */
export function useTenantIntakes(tenantId, filters = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIntakes = useCallback(async () => {
    if (!tenantId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (filters.isComplete !== undefined) {
        params.isComplete = String(filters.isComplete);
      }
      if (filters.hasGeneratedPlan !== undefined) {
        params.hasGeneratedPlan = String(filters.hasGeneratedPlan);
      }

      const response = await apiClient.get(`/intake/tenant/${tenantId}`, { params });
      setData(response.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load intakes');
      console.error('[Intake] Error fetching tenant intakes:', err);
    } finally {
      setLoading(false);
    }
  }, [tenantId, filters.isComplete, filters.hasGeneratedPlan]);

  useEffect(() => {
    fetchIntakes();
  }, [fetchIntakes]);

  return {
    intakes: data,
    loading,
    error,
    refetch: fetchIntakes,
  };
}

/**
 * Delete intake form
 */
export function useDeleteIntake() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteIntake = useCallback(async (intakeId) => {
    try {
      setLoading(true);
      setError(null);

      await apiClient.delete(`/intake/${intakeId}`);

      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to delete intake';
      setError(errorMessage);
      console.error('[Intake] Error deleting intake:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteIntake,
    loading,
    error,
  };
}
