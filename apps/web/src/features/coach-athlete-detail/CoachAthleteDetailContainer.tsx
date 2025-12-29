import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import CoachAthleteDetail from './CoachAthleteDetail.tsx';

const CoachAthleteDetailContainer: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const { user } = useAuth();
  const [state, setState] = useState<'loading' | 'idle' | 'error'>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [athleteData, setAthleteData] = useState<any>(null);

  useEffect(() => {
    if (user && playerId) {
      fetchAthleteDetail();
    }
  }, [user, playerId]);

  const fetchAthleteDetail = async () => {
    try {
      setState('loading');
      setError(null);

      const response = await apiClient.get(`/api/v1/coach-analytics/players/${playerId}/overview`);

      setAthleteData(response.data?.data || response.data);
      setState('idle');
    } catch (err: any) {
      console.error('Error fetching athlete detail:', err);
      setError(err);
      setState('error');
    }
  };

  if (state === 'loading') {
    return <LoadingState message="Laster spillerdetaljer..." />;
  }

  if (state === 'error') {
    return (
      <ErrorState
        errorType={(error as any)?.type}
        message={error?.message || 'Kunne ikke laste spillerdetaljer'}
        onRetry={fetchAthleteDetail}
      />
    );
  }

  return <CoachAthleteDetail athlete={athleteData} playerId={playerId!} />;
};

export default CoachAthleteDetailContainer;
