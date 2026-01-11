import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { coachesAPI, AthleteDTO } from '../../services/api';
import { useToast } from '../../components/shadcn/use-toast';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import CoachAthleteList from './CoachAthleteList';
import { PlayerAssignment } from '../coach/athletes';
import { Button } from '../../components/shadcn';
import { UserPlus } from 'lucide-react';

// Transform AthleteDTO to the format expected by CoachAthleteList
type Athlete = {
  id: string;
  firstName: string;
  lastName: string;
};

/**
 * CoachAthleteListContainer
 * Fetches coach's athletes and provides navigation to detail view.
 */
const CoachAthleteListContainer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<'loading' | 'idle' | 'error'>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [athletes, setAthletes] = useState<AthleteDTO[]>([]);
  const [usingFallback, setUsingFallback] = useState(false);
  const [showAssignment, setShowAssignment] = useState(false);

  const fetchAthletes = useCallback(async () => {
    try {
      setState('loading');
      setError(null);

      // Try /coaches/me/players first (authenticated coach), fallback to /coaches/:id/players
      let data: AthleteDTO[] = [];
      try {
        const response = await coachesAPI.getAthletes();
        data = response.data?.data || response.data || [];
      } catch {
        // Fallback to specific coach ID endpoint
        // Safely extract coachId from user object
        const userWithCoach = user as { coachId?: string; id?: string } | null;
        const coachId = userWithCoach?.coachId || userWithCoach?.id;
        if (coachId) {
          const response = await coachesAPI.getPlayers(coachId);
          data = response.data?.data || response.data || [];
        }
      }

      // Ensure we have an array
      const athleteArray = Array.isArray(data) ? data : [];

      if (athleteArray.length === 0) {
        // Use demo data when no athletes found
        setAthletes(getDemoAthletes());
        setUsingFallback(true);
        toast({
          title: 'Ingen spillere funnet',
          description: 'Viser demodata. Legg til spillere for å se dine egne.',
        });
      } else {
        setAthletes(athleteArray);
        setUsingFallback(false);
      }
      setState('idle');
    } catch (err) {
      console.error('Error fetching athletes:', err);
      // Use demo data on error
      setAthletes(getDemoAthletes());
      setUsingFallback(true);
      toast({
        title: 'Kunne ikke laste spillere',
        description: 'Viser demodata. Prøv igjen senere.',
        variant: 'destructive',
      });
      setState('idle');
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchAthletes();
    }
  }, [user, fetchAthletes]);

  const handleSelectAthlete = (athleteId: string) => {
    navigate(`/coach/athletes/${athleteId}`);
  };

  // Transform AthleteDTO to Athlete format expected by CoachAthleteList
  // Must be called unconditionally before conditional returns
  const transformedAthletes: Athlete[] = useMemo(() =>
    athletes.map((a): Athlete => ({
      id: a.id,
      firstName: a.firstName || '',
      lastName: a.lastName || '',
    })), [athletes]);

  if (state === 'loading') {
    return <LoadingState message="Laster spillere..." />;
  }

  if (state === 'error' && athletes.length === 0) {
    const errorType = error && typeof error === 'object' && 'type' in error
      ? (error as { type?: string }).type
      : undefined;
    return (
      <ErrorState
        errorType={errorType}
        message={error?.message || 'Kunne ikke laste spillere'}
        onRetry={fetchAthletes}
      />
    );
  }

  const handlePlayerAssigned = () => {
    // Refresh the list when a player is assigned
    fetchAthletes();
  };

  return (
    <div className="space-y-4">
      {/* Add Player Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowAssignment(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Legg til spiller
        </Button>
      </div>

      {/* Player Assignment Modal */}
      {showAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <PlayerAssignment
            onPlayerAssigned={handlePlayerAssigned}
            onClose={() => setShowAssignment(false)}
          />
        </div>
      )}

      {/* Athletes List */}
      <CoachAthleteList
        athletes={transformedAthletes}
        onSelectAthlete={handleSelectAthlete}
      />
    </div>
  );
};

function getDemoAthletes(): AthleteDTO[] {
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
