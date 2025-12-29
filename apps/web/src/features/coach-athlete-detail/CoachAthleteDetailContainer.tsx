import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import CoachAthleteDetail from './CoachAthleteDetail';

const CoachAthleteDetailContainer: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();
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

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewProof = (athleteId: string) => {
    navigate(`/coach/athletes/${athleteId}/proof`);
  };

  const handleViewTrajectory = (athleteId: string) => {
    navigate(`/coach/athletes/${athleteId}/trajectory`);
  };

  const handleEditTrainingPlan = (athleteId: string) => {
    navigate(`/coach/athletes/${athleteId}/training-plan`);
  };

  const handleViewNotes = (athleteId: string) => {
    navigate(`/coach/athletes/${athleteId}/notes`);
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

  const athleteName = athleteData
    ? `${athleteData.firstName || ''} ${athleteData.lastName || ''}`.trim()
    : undefined;

  return (
    <CoachAthleteDetail
      athleteId={playerId!}
      athleteName={athleteName}
      onBack={handleBack}
      onViewProof={handleViewProof}
      onViewTrajectory={handleViewTrajectory}
      onEditTrainingPlan={handleEditTrainingPlan}
      onViewNotes={handleViewNotes}
    />
  );
};

export default CoachAthleteDetailContainer;
