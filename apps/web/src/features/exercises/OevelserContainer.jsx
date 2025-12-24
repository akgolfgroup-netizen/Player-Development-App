import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import Oevelser from './Øvelser';

const OevelserContainer = () => {
  const { user } = useAuth();
  const [state, setState] = useState('loading');
  const [error, setError] = useState(null);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    if (user) {
      fetchExercises();
    }
  }, [user]);

  const fetchExercises = async () => {
    try {
      setState('loading');
      setError(null);
      const response = await apiClient.get('/exercises');
      setExercises(response.data);
      setState(response.data.length === 0 ? 'empty' : 'idle');
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err);
      setState('error');
    }
  };

  if (state === 'loading') {
    return <LoadingState message="Laster øvelser..." />;
  }

  if (state === 'error') {
    return (
      <ErrorState
        errorType={error?.type}
        message={error?.message || 'Kunne ikke laste øvelser'}
        onRetry={fetchExercises}
      />
    );
  }

  if (state === 'empty') {
    return (
      <EmptyState
        title="Ingen øvelser"
        message="Du har ikke lagt til noen øvelser ennå"
      />
    );
  }

  return <Oevelser exercises={exercises} />;
};

export default OevelserContainer;
