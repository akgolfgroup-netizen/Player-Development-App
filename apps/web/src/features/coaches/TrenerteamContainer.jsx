import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import Trenerteam from './Trenerteam';

const TrenerteamContainer = () => {
  const { user } = useAuth();
  const [state, setState] = useState('loading');
  const [error, setError] = useState(null);
  const [coaches, setCoaches] = useState([]);

  const fetchCoaches = useCallback(async () => {
    try {
      setState('loading');
      setError(null);

      // Players see their assigned coaches, coaches see their team
      const endpoint = user.role === 'player'
        ? '/coaches/my-team'
        : '/coaches/team';

      const response = await apiClient.get(endpoint);
      setCoaches(response.data);
      setState(response.data.length === 0 ? 'empty' : 'idle');
    } catch (err) {
      console.error('Error fetching coaches:', err);
      setError(err);
      setState('error');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchCoaches();
    }
  }, [user, fetchCoaches]);

  if (state === 'loading') {
    return <LoadingState message="Laster trenerteam..." />;
  }

  if (state === 'error') {
    return (
      <ErrorState
        errorType={error?.type}
        message={error?.message || 'Kunne ikke laste trenerteam'}
        onRetry={fetchCoaches}
      />
    );
  }

  if (state === 'empty') {
    return (
      <EmptyState
        title="Ingen trenere"
        message="Du har ikke noen trenere tilknyttet ennå"
      />
    );
  }

  return <Trenerteam coaches={coaches} />;
};

export default TrenerteamContainer;
