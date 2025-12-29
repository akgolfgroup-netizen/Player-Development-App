import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import CoachAthleteList from './CoachAthleteList.tsx';

const CoachAthleteListContainer: React.FC = () => {
  const { user } = useAuth();
  const [state, setState] = useState<'loading' | 'idle' | 'error'>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [athletes, setAthletes] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchAthletes();
    }
  }, [user]);

  const fetchAthletes = async () => {
    try {
      setState('loading');
      setError(null);

      const coachId = (user as any)?.coachId || user?.id;
      const response = await apiClient.get(`/api/v1/coaches/${coachId}/players`);

      setAthletes(response.data?.data || response.data || []);
      setState('idle');
    } catch (err: any) {
      console.error('Error fetching athletes:', err);
      // Use demo data on error
      setAthletes(getDemoAthletes());
      setState('idle');
    }
  };

  if (state === 'loading') {
    return <LoadingState message="Laster spillere..." />;
  }

  if (state === 'error' && athletes.length === 0) {
    return (
      <ErrorState
        errorType={(error as any)?.type}
        message={error?.message || 'Kunne ikke laste spillere'}
        onRetry={fetchAthletes}
      />
    );
  }

  return <CoachAthleteList athletes={athletes} />;
};

function getDemoAthletes() {
  return [
    { id: '1', firstName: 'Anders', lastName: 'Hansen', category: 'A' },
    { id: '2', firstName: 'Erik', lastName: 'Johansen', category: 'B' },
    { id: '3', firstName: 'Lars', lastName: 'Olsen', category: 'A' },
    { id: '4', firstName: 'Mikkel', lastName: 'Pedersen', category: 'C' },
    { id: '5', firstName: 'Sofie', lastName: 'Andersen', category: 'B' },
    { id: '6', firstName: 'Emma', lastName: 'Berg', category: 'A' },
  ];
}

export default CoachAthleteListContainer;
