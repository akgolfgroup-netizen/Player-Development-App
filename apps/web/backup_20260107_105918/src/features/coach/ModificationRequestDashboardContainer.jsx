import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import ModificationRequestDashboard from './ModificationRequestDashboard';

const ModificationRequestDashboardContainer = () => {
  const { user } = useAuth();
  const [state, setState] = useState('loading');
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (user) {
      fetchModificationRequests();
    }
  }, [user]);

  const fetchModificationRequests = async () => {
    try {
      setState('loading');
      setError(null);
      const response = await apiClient.get('/api/v1/coaches/modification-requests');
      setRequests(response.data);
      setState(response.data.length === 0 ? 'empty' : 'idle');
    } catch (err) {
      console.error('Error fetching modification requests:', err);
      // If 404, show empty state (endpoint not implemented yet)
      if (err.response?.status === 404) {
        setRequests([]);
        setState('empty');
      } else {
        setError(err);
        setState('error');
      }
    }
  };

  if (state === 'loading') {
    return <LoadingState message="Laster endringsforespørsler..." />;
  }

  if (state === 'error') {
    return (
      <ErrorState
        errorType={error?.type}
        message={error?.message || 'Kunne ikke laste endringsforespørsler'}
        onRetry={fetchModificationRequests}
      />
    );
  }

  if (state === 'empty') {
    return (
      <EmptyState
        title="Ingen forespørsler"
        message="Det er ingen endringsforespørsler å behandle"
      />
    );
  }

  return <ModificationRequestDashboard requests={requests} />;
};

export default ModificationRequestDashboardContainer;
