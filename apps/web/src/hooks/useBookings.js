/**
 * useBookings - Hooks for player booking system
 *
 * Provides access to:
 * - Coach availability
 * - Booking requests (create, view, cancel)
 * - Player's bookings list
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

/**
 * Hook for fetching coach availability
 * @param {string} coachId - Coach ID (optional, fetches for player's coaches if not provided)
 * @param {object} dateRange - { startDate, endDate }
 */
export function useCoachAvailability(coachId, dateRange) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAvailability = useCallback(async () => {
    if (!dateRange) return;

    try {
      setLoading(true);
      setError(null);

      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };

      if (coachId) {
        params.coachId = coachId;
      }

      const response = await apiClient.get('/availability', { params });
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load availability');
      console.error('[Bookings] Error fetching availability:', err);
    } finally {
      setLoading(false);
    }
  }, [coachId, dateRange]);

  useEffect(() => {
    if (dateRange) {
      fetchAvailability();
    }
  }, [fetchAvailability, dateRange]);

  return {
    availability: data || [],
    loading,
    error,
    refetch: fetchAvailability,
  };
}

/**
 * Hook for creating a booking request
 */
export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBooking = useCallback(async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post('/bookings', bookingData);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create booking');
      console.error('[Bookings] Error creating booking:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createBooking, loading, error };
}

/**
 * Hook for fetching player's bookings
 * @param {string} status - Filter by status: 'pending', 'confirmed', 'cancelled', 'completed'
 */
export function useMyBookings(status) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = status ? { status } : {};
      const response = await apiClient.get('/bookings', { params });

      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
      console.error('[Bookings] Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings: data?.bookings || [],
    loading,
    error,
    refetch: fetchBookings,
  };
}

/**
 * Hook for cancelling a booking
 */
export function useCancelBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelBooking = useCallback(async (bookingId, reason) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.patch(`/bookings/${bookingId}/cancel`, { reason });
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to cancel booking');
      console.error('[Bookings] Error cancelling booking:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cancelBooking, loading, error };
}

/**
 * Hook for updating booking status (coach only, but included for completeness)
 */
export function useUpdateBookingStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateStatus = useCallback(async (bookingId, status, notes) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.patch(`/bookings/${bookingId}/status`, {
        status,
        notes
      });
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update booking status');
      console.error('[Bookings] Error updating status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateStatus, loading, error };
}

/**
 * Hook for fetching player's coaches
 */
export function usePlayerCoaches() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/players/me/coaches');
        setData(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load coaches');
        console.error('[Bookings] Error fetching coaches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  return {
    coaches: data?.coaches || [],
    loading,
    error,
  };
}

export default useMyBookings;
