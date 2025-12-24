import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import AchievementsDashboard from './AchievementsDashboard';

const AchievementsDashboardContainer = () => {
  const { user } = useAuth();
  const [state, setState] = useState('loading');
  const [error, setError] = useState(null);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      setState('loading');
      setError(null);
      const response = await apiClient.get('/api/v1/achievements');
      setAchievements(response.data);
      setState(response.data.length === 0 ? 'empty' : 'idle');
    } catch (err) {
      console.error('Error fetching achievements:', err);
      // If 404, show empty state (endpoint not implemented yet)
      if (err.response?.status === 404) {
        setAchievements([]);
        setState('empty');
      } else {
        setError(err);
        setState('error');
      }
    }
  };

  if (state === 'loading') {
    return <LoadingState message="Laster prestasjoner..." />;
  }

  if (state === 'error') {
    return (
      <ErrorState
        errorType={error?.type}
        message={error?.message || 'Kunne ikke laste prestasjoner'}
        onRetry={fetchAchievements}
      />
    );
  }

  if (state === 'empty') {
    return (
      <EmptyState
        title="Ingen prestasjoner"
        message="Du har ikke låst opp noen prestasjoner ennå"
      />
    );
  }

  return <AchievementsDashboard achievements={achievements} />;
};

export default AchievementsDashboardContainer;
