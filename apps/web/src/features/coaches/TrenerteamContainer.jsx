import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { coachesAPI } from '../../services/api';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import Trenerteam from './Trenerteam';
import { PageHeader } from '../../ui/raw-blocks';

/**
 * TrenerteamContainer
 * Fetches coach team data and displays using Trenerteam component.
 */
const TrenerteamContainer = () => {
  const { user } = useAuth();
  const [state, setState] = useState('loading');
  const [error, setError] = useState(null);
  const [coaches, setCoaches] = useState([]);

  const fetchCoaches = useCallback(async () => {
    try {
      setState('loading');
      setError(null);

      // Fetch all coaches
      const response = await coachesAPI.getAll();

      // Handle different response formats
      let coachData = response.data?.data || response.data || [];
      if (!Array.isArray(coachData)) {
        coachData = coachData.coaches || [];
      }

      // Transform to expected format
      const transformedCoaches = coachData.map((coach, index) => ({
        id: coach.id,
        name: `${coach.firstName || ''} ${coach.lastName || ''}`.trim() || coach.name || 'Trener',
        role: mapSpecializationToRole(coach.specialization),
        isPrimary: index === 0 || coach.isPrimary,
        email: coach.email || coach.user?.email || '',
        phone: coach.phone || coach.user?.phone || '',
        specializations: coach.specializations || coach.expertise || [],
        certifications: coach.certifications || [],
        startYear: coach.hireDate ? new Date(coach.hireDate).getFullYear() : new Date().getFullYear(),
        sessionsTotal: coach.totalSessions || coach.sessionCount || 0,
        sessionsMonth: coach.monthlySessions || 0,
        bio: coach.bio || coach.description || '',
      }));

      setCoaches(transformedCoaches);
      setState(transformedCoaches.length === 0 ? 'empty' : 'idle');
    } catch (err) {
      console.error('Error fetching coaches:', err);
      // Use fallback data on error - component has defaults
      setCoaches([]);
      setState('idle');
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchCoaches();
    }
  }, [user, fetchCoaches]);

  if (state === 'loading') {
    return <LoadingState message="Laster trenerteam..." />;
  }

  if (state === 'error') {
    return (
      <ErrorState
        errorType={error?.type}
        message={error?.message || 'Kunne ikke laste trenerteam'}
        onRetry={fetchCoaches}
      />
    );
  }

  if (state === 'empty') {
    return (
      <EmptyState
        title="Ingen trenere"
        message="Du har ikke noen trenere tilknyttet ennå"
      />
    );
  }

  // Pass coaches data or let component use defaults
  return (
    <>
      <PageHeader
        title="Trenerteam"
        subtitle="Møt dine dedikerte trenere"
        helpText="Oversikt over trenerteamet med hovedtrener og spesialiserte trenere (teknisk, fysisk, mental, strategi). Se hver treners profil med spesialiseringer, sertifiseringer, startår, totalt antall økter og månedlige økter. Kontaktinformasjon (e-post, telefon) og biografi tilgjengelig. Bruk for å bli kjent med teamet og vite hvem som hjelper deg med hva."
      />
      <Trenerteam trainers={coaches.length > 0 ? coaches : null} />
    </>
  );
};

/**
 * Map coach specialization to display role
 */
function mapSpecializationToRole(specialization) {
  const roleMap = {
    head: 'hovedtrener',
    head_coach: 'hovedtrener',
    technical: 'teknisk',
    tech: 'teknisk',
    swing: 'teknisk',
    physical: 'fysisk',
    fitness: 'fysisk',
    strength: 'fysisk',
    mental: 'mental',
    psychology: 'mental',
    strategy: 'strategi',
    course: 'strategi',
  };
  return roleMap[specialization?.toLowerCase()] || 'teknisk';
}

export default TrenerteamContainer;
