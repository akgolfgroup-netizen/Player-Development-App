/**
 * Club Speed Calibration Hooks
 * API integration for club speed calibration (3 shots per club)
 */

import { useState, useCallback, useEffect } from 'react';
import apiClient from '../services/apiClient';

// ============================================================================
// CALIBRATION
// ============================================================================

export function usePlayerCalibration(playerId, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCalibration = useCallback(async () => {
    if (!playerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/calibration/player/${playerId}`);
      setData(response.data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setData(null); // No calibration yet - this is okay
        setError(null);
      } else {
        setError(err.message || 'Failed to load calibration');
      }
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    if (options.autoLoad !== false) {
      fetchCalibration();
    }
  }, [fetchCalibration, options.autoLoad]);

  return { calibration: data, loading, error, refetch: fetchCalibration };
}

export function useCreateCalibration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCalibration = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post('/calibration', data);
      return response.data.data;
    } catch (err) {
      setError(err.message || 'Failed to create calibration');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createCalibration, loading, error };
}

export function useUpdateCalibration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCalibration = useCallback(async (playerId, data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.put(`/calibration/player/${playerId}`, data);
      return response.data.data;
    } catch (err) {
      setError(err.message || 'Failed to update calibration');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateCalibration, loading, error };
}

export function useDeleteCalibration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteCalibration = useCallback(async (playerId) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.delete(`/calibration/player/${playerId}`);
    } catch (err) {
      setError(err.message || 'Failed to delete calibration');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteCalibration, loading, error };
}

// Mobile calibration session hooks
export function useStartCalibrationSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post('/calibration/start');
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to start calibration session');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { startSession, loading, error };
}

export function useSubmitCalibrationSamples() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitSamples = useCallback(async (sessionId, samples) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post('/calibration/submit', { sessionId, samples });
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to submit calibration samples');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitSamples, loading, error };
}
