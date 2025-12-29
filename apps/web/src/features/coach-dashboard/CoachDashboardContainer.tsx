import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import CoachDashboard from './CoachDashboard.tsx';

interface DashboardData {
  athletes: any[];
  pendingItems: any[];
  recentActivity: any[];
  stats: any;
}

const CoachDashboardContainer: React.FC = () => {
  const { user } = useAuth();
  const [state, setState] = useState<'loading' | 'idle' | 'error'>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  const fetchDashboard = async () => {
    try {
      setState('loading');
      setError(null);

      // Fetch coach dashboard data
      const coachId = (user as any)?.coachId || user?.id;
      const response = await apiClient.get(`/api/v1/coach-analytics/dashboard/${coachId}`);

      setDashboardData(response.data?.data || response.data);
      setState('idle');
    } catch (err: any) {
      console.error('Error fetching coach dashboard:', err);
      // If API fails, use demo data
      setDashboardData(getDemoData());
      setState('idle');
    }
  };

  if (state === 'loading') {
    return <LoadingState message="Laster trener-dashboard..." />;
  }

  if (state === 'error' && !dashboardData) {
    return (
      <ErrorState
        errorType={(error as any)?.type}
        message={error?.message || 'Kunne ikke laste dashboard'}
        onRetry={fetchDashboard}
      />
    );
  }

  return <CoachDashboard data={dashboardData} onRefresh={fetchDashboard} />;
};

function getDemoData(): DashboardData {
  return {
    athletes: [
      { id: '1', firstName: 'Anders', lastName: 'Hansen', category: 'A', lastSession: '2025-12-18' },
      { id: '2', firstName: 'Erik', lastName: 'Johansen', category: 'B', lastSession: '2025-12-17' },
      { id: '3', firstName: 'Lars', lastName: 'Olsen', category: 'A', lastSession: '2025-12-19' },
      { id: '4', firstName: 'Mikkel', lastName: 'Pedersen', category: 'C', lastSession: '2025-12-16' },
      { id: '5', firstName: 'Sofie', lastName: 'Andersen', category: 'B', lastSession: '2025-12-18' },
      { id: '6', firstName: 'Emma', lastName: 'Berg', category: 'A', lastSession: '2025-12-19' },
    ],
    pendingItems: [
      { id: '1', type: 'proof', athlete: 'Anders Hansen', description: 'Ny video lastet opp', time: '2 timer siden' },
      { id: '2', type: 'note', athlete: 'Erik Johansen', description: 'Øktnotat til gjennomgang', time: '4 timer siden' },
      { id: '3', type: 'plan', athlete: 'Sofie Andersen', description: 'Treningsplan venter godkjenning', time: '1 dag siden' },
    ],
    recentActivity: [],
    stats: {
      totalAthletes: 6,
      activePlans: 4,
      pendingReviews: 3,
    },
  };
}

export default CoachDashboardContainer;
