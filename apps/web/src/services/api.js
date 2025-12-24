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
};

// Coaches API
export const coachesAPI = {
  getAll: () => api.get('/coaches'),
  getById: (id) => api.get(`/coaches/${id}`),
  create: (data) => api.post('/coaches', data),
  update: (id, data) => api.put(`/coaches/${id}`, data),
  // Coach dashboard
  getDashboard: () => api.get('/coaches/dashboard'),
  getAthletes: () => api.get('/coaches/athletes'),
  getPendingItems: () => api.get('/coaches/pending'),
  getTodaySchedule: () => api.get('/coaches/schedule/today'),
  getWeeklyStats: () => api.get('/coaches/stats/weekly'),
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
  getAll: () => api.get('/exercises'),
  getById: (id) => api.get(`/exercises/${id}`),
  create: (data) => api.post('/exercises', data),
  update: (id, data) => api.put(`/exercises/${id}`, data),
};

// Training Plan API
export const trainingPlanAPI = {
  getPlans: (playerId) => api.get(`/training-plan?playerId=${playerId}`),
  createPlan: (data) => api.post('/training-plan', data),
  updatePlan: (id, data) => api.put(`/training-plan/${id}`, data),
};

// Calendar/Bookings API
export const calendarAPI = {
  getAvailability: (coachId, date) => api.get(`/availability?coachId=${coachId}&date=${date}`),
  createBooking: (data) => api.post('/bookings', data),
  getBookings: (playerId) => api.get(`/bookings?playerId=${playerId}`),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
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
};

// Messages API
export const messagesAPI = {
  send: (data) => api.post('/messages', data),
  schedule: (data) => api.post('/messages/schedule', data),
  list: (params) => api.get('/messages', { params }),
  delete: (id) => api.delete(`/messages/${id}`),
};

// Settings API
export const settingsAPI = {
  saveCalibration: (data) => api.post('/settings/calibration', data),
  saveNotifications: (data) => api.post('/settings/notifications', data),
};

export default api;
