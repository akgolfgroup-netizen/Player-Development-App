import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import ProfileView from './ProfileView.tsx';
import OnboardingForm from './ak_golf_brukerprofil_onboarding';

/**
 * BrukerprofilContainer
 *
 * Shows ProfileView for users who have completed onboarding,
 * or the OnboardingForm for new users who need to complete registration.
 */
const BrukerprofilContainer = ({ forceOnboarding = false }) => {
  const { user } = useAuth();
  const [state, setState] = useState('loading');
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setState('loading');
      setError(null);

      // Fetch user profile data
      const response = await apiClient.get('/me');
      const userData = response.data;

      // Existing players always see ProfileView
      // Only show onboarding for truly new users (no name set)
      const isExistingPlayer = Boolean(userData.firstName && userData.lastName);

      setProfile(userData);
      setOnboardingComplete(isExistingPlayer);
      setState('idle');
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err);
      setState('error');
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      await apiClient.put('/players/profile', updatedData);
      await fetchProfile(); // Refresh data
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
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

  // Show onboarding form for new users or when forced (edit mode)
  // Show profile view for existing users who have completed onboarding
  if (forceOnboarding || !onboardingComplete) {
    return <OnboardingForm profile={profile} />;
  }

  return <ProfileView profile={profile} onUpdate={handleProfileUpdate} />;
};

export default BrukerprofilContainer;
