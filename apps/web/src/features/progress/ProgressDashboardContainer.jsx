import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/apiClient';
import LoadingState from '../../components/ui/LoadingState';
import ProgressDashboard from './ProgressDashboard';

// Demo data for when API is unavailable
const DEMO_PROGRESS_DATA = {
  overview: {
    completionRate: 78,
    currentStreak: 5,
    totalSessionsCompleted: 32,
    totalSessionsPlanned: 41,
    totalHoursCompleted: 48
  },
  weeklyTrend: [
    { completionRate: 85, totalHours: 6 },
    { completionRate: 75, totalHours: 5 },
    { completionRate: 90, totalHours: 7 },
    { completionRate: 70, totalHours: 4 },
    { completionRate: 80, totalHours: 5 },
    { completionRate: 65, totalHours: 4 },
    { completionRate: 85, totalHours: 6 },
    { completionRate: 78, totalHours: 5 },
    { completionRate: 82, totalHours: 5 },
    { completionRate: 75, totalHours: 4 },
    { completionRate: 88, totalHours: 6 },
    { completionRate: 72, totalHours: 4 }
  ],
  periodBreakdown: {
    E: { completionRate: 85, completed: 12, planned: 14, totalHours: 18 },
    G: { completionRate: 75, completed: 9, planned: 12, totalHours: 14 },
    S: { completionRate: 80, completed: 8, planned: 10, totalHours: 12 },
    T: { completionRate: 60, completed: 3, planned: 5, totalHours: 4 }
  },
  upcomingSessions: [
    { type: 'Driving Range', date: new Date(Date.now() + 86400000).toISOString(), duration: 90, period: 'G' },
    { type: 'Short Game', date: new Date(Date.now() + 172800000).toISOString(), duration: 60, period: 'S' },
    { type: 'Putting Practice', date: new Date(Date.now() + 259200000).toISOString(), duration: 45, period: 'S' },
    { type: 'Full Round', date: new Date(Date.now() + 345600000).toISOString(), duration: 240, period: 'T' },
    { type: 'Fysisk trening', date: new Date(Date.now() + 432000000).toISOString(), duration: 60, period: 'E' }
  ]
};

const ProgressDashboardContainer = () => {
  const { user } = useAuth();
  const [state, setState] = useState('loading');
  const [progressData, setProgressData] = useState(null);

  const fetchProgress = useCallback(async () => {
    try {
      setState('loading');
      const response = await apiClient.get('/dashboard');
      const data = response.data?.data || response.data;
      setProgressData(data || DEMO_PROGRESS_DATA);
      setState('idle');
    } catch (err) {
      console.error('Error fetching progress:', err);
      // Use demo data as fallback
      setProgressData(DEMO_PROGRESS_DATA);
      setState('idle');
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchProgress();
    } else {
      // No user - use demo data immediately
      setProgressData(DEMO_PROGRESS_DATA);
      setState('idle');
    }
  }, [user, fetchProgress]);

  if (state === 'loading') {
    return <LoadingState message="Laster fremdrift..." />;
  }

  return <ProgressDashboard data={progressData} />;
};

export default ProgressDashboardContainer;
