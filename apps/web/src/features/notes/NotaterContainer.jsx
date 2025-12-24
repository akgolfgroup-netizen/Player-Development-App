import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import Notater from './Notater';

const NotaterContainer = () => {
  const { user } = useAuth();
  const [state, setState] = useState('loading');
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      setState('loading');
      setError(null);
      const response = await apiClient.get('/api/v1/notes');
      setNotes(response.data);
      setState(response.data.length === 0 ? 'empty' : 'idle');
    } catch (err) {
      console.error('Error fetching notes:', err);
      // If 404, show empty state (endpoint not implemented yet)
      if (err.response?.status === 404) {
        setNotes([]);
        setState('empty');
      } else {
        setError(err);
        setState('error');
      }
    }
  };

  if (state === 'loading') {
    return <LoadingState message="Laster notater..." />;
  }

  if (state === 'error') {
    return (
      <ErrorState
        errorType={error?.type}
        message={error?.message || 'Kunne ikke laste notater'}
        onRetry={fetchNotes}
      />
    );
  }

  if (state === 'empty') {
    return (
      <EmptyState
        title="Ingen notater"
        message="Du har ikke skrevet noen notater ennå"
      />
    );
  }

  return <Notater notes={notes} />;
};

export default NotaterContainer;
