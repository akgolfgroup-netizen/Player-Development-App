import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import Aarsplan from './Aarsplan';

const AarsplanContainer = () => {
  const { user } = useAuth();
  const [state, setState] = useState('loading');
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    if (user) {
      fetchPlans();
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      setState('loading');
      setError(null);

      const response = await apiClient.get('/training-plan');
      setPlans(response.data);
      setState(response.data.length === 0 ? 'empty' : 'idle');
    } catch (err) {
      console.error('Error fetching annual plans:', err);
      setError(err);
      setState('error');
    }
  };

  if (state === 'loading') {
    return <LoadingState message="Laster årsplaner..." />;
  }

  if (state === 'error') {
    return (
      <ErrorState
        errorType={error?.type}
        message={error?.message || 'Kunne ikke laste årsplaner'}
        onRetry={fetchPlans}
      />
    );
  }

  if (state === 'empty') {
    return (
      <EmptyState
        title="Ingen årsplaner"
        message="Du har ingen opprettede treningsplaner ennå."
      />
    );
  }

  return <Aarsplan plans={plans} onRefresh={fetchPlans} />;
};

export default AarsplanContainer;
