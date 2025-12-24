/**
 * useDashboard Hook
 * Fetches and manages dashboard data from API
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

export function useDashboard(date = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = date ? { date: date.toISOString().split('T')[0] } : {};
      const response = await apiClient.get('/dashboard', { params });

      // Transform API response to match component expectations
      const dashboardData = transformApiResponse(response.data);
      setData(dashboardData);
    } catch (err) {
      setError(err.message || 'Kunne ikke laste dashboard');

      // Use fallback demo data on error
      setData(getFallbackData());
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const refetch = () => {
    fetchDashboard();
  };

  return { data, loading, error, refetch };
}

/**
 * Transform API response to match Dashboard component format
 */
function transformApiResponse(apiData) {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { player, period, todaySessions, badges, goals, weeklyStats, messages, unreadCount, nextTournament, nextTest, breakingPoints, recentTests } = apiData;

  // Transform sessions to calendar events format
  const calendarEvents = todaySessions.map(session => ({
    id: session.id,
    title: session.title,
    startTime: session.time,
    endTime: calculateEndTime(session.time, session.duration),
    type: session.sessionType === 'training' ? 'training' : 'meeting',
    location: session.meta?.split(' - ')[1] || 'AK Golf Academy',
    sessionId: session.id,
  }));

  // Transform upcoming sessions
  const upcomingSessions = todaySessions.map(session => ({
    id: session.id,
    title: session.title,
    time: session.time,
    location: session.meta?.split(' - ')[1] || 'AK Golf Academy',
    duration: session.duration,
    status: session.status,
  }));

  // Transform stats
  const stats = weeklyStats?.stats || [];
  const sessionsStats = stats.find(s => s.id === 'sessions');
  const hoursStats = stats.find(s => s.id === 'hours');

  const trainingStats = {
    sessionsCompleted: typeof sessionsStats?.value === 'number' ? sessionsStats.value : 0,
    sessionsTotal: 12, // Default weekly goal
    hoursThisWeek: parseFloat(hoursStats?.value) || 0,
    hoursGoal: 20, // Default weekly goal
    streak: weeklyStats?.streak || apiData.streak || 0,
  };

  // Transform messages
  const transformedMessages = messages.map(msg => ({
    id: msg.id,
    from: msg.senderName,
    preview: msg.preview,
    time: msg.time,
    read: !msg.unread,
    isGroup: msg.isGroup,
  }));

  // Transform badges to achievements
  const achievements = badges.map(badge => ({
    id: badge.id,
    icon: null, // Will use emoji from icon field
    iconEmoji: badge.icon,
    title: badge.name,
    description: badge.code,
  }));

  // Transform goals to tasks
  const tasks = goals.map(goal => ({
    id: goal.id,
    title: goal.title,
    area: 'Mål',
    completed: goal.progress >= 100,
    priority: goal.variant === 'error' ? 'high' : 'normal',
  }));

  // Create notifications from various sources
  const notifications = [];
  if (badges.length > 0) {
    notifications.push({
      id: `badge-${badges[0].id}`,
      type: 'achievement',
      title: 'Ny prestasjon!',
      message: `${badges[0].icon} ${badges[0].name}`,
      time: 'Nylig',
    });
  }

  // XP and level data
  const gamification = apiData.gamification || {};
  const totalXp = gamification.totalXP || player.totalXP || 0;
  const currentLevel = gamification.currentLevel || Math.floor(Math.sqrt(totalXp / 50)) + 1;
  const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 50;
  const xpForNextLevel = Math.pow(currentLevel, 2) * 50;
  const xpInLevel = totalXp - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;

  return {
    player: {
      name: `${player.firstName} ${player.lastName}`,
      category: player.category,
      profileImageUrl: player.profileImageUrl,
    },
    period,
    stats: trainingStats,
    calendarEvents,
    upcomingSessions,
    tasks: tasks.length > 0 ? tasks : getFallbackData().tasks,
    messages: transformedMessages.length > 0 ? transformedMessages : getFallbackData().messages,
    achievements: achievements.length > 0 ? achievements : getFallbackData().achievements,
    notifications: notifications.length > 0 ? notifications : getFallbackData().notifications,

    // NEW: Use API data if available, fallback if not
    nextTournament: nextTournament || getFallbackData().nextTournament,
    nextTest: nextTest || getFallbackData().nextTest,
    breakingPoints: breakingPoints || [],
    recentTests: recentTests && recentTests.length > 0 ? recentTests : getFallbackData().recentTests,

    // Keep these as fallback (not in API yet)
    weather: getFallbackData().weather,
    performance: getFallbackData().performance,

    // Gamification data
    xp: xpInLevel,
    totalXp,
    level: currentLevel,
    nextLevelXp: xpNeededForNext,
  };
}

/**
 * Calculate end time from start time and duration
 */
function calculateEndTime(startTime, durationMinutes) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

/**
 * Fallback demo data when API fails or no data
 */
function getFallbackData() {
  return {
    player: {
      name: 'Demo Spiller',
      category: 'B',
    },
    stats: {
      sessionsCompleted: 8,
      sessionsTotal: 12,
      hoursThisWeek: 14.5,
      hoursGoal: 20,
      streak: 7,
    },
    nextTournament: {
      title: 'NM Individuelt 2026',
      date: '2026-06-15',
      location: 'Miklagard Golf',
    },
    nextTest: {
      title: 'Kategoritest Q1',
      date: '2026-01-20',
      location: 'AK Golf Academy',
    },
    tasks: [
      { id: 1, title: 'Gjennomgå video av swing', area: 'Teknikk', completed: true, priority: 'normal' },
      { id: 2, title: '100 putts under 2 meter', area: 'Putting', completed: false, priority: 'high' },
      { id: 3, title: 'Loggfør ernæring for uken', area: 'Fysisk', completed: false, priority: 'normal' },
      { id: 4, title: 'Mentalt forberedelse - visualisering', area: 'Mental', completed: false, priority: 'normal' },
    ],
    messages: [
      { id: 1, from: 'Anders Kristiansen', preview: 'Hei! Kan vi gå gjennom treningsplanen?', time: '10 min', read: false, isGroup: false },
      { id: 2, from: 'Team Norway Juniors', preview: 'Samling neste uke - påmelding åpen', time: '1t', read: false, isGroup: true },
      { id: 3, from: 'Mental Trener', preview: 'God jobb med visualiseringen!', time: '3t', read: true, isGroup: false },
    ],
    achievements: [
      { id: 1, iconEmoji: '🔥', title: '7-dagers streak', description: 'Trent 7 dager på rad' },
      { id: 2, iconEmoji: '🎯', title: 'Presis putter', description: '50 putts på rad innenfor 1m' },
      { id: 3, iconEmoji: '💪', title: 'Jernvilje', description: 'Fullført 100 økter' },
    ],
    notifications: [
      { id: 1, type: 'goal', title: 'Målsetting oppdatert', message: 'Du har nådd 75% av ditt swinghastighetsmål!', time: '10 min siden' },
      { id: 2, type: 'session', title: 'Ny økt tildelt', message: 'Din trener har lagt til "Mentale øvelser" i kalenderen', time: '1t siden' },
    ],
    calendarEvents: [
      { id: 1, title: 'Putting Drills', startTime: '08:00', endTime: '09:30', type: 'training', location: 'Indoor Range', sessionId: 'session-1' },
      { id: 2, title: 'Trenermeeting', startTime: '10:00', endTime: '10:30', type: 'meeting', location: 'Klubbhus' },
      { id: 3, title: 'Langspill - Driver', startTime: '13:00', endTime: '15:00', type: 'training', location: 'Driving Range', sessionId: 'session-2' },
    ],
    upcomingSessions: [
      { id: 1, title: 'Putting Drills', time: '08:00', location: 'Indoor Range', duration: 90 },
      { id: 2, title: 'Langspill - Driver', time: '13:00', location: 'Driving Range', duration: 120 },
    ],
    // Gamification
    xp: 350,
    totalXp: 850,
    level: 5,
    nextLevelXp: 500,
  };
}

export default useDashboard;
