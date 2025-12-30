import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  // Password reset
  requestPasswordReset: (email) => api.post('/auth/forgot-password', { email }),
  verifyResetToken: (token) => api.post('/auth/verify-reset-token', { token }),
  resetPassword: (token, email, newPassword) =>
    api.post('/auth/reset-password', { token, email, newPassword }),
  // 2FA
  generate2FASecret: () => api.post('/auth/2fa/setup'),
  verify2FACode: (code) => api.post('/auth/2fa/verify', { code }),
  disable2FA: (password) => api.post('/auth/2fa/disable', { password }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: (playerId) => api.get(`/dashboard/${playerId}`),
  getRecentTests: (playerId) => api.get(`/dashboard/${playerId}/recent-tests`),
  getUpcomingSessions: (playerId) => api.get(`/dashboard/${playerId}/upcoming-sessions`),
};

// Players API
export const playersAPI = {
  getAll: () => api.get('/players'),
  getById: (id) => api.get(`/players/${id}`),
  create: (data) => api.post('/players', data),
  update: (id, data) => api.put(`/players/${id}`, data),
  delete: (id) => api.delete(`/players/${id}`),
  updateProfile: (data) => api.put('/players/profile', data),
  getProfile: () => api.get('/players/profile'),
};

// Coaches API
export const coachesAPI = {
  getAll: () => api.get('/coaches'),
  getById: (id) => api.get(`/coaches/${id}`),
  create: (data) => api.post('/coaches', data),
  update: (id, data) => api.put(`/coaches/${id}`, data),
  delete: (id) => api.delete(`/coaches/${id}`),
  // Coach dashboard - uses /me endpoints for authenticated coach
  getAthletes: () => api.get('/coaches/me/players'),
  getAlerts: (unreadOnly = false) => api.get('/coaches/me/alerts', { params: { unread: unreadOnly } }),
  dismissAlert: (alertId) => api.put(`/coaches/alerts/${alertId}/dismiss`),
  // Coach statistics
  getStatistics: (coachId) => api.get(`/coaches/${coachId}/statistics`),
  getAvailability: (coachId, startDate, endDate) =>
    api.get(`/coaches/${coachId}/availability`, { params: { startDate, endDate } }),
  getPlayers: (coachId) => api.get(`/coaches/${coachId}/players`),
  // Aliases for backward compatibility
  getPendingItems: () => api.get('/coaches/me/alerts'),
  getTodaySchedule: () => api.get('/sessions', { params: { status: 'scheduled', today: true } }),
  getWeeklyStats: (coachId) => api.get(`/coaches/${coachId}/statistics`),
  getTeams: () => api.get('/coaches/me/players'), // No separate teams endpoint, use players
};

// Tests API
export const testsAPI = {
  getAll: () => api.get('/tests'),
  getResults: (playerId) => api.get(`/tests/results?playerId=${playerId}`),
  createResult: (data) => api.post('/tests/results/enhanced', data),
  getResultById: (id) => api.get(`/tests/results/${id}/enhanced`),
};

// Exercises API
export const exercisesAPI = {
  // List exercises with optional filters
  list: (params = {}) => api.get('/exercises', { params }),
  getAll: () => api.get('/exercises'),
  getById: (id) => api.get(`/exercises/${id}`),
  create: (data) => api.post('/exercises', data),
  update: (id, data) => api.put(`/exercises/${id}`, data),
  delete: (id) => api.delete(`/exercises/${id}`),
  duplicate: (id) => api.post(`/exercises/${id}/duplicate`),
};

// Training Plan API
export const trainingPlanAPI = {
  // List and get plans
  getAll: () => api.get('/training-plan'),
  getPlans: (playerId) => api.get(`/training-plan?playerId=${playerId}`),
  getForPlayer: (playerId) => api.get(`/training-plan/player/${playerId}`),
  getFull: (planId, params = {}) => api.get(`/training-plan/${planId}/full`, { params }),
  getCalendar: (planId, params = {}) => api.get(`/training-plan/${planId}/calendar`, { params }),
  getToday: (planId) => api.get(`/training-plan/${planId}/today`),
  getAnalytics: (planId) => api.get(`/training-plan/${planId}/analytics`),
  getAchievements: (planId) => api.get(`/training-plan/${planId}/achievements`),
  // CRUD
  createPlan: (data) => api.post('/training-plan', data),
  generate: (data) => api.post('/training-plan/generate', data),
  updatePlan: (id, data) => api.put(`/training-plan/${id}`, data),
  deletePlan: (id) => api.delete(`/training-plan/${id}`),
  // Plan actions
  acceptPlan: (planId) => api.put(`/training-plan/${planId}/accept`),
  rejectPlan: (planId, data) => api.put(`/training-plan/${planId}/reject`, data),
  // Daily assignments
  updateDaily: (planId, date, data) => api.put(`/training-plan/${planId}/daily/${date}`, data),
  quickAction: (planId, date, data) => api.put(`/training-plan/${planId}/daily/${date}/quick-action`, data),
  findSubstitute: (planId, date) => api.post(`/training-plan/${planId}/daily/${date}/substitute`),
  // Tournaments
  addTournament: (planId, data) => api.post(`/training-plan/${planId}/tournaments`, data),
  // Modification requests
  requestModification: (planId, data) => api.post(`/training-plan/${planId}/modification-request`, data),
  getModificationRequests: (params = {}) => api.get('/training-plan/modification-requests', { params }),
  respondToModification: (requestId, data) => api.put(`/training-plan/modification-requests/${requestId}/respond`, data),
};

// Calendar/Bookings API
export const calendarAPI = {
  getAvailability: (coachId, date) => api.get(`/availability?coachId=${coachId}&date=${date}`),
  createBooking: (data) => api.post('/bookings', data),
  getBookings: (playerId) => api.get(`/bookings?playerId=${playerId}`),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
  // Tournament results
  createTournamentResult: (data) => api.post('/calendar/tournament-result', data),
  getTournamentResults: (playerId) => api.get(`/calendar/tournament-results?playerId=${playerId}`),
};

// Coach Analytics API
export const analyticsAPI = {
  getPlayerOverview: (playerId) => api.get(`/coach-analytics/players/${playerId}/overview`),
  getCategoryProgression: (playerId) => api.get(`/coach-analytics/players/${playerId}/category-progression`),
  comparePlayers: (playerIds) => api.post('/coach-analytics/compare-players', { playerIds }),
  getTeamAnalytics: (coachId) => api.get(`/coach-analytics/team/${coachId}`),
  getDashboard: (coachId) => api.get(`/coach-analytics/dashboard/${coachId}`),
};

// Peer Comparison API
export const peerComparisonAPI = {
  compare: (playerId, testId) => api.get(`/peer-comparison?playerId=${playerId}&testId=${testId}`),
  multiLevel: (playerId, testId) => api.get(`/peer-comparison/multi-level?playerId=${playerId}&testId=${testId}`),
  getPeerGroup: (category, gender, ageGroup) => api.get(`/peer-comparison/peer-group?category=${category}&gender=${gender}&ageGroup=${ageGroup}`),
};

// Sessions API (Training Session Evaluation)
export const sessionsAPI = {
  // List and get sessions
  list: (params = {}) => api.get('/sessions', { params }),
  getMy: (params = {}) => api.get('/sessions/my', { params }),
  getById: (id) => api.get(`/sessions/${id}`),
  getInProgress: () => api.get('/sessions/in-progress'),

  // CRUD
  create: (data) => api.post('/sessions', data),
  update: (id, data) => api.patch(`/sessions/${id}`, data),
  delete: (id) => api.delete(`/sessions/${id}`),

  // Evaluation
  updateEvaluation: (id, data) => api.patch(`/sessions/${id}/evaluation`, data),
  complete: (id, data) => api.post(`/sessions/${id}/complete`, data),
  autoComplete: (id) => api.post(`/sessions/${id}/auto-complete`),

  // Statistics
  getEvaluationStats: (params = {}) => api.get('/sessions/stats/evaluation', { params }),

  // Technical cues
  getTechnicalCues: () => api.get('/sessions/technical-cues'),
};

// DataGolf API
export const dataGolfAPI = {
  getPlayer: (playerId) => api.get(`/datagolf/players/${playerId}`),
  getTourAverages: (tour, season) => api.get('/datagolf/tour-averages', {
    params: { tour, season }
  }),
  compare: (playerId, tour, season) => api.get('/datagolf/compare', {
    params: { playerId, tour, season }
  }),
  syncStatus: () => api.get('/datagolf/sync-status'),
  triggerSync: () => api.post('/datagolf/sync'),
  // Coach dashboard
  getCoachDashboard: (tour = 'pga', season) => api.get('/datagolf/coach/dashboard', {
    params: { tour, season }
  }),
  // Pro players
  getProPlayers: (tour = 'pga', limit = 50) => api.get('/datagolf/pro-players', {
    params: { tour, limit }
  }),
  // Approach skill
  getApproachSkill: (params = {}) => api.get('/datagolf/approach-skill', { params }),
  getApproachSkillAverages: (tour, season) => api.get('/datagolf/approach-skill/averages', {
    params: { tour, season }
  }),
  getTopApproachSkill: (distance, tour, season, limit = 20) => api.get('/datagolf/approach-skill/top', {
    params: { distance, tour, season, limit }
  }),
  getPlayerApproachSkill: (playerName, tour, season) => api.get(`/datagolf/approach-skill/player/${encodeURIComponent(playerName)}`, {
    params: { tour, season }
  }),
};

// Messages API
export const messagesAPI = {
  send: (data) => api.post('/messages', data),
  schedule: (data) => api.post('/messages/schedule', data),
  list: (params) => api.get('/messages', { params }),
  delete: (id) => api.delete(`/messages/${id}`),
  sendNow: (id) => api.post(`/messages/${id}/send-now`),
  getScheduled: () => api.get('/messages/scheduled'),
};

// Golf Courses API
export const golfCoursesAPI = {
  search: (params = {}) => api.get('/golf-courses/search', { params }),
  getById: (id) => api.get(`/golf-courses/${id}`),
  getNorwegian: () => api.get('/golf-courses/norway'),
  getByCountry: (country) => api.get(`/golf-courses/country/${encodeURIComponent(country)}`),
  getSyncStatus: () => api.get('/golf-courses/sync/status'),
  sync: (country) => api.post('/golf-courses/sync', { country }),
};

// Weather API (MET Norway)
export const weatherAPI = {
  // Get weather for a specific course
  getCourseWeather: (courseId) => api.get(`/weather/course/${courseId}`),
  // Get weather for a club
  getClubWeather: (clubId) => api.get(`/weather/club/${clubId}`),
  // Get weather by coordinates
  getByLocation: (lat, lng) => api.get('/weather/location', { params: { lat, lng } }),
  // Get best courses to play today (sorted by weather)
  getBestCourses: (limit = 10) => api.get('/weather/best-courses', { params: { limit } }),
  // Get weather for all courses in a city/region
  getRegionWeather: (city) => api.get('/weather/region', { params: { city } }),
  // Get 24-hour wind forecast for a course
  getWindForecast: (courseId) => api.get(`/weather/wind/${courseId}`),
};

// Settings API
export const settingsAPI = {
  saveNotifications: (data) => api.post('/settings/notifications', data),
};

// Achievements API
export const achievementsAPI = {
  // List achievements (with optional category filter)
  list: (category) => api.get('/achievements', { params: category ? { category } : {} }),
  // Get new (unviewed) achievements
  getNew: () => api.get('/achievements/new'),
  // Get achievement statistics
  getStats: () => api.get('/achievements/stats'),
  // Get recent achievements
  getRecent: (limit = 5) => api.get('/achievements/recent', { params: { limit } }),
  // Get single achievement
  getById: (id) => api.get(`/achievements/${id}`),
  // Mark achievement as viewed
  markViewed: (id) => api.patch(`/achievements/${id}/viewed`),
  // Mark all as viewed
  markAllViewed: () => api.post('/achievements/mark-all-viewed'),
};

// Badges API
export const badgesAPI = {
  // Get all badge definitions
  getDefinitions: (includeUnavailable = true) =>
    api.get('/badges/definitions', { params: { includeUnavailable } }),
  // Get badge definitions by category
  getByCategory: (category, includeUnavailable = true) =>
    api.get(`/badges/definitions/${category}`, { params: { includeUnavailable } }),
  // Get player's badge progress
  getProgress: () => api.get('/badges/progress'),
  // Get recently unlocked badges
  getRecent: (limit = 5) => api.get('/badges/recent', { params: { limit } }),
  // Get badge leaderboard
  getLeaderboard: (limit = 10) => api.get('/badges/leaderboard', { params: { limit } }),
  // Award badge (coach/admin only)
  award: (badgeId, playerId) => api.post('/badges/award', { badgeId, playerId }),
};

// Calibration API
export const calibrationAPI = {
  // Get calibration for a player
  getCalibration: (playerId) => api.get(`/calibration/player/${playerId}`),
  // Create new calibration
  createCalibration: (data) => api.post('/calibration', data),
  // Update calibration for a player
  updateCalibration: (playerId, data) => api.put(`/calibration/player/${playerId}`, data),
  // Delete calibration
  deleteCalibration: (playerId) => api.delete(`/calibration/player/${playerId}`),
  // Start mobile calibration session
  startSession: () => api.post('/calibration/start'),
  // Submit mobile calibration samples
  submitSamples: (sessionId, samples) => api.post('/calibration/submit', { sessionId, samples }),
};

export default api;
