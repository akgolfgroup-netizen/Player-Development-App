import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import Brukerprofil from './ak_golf_brukerprofil_onboarding';

const BrukerprofilContainer = () => {
  const { user } = useAuth();
  const [state, setState] = useState('loading');
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setState('loading');
      setError(null);
      const response = await apiClient.get('/me');
      setProfile(response.data);
      setState('idle');
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err);
      setState('error');
    }
  };

  if (state === 'loading') {
    return <LoadingState message="Laster profil..." />;
  }

  if (state === 'error') {
    return (
      <ErrorState
        errorType={error?.type}
        message={error?.message || 'Kunne ikke laste profil'}
        onRetry={fetchProfile}
      />
    );
  }

  return <Brukerprofil profile={profile} />;
};

export default BrukerprofilContainer;
