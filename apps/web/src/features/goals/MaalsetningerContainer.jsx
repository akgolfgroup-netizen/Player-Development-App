import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import LoadingState from '../../components/ui/LoadingState';
import Maalsetninger from './Målsetninger';

const MaalsetningerContainer = () => {
  const { user } = useAuth();
  const [state, setState] = useState('loading');
  const [goals, setGoals] = useState(null);

  const fetchGoals = useCallback(async () => {
    try {
      setState('loading');
      const response = await apiClient.get('/goals');
      // Handle nested data structure from API
      const goalsData = response.data?.data || response.data || [];
      setGoals(goalsData.length > 0 ? goalsData : null);
      setState('idle');
    } catch (err) {
      console.error('Error fetching goals:', err);
      // Use null to let component use its built-in fallback data
      setGoals(null);
      setState('idle');
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchGoals();
    } else {
      // No user - use fallback data immediately
      setGoals(null);
      setState('idle');
    }
  }, [user, fetchGoals]);

  if (state === 'loading') {
    return <LoadingState message="Laster målsetninger..." />;
  }

  // Pass goals to component - it has built-in fallback data when goals is null
  return <Maalsetninger goals={goals} />;
};

export default MaalsetningerContainer;
