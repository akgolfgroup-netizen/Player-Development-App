import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import Arkiv from './Arkiv';

const ArkivContainer = () => {
  const { user } = useAuth();
  const [state, setState] = useState('loading');
  const [error, setError] = useState(null);
  const [archivedItems, setArchivedItems] = useState([]);

  useEffect(() => {
    if (user) {
      fetchArchive();
    }
  }, [user]);

  const fetchArchive = async () => {
    try {
      setState('loading');
      setError(null);
      const response = await apiClient.get('/api/v1/archive');
      setArchivedItems(response.data);
      setState(response.data.length === 0 ? 'empty' : 'idle');
    } catch (err) {
      console.error('Error fetching archive:', err);
      // If 404, show empty state (endpoint not implemented yet)
      if (err.response?.status === 404) {
        setArchivedItems([]);
        setState('empty');
      } else {
        setError(err);
        setState('error');
      }
    }
  };

  if (state === 'loading') {
    return <LoadingState message="Laster arkiv..." />;
  }

  if (state === 'error') {
    return (
      <ErrorState
        errorType={error?.type}
        message={error?.message || 'Kunne ikke laste arkiv'}
        onRetry={fetchArchive}
      />
    );
  }

  if (state === 'empty') {
    return (
      <EmptyState
        title="Tomt arkiv"
        message="Du har ingen arkiverte elementer"
      />
    );
  }

  return <Arkiv items={archivedItems} />;
};

export default ArkivContainer;
