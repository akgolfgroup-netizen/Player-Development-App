/**
 * API Service
 *
 * Centralized API client with type-safe endpoints for all backend services.
 * Uses axios with interceptors for authentication and error handling.
 */

import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// =============================================================================
// Type Definitions
// =============================================================================

// Common response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  role: 'admin' | 'coach' | 'player' | 'parent';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
}

export interface AuthResponse extends AuthTokens {
  user: AuthUser;
}

// Player types
export interface Player {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  category: string;
  handicap?: number;
  coachId?: string;
  tenantId: string;
}

// Coach types
export interface Coach {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  specializations: string[];
  status: string;
  tenantId: string;
}

export interface CoachAlert {
  id: string;
  type: string;
  message: string;
  playerId?: string;
  read: boolean;
  createdAt: string;
}

// Test types
export interface Test {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface TestResult {
  id: string;
  testId: string;
  playerId: string;
  score: number;
  testedAt: string;
}

// Exercise types
export interface Exercise {
  id: string;
  name: string;
  description: string;
  exerciseType: string;
  difficulty: string;
  processCategory: string;
}

export interface ExerciseFilters {
  exerciseType?: string;
  difficulty?: string;
  processCategory?: string;
  search?: string;
}

// Training plan types
export interface TrainingPlan {
  id: string;
  playerId: string;
  planName: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface TrainingPlanFilters {
  playerId?: string;
  status?: string;
}

// Session types
export interface Session {
  id: string;
  playerId: string;
  coachId?: string;
  sessionType: string;
  sessionDate: string;
  duration: number;
  status: string;
}

export interface SessionFilters {
  status?: string;
  playerId?: string;
  coachId?: string;
  today?: boolean;
}

export interface SessionEvaluation {
  focusRating?: number;
  effortRating?: number;
  notes?: string;
  technicalCues?: string[];
}

// Achievement types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  earnedAt?: string;
  viewed: boolean;
}

// Badge types
export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  tier: number;
  requirements: Record<string, unknown>;
}

export interface BadgeProgress {
  badgeId: string;
  progress: number;
  earned: boolean;
  earnedAt?: string;
}

// Weather types
export interface WeatherData {
  temperature: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  description: string;
  icon: string;
}

// Golf course types
export interface GolfCourse {
  id: string;
  name: string;
  clubName: string;
  city?: string;
  country: string;
  latitude: number;
  longitude: number;
}

// Calibration types
export interface Calibration {
  playerId: string;
  driverDistance?: number;
  ironDistance?: number;
  wedgeDistance?: number;
  puttingSkill?: number;
}

// Note types
export interface Note {
  id: string;
  playerId: string;
  coachId: string;
  content: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

// Message types
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  subject: string;
  body: string;
  sentAt?: string;
  scheduledAt?: string;
}

// =============================================================================
// API Configuration
// =============================================================================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =============================================================================
// Token Refresh Logic
// =============================================================================

interface QueuedRequest {
  resolve: (value: string | null) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post<{ data: { accessToken: string; refreshToken?: string } }>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }
    return accessToken;
  } catch {
    // Refresh failed, clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return null;
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for auth endpoints to avoid loops
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    // Only attempt refresh on 401 and if we haven't already tried
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            }
            return Promise.reject(error);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();

        if (newToken) {
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          processQueue(new Error('Token refresh failed'), null);
          // Redirect to login only if refresh fails
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For 401 on auth endpoints or other errors, just reject
    if (error.response?.status === 401 && isAuthEndpoint) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    return Promise.reject(error);
  }
);

// =============================================================================
// Auth API
// =============================================================================

export const authAPI = {
  login: (email: string, password: string): Promise<AxiosResponse<ApiResponse<AuthResponse>>> =>
    api.post('/auth/login', { email, password }),

  register: (data: RegisterData): Promise<AxiosResponse<ApiResponse<AuthResponse>>> =>
    api.post('/auth/register', data),

  logout: (): Promise<AxiosResponse<void>> =>
    api.post('/auth/logout'),

  // Password reset
  requestPasswordReset: (email: string): Promise<AxiosResponse<void>> =>
    api.post('/auth/forgot-password', { email }),

  verifyResetToken: (token: string): Promise<AxiosResponse<{ valid: boolean }>> =>
    api.post('/auth/verify-reset-token', { token }),

  resetPassword: (token: string, email: string, newPassword: string): Promise<AxiosResponse<void>> =>
    api.post('/auth/reset-password', { token, email, newPassword }),

  // 2FA
  generate2FASecret: (): Promise<AxiosResponse<{ secret: string; qrCode: string }>> =>
    api.post('/auth/2fa/setup'),

  verify2FACode: (code: string): Promise<AxiosResponse<{ verified: boolean }>> =>
    api.post('/auth/2fa/verify', { code }),

  disable2FA: (password: string): Promise<AxiosResponse<void>> =>
    api.post('/auth/2fa/disable', { password }),
};

// =============================================================================
// Dashboard API
// =============================================================================

export const dashboardAPI = {
  getStats: (playerId: string): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get(`/dashboard/${playerId}`),

  getRecentTests: (playerId: string): Promise<AxiosResponse<ApiResponse<TestResult[]>>> =>
    api.get(`/dashboard/${playerId}/recent-tests`),

  getUpcomingSessions: (playerId: string): Promise<AxiosResponse<ApiResponse<Session[]>>> =>
    api.get(`/dashboard/${playerId}/upcoming-sessions`),
};

// =============================================================================
// Players API
// =============================================================================

export const playersAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<Player[]>>> =>
    api.get('/players'),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<Player>>> =>
    api.get(`/players/${id}`),

  create: (data: Partial<Player>): Promise<AxiosResponse<ApiResponse<Player>>> =>
    api.post('/players', data),

  update: (id: string, data: Partial<Player>): Promise<AxiosResponse<ApiResponse<Player>>> =>
    api.put(`/players/${id}`, data),

  delete: (id: string): Promise<AxiosResponse<void>> =>
    api.delete(`/players/${id}`),

  updateProfile: (data: Partial<Player>): Promise<AxiosResponse<ApiResponse<Player>>> =>
    api.put('/players/profile', data),

  getProfile: (): Promise<AxiosResponse<ApiResponse<Player>>> =>
    api.get('/players/profile'),
};

// =============================================================================
// Coaches API
// =============================================================================

export const coachesAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<Coach[]>>> =>
    api.get('/coaches'),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<Coach>>> =>
    api.get(`/coaches/${id}`),

  create: (data: Partial<Coach>): Promise<AxiosResponse<ApiResponse<Coach>>> =>
    api.post('/coaches', data),

  update: (id: string, data: Partial<Coach>): Promise<AxiosResponse<ApiResponse<Coach>>> =>
    api.put(`/coaches/${id}`, data),

  delete: (id: string): Promise<AxiosResponse<void>> =>
    api.delete(`/coaches/${id}`),

  // Coach dashboard
  getAthletes: (): Promise<AxiosResponse<ApiResponse<Player[]>>> =>
    api.get('/coaches/me/players'),

  getAlerts: (unreadOnly = false): Promise<AxiosResponse<ApiResponse<CoachAlert[]>>> =>
    api.get('/coaches/me/alerts', { params: { unread: unreadOnly } }),

  dismissAlert: (alertId: string): Promise<AxiosResponse<void>> =>
    api.put(`/coaches/alerts/${alertId}/dismiss`),

  getStatistics: (coachId: string): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get(`/coaches/${coachId}/statistics`),

  getAvailability: (coachId: string, startDate: string, endDate: string): Promise<AxiosResponse<ApiResponse<unknown[]>>> =>
    api.get(`/coaches/${coachId}/availability`, { params: { startDate, endDate } }),

  getPlayers: (coachId: string): Promise<AxiosResponse<ApiResponse<Player[]>>> =>
    api.get(`/coaches/${coachId}/players`),

  // Aliases for backward compatibility
  getPendingItems: (): Promise<AxiosResponse<ApiResponse<CoachAlert[]>>> =>
    api.get('/coaches/me/alerts'),

  getTodaySchedule: (): Promise<AxiosResponse<ApiResponse<Session[]>>> =>
    api.get('/sessions', { params: { status: 'scheduled', today: true } }),

  getWeeklyStats: (coachId: string): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get(`/coaches/${coachId}/statistics`),

  getTeams: (): Promise<AxiosResponse<ApiResponse<Player[]>>> =>
    api.get('/coaches/me/players'),

  // Batch operations
  batchAssignSession: (data: {
    playerIds: string[];
    sessionType: string;
    scheduledDate: string;
    durationMinutes?: number;
    notes?: string;
  }): Promise<AxiosResponse<ApiResponse<{ success: string[]; failed: Array<{ playerId: string; error: string }> }>>> =>
    api.post('/coaches/me/batch/assign-session', data),

  batchSendNote: (data: {
    playerIds: string[];
    title: string;
    content: string;
    category?: string;
  }): Promise<AxiosResponse<ApiResponse<{ success: string[]; failed: Array<{ playerId: string; error: string }> }>>> =>
    api.post('/coaches/me/batch/send-note', data),

  batchUpdateStatus: (data: {
    playerIds: string[];
    status: 'active' | 'inactive' | 'on_break';
  }): Promise<AxiosResponse<ApiResponse<{ success: string[]; failed: Array<{ playerId: string; error: string }> }>>> =>
    api.post('/coaches/me/batch/update-status', data),

  batchCreatePlan: (data: {
    playerIds: string[];
    planName: string;
    startDate: string;
    durationWeeks: number;
    focusAreas?: string[];
  }): Promise<AxiosResponse<ApiResponse<{ success: string[]; failed: Array<{ playerId: string; error: string }> }>>> =>
    api.post('/coaches/me/batch/create-plan', data),
};

// =============================================================================
// Tests API
// =============================================================================

export const testsAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<Test[]>>> =>
    api.get('/tests'),

  getResults: (playerId: string): Promise<AxiosResponse<ApiResponse<TestResult[]>>> =>
    api.get(`/tests/results?playerId=${playerId}`),

  createResult: (data: Partial<TestResult>): Promise<AxiosResponse<ApiResponse<TestResult>>> =>
    api.post('/tests/results/enhanced', data),

  getResultById: (id: string): Promise<AxiosResponse<ApiResponse<TestResult>>> =>
    api.get(`/tests/results/${id}/enhanced`),
};

// =============================================================================
// Exercises API
// =============================================================================

export const exercisesAPI = {
  list: (params: ExerciseFilters = {}): Promise<AxiosResponse<ApiResponse<Exercise[]>>> =>
    api.get('/exercises', { params }),

  getAll: (): Promise<AxiosResponse<ApiResponse<Exercise[]>>> =>
    api.get('/exercises'),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<Exercise>>> =>
    api.get(`/exercises/${id}`),

  create: (data: Partial<Exercise>): Promise<AxiosResponse<ApiResponse<Exercise>>> =>
    api.post('/exercises', data),

  update: (id: string, data: Partial<Exercise>): Promise<AxiosResponse<ApiResponse<Exercise>>> =>
    api.put(`/exercises/${id}`, data),

  delete: (id: string): Promise<AxiosResponse<void>> =>
    api.delete(`/exercises/${id}`),

  duplicate: (id: string): Promise<AxiosResponse<ApiResponse<Exercise>>> =>
    api.post(`/exercises/${id}/duplicate`),
};

// =============================================================================
// Training Plan API
// =============================================================================

export const trainingPlanAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<TrainingPlan[]>>> =>
    api.get('/training-plan'),

  getPlans: (playerId: string): Promise<AxiosResponse<ApiResponse<TrainingPlan[]>>> =>
    api.get(`/training-plan?playerId=${playerId}`),

  getForPlayer: (playerId: string): Promise<AxiosResponse<ApiResponse<TrainingPlan>>> =>
    api.get(`/training-plan/player/${playerId}`),

  getFull: (planId: string, params: Record<string, unknown> = {}): Promise<AxiosResponse<ApiResponse<TrainingPlan>>> =>
    api.get(`/training-plan/${planId}/full`, { params }),

  getCalendar: (planId: string, params: Record<string, unknown> = {}): Promise<AxiosResponse<ApiResponse<unknown[]>>> =>
    api.get(`/training-plan/${planId}/calendar`, { params }),

  getToday: (planId: string): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    api.get(`/training-plan/${planId}/today`),

  getAnalytics: (planId: string): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get(`/training-plan/${planId}/analytics`),

  getAchievements: (planId: string): Promise<AxiosResponse<ApiResponse<Achievement[]>>> =>
    api.get(`/training-plan/${planId}/achievements`),

  // CRUD
  createPlan: (data: Partial<TrainingPlan>): Promise<AxiosResponse<ApiResponse<TrainingPlan>>> =>
    api.post('/training-plan', data),

  generate: (data: Record<string, unknown>): Promise<AxiosResponse<ApiResponse<TrainingPlan>>> =>
    api.post('/training-plan/generate', data),

  updatePlan: (id: string, data: Partial<TrainingPlan>): Promise<AxiosResponse<ApiResponse<TrainingPlan>>> =>
    api.put(`/training-plan/${id}`, data),

  deletePlan: (id: string): Promise<AxiosResponse<void>> =>
    api.delete(`/training-plan/${id}`),

  // Plan actions
  acceptPlan: (planId: string): Promise<AxiosResponse<ApiResponse<TrainingPlan>>> =>
    api.put(`/training-plan/${planId}/accept`),

  rejectPlan: (planId: string, data: { reason?: string }): Promise<AxiosResponse<ApiResponse<TrainingPlan>>> =>
    api.put(`/training-plan/${planId}/reject`, data),

  // Daily assignments
  updateDaily: (planId: string, date: string, data: Record<string, unknown>): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    api.put(`/training-plan/${planId}/daily/${date}`, data),

  quickAction: (planId: string, date: string, data: Record<string, unknown>): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    api.put(`/training-plan/${planId}/daily/${date}/quick-action`, data),

  findSubstitute: (planId: string, date: string): Promise<AxiosResponse<ApiResponse<Exercise>>> =>
    api.post(`/training-plan/${planId}/daily/${date}/substitute`),

  // Tournaments
  addTournament: (planId: string, data: Record<string, unknown>): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    api.post(`/training-plan/${planId}/tournaments`, data),

  // Modification requests
  requestModification: (planId: string, data: Record<string, unknown>): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    api.post(`/training-plan/${planId}/modification-request`, data),

  getModificationRequests: (params: Record<string, unknown> = {}): Promise<AxiosResponse<ApiResponse<unknown[]>>> =>
    api.get('/training-plan/modification-requests', { params }),

  respondToModification: (requestId: string, data: { approved: boolean; response?: string }): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    api.put(`/training-plan/modification-requests/${requestId}/respond`, data),
};

// =============================================================================
// Calendar/Bookings API
// =============================================================================

export const calendarAPI = {
  getAvailability: (coachId: string, date: string): Promise<AxiosResponse<ApiResponse<unknown[]>>> =>
    api.get(`/availability?coachId=${coachId}&date=${date}`),

  createBooking: (data: Record<string, unknown>): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    api.post('/bookings', data),

  getBookings: (playerId: string): Promise<AxiosResponse<ApiResponse<unknown[]>>> =>
    api.get(`/bookings?playerId=${playerId}`),

  cancelBooking: (id: string): Promise<AxiosResponse<void>> =>
    api.delete(`/bookings/${id}`),

  createTournamentResult: (data: Record<string, unknown>): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    api.post('/calendar/tournament-result', data),

  getTournamentResults: (playerId: string): Promise<AxiosResponse<ApiResponse<unknown[]>>> =>
    api.get(`/calendar/tournament-results?playerId=${playerId}`),
};

// =============================================================================
// Coach Analytics API
// =============================================================================

export const analyticsAPI = {
  getPlayerOverview: (playerId: string): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get(`/coach-analytics/players/${playerId}/overview`),

  getCategoryProgression: (playerId: string): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get(`/coach-analytics/players/${playerId}/category-progression`),

  comparePlayers: (playerIds: string[]): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.post('/coach-analytics/compare-players', { playerIds }),

  getTeamAnalytics: (coachId: string): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get(`/coach-analytics/team/${coachId}`),

  getDashboard: (coachId: string): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get(`/coach-analytics/dashboard/${coachId}`),
};

// =============================================================================
// Peer Comparison API
// =============================================================================

export const peerComparisonAPI = {
  compare: (playerId: string, testId: string): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get(`/peer-comparison?playerId=${playerId}&testId=${testId}`),

  multiLevel: (playerId: string, testId: string): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get(`/peer-comparison/multi-level?playerId=${playerId}&testId=${testId}`),

  getPeerGroup: (category: string, gender: string, ageGroup: string): Promise<AxiosResponse<ApiResponse<Player[]>>> =>
    api.get(`/peer-comparison/peer-group?category=${category}&gender=${gender}&ageGroup=${ageGroup}`),
};

// =============================================================================
// Sessions API
// =============================================================================

export const sessionsAPI = {
  list: (params: SessionFilters = {}): Promise<AxiosResponse<ApiResponse<Session[]>>> =>
    api.get('/sessions', { params }),

  getMy: (params: SessionFilters = {}): Promise<AxiosResponse<ApiResponse<Session[]>>> =>
    api.get('/sessions/my', { params }),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<Session>>> =>
    api.get(`/sessions/${id}`),

  getInProgress: (): Promise<AxiosResponse<ApiResponse<Session[]>>> =>
    api.get('/sessions/in-progress'),

  create: (data: Partial<Session>): Promise<AxiosResponse<ApiResponse<Session>>> =>
    api.post('/sessions', data),

  update: (id: string, data: Partial<Session>): Promise<AxiosResponse<ApiResponse<Session>>> =>
    api.patch(`/sessions/${id}`, data),

  delete: (id: string): Promise<AxiosResponse<void>> =>
    api.delete(`/sessions/${id}`),

  updateEvaluation: (id: string, data: SessionEvaluation): Promise<AxiosResponse<ApiResponse<Session>>> =>
    api.patch(`/sessions/${id}/evaluation`, data),

  complete: (id: string, data: SessionEvaluation): Promise<AxiosResponse<ApiResponse<Session>>> =>
    api.post(`/sessions/${id}/complete`, data),

  autoComplete: (id: string): Promise<AxiosResponse<ApiResponse<Session>>> =>
    api.post(`/sessions/${id}/auto-complete`),

  getEvaluationStats: (params: Record<string, unknown> = {}): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get('/sessions/stats/evaluation', { params }),

  getTechnicalCues: (): Promise<AxiosResponse<ApiResponse<string[]>>> =>
    api.get('/sessions/technical-cues'),
};

// =============================================================================
// DataGolf API
// =============================================================================

export const dataGolfAPI = {
  getPlayer: (playerId: string): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get(`/datagolf/players/${playerId}`),

  getTourAverages: (tour: string, season?: number): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get('/datagolf/tour-averages', { params: { tour, season } }),

  compare: (playerId: string, tour: string, season?: number): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get('/datagolf/compare', { params: { playerId, tour, season } }),

  syncStatus: (): Promise<AxiosResponse<ApiResponse<{ lastSync: string; status: string }>>> =>
    api.get('/datagolf/sync-status'),

  triggerSync: (): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> =>
    api.post('/datagolf/sync'),

  getCoachDashboard: (tour = 'pga', season?: number): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get('/datagolf/coach/dashboard', { params: { tour, season } }),

  getProPlayers: (tour = 'pga', limit = 50): Promise<AxiosResponse<ApiResponse<Record<string, unknown>[]>>> =>
    api.get('/datagolf/pro-players', { params: { tour, limit } }),

  getApproachSkill: (params: Record<string, unknown> = {}): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get('/datagolf/approach-skill', { params }),

  getApproachSkillAverages: (tour: string, season?: number): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get('/datagolf/approach-skill/averages', { params: { tour, season } }),

  getTopApproachSkill: (distance: number, tour: string, season?: number, limit = 20): Promise<AxiosResponse<ApiResponse<Record<string, unknown>[]>>> =>
    api.get('/datagolf/approach-skill/top', { params: { distance, tour, season, limit } }),

  getPlayerApproachSkill: (playerName: string, tour: string, season?: number): Promise<AxiosResponse<ApiResponse<Record<string, unknown>>>> =>
    api.get(`/datagolf/approach-skill/player/${encodeURIComponent(playerName)}`, { params: { tour, season } }),
};

// =============================================================================
// Messages API
// =============================================================================

export const messagesAPI = {
  send: (data: Partial<Message>): Promise<AxiosResponse<ApiResponse<Message>>> =>
    api.post('/messages', data),

  schedule: (data: Partial<Message>): Promise<AxiosResponse<ApiResponse<Message>>> =>
    api.post('/messages/schedule', data),

  list: (params: Record<string, unknown>): Promise<AxiosResponse<ApiResponse<Message[]>>> =>
    api.get('/messages', { params }),

  delete: (id: string): Promise<AxiosResponse<void>> =>
    api.delete(`/messages/${id}`),

  sendNow: (id: string): Promise<AxiosResponse<ApiResponse<Message>>> =>
    api.post(`/messages/${id}/send-now`),

  getScheduled: (): Promise<AxiosResponse<ApiResponse<Message[]>>> =>
    api.get('/messages/scheduled'),
};

// =============================================================================
// Golf Courses API
// =============================================================================

export const golfCoursesAPI = {
  search: (params: { query?: string; country?: string; limit?: number } = {}): Promise<AxiosResponse<ApiResponse<GolfCourse[]>>> =>
    api.get('/golf-courses/search', { params }),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<GolfCourse>>> =>
    api.get(`/golf-courses/${id}`),

  getNorwegian: (): Promise<AxiosResponse<ApiResponse<GolfCourse[]>>> =>
    api.get('/golf-courses/norway'),

  getByCountry: (country: string): Promise<AxiosResponse<ApiResponse<GolfCourse[]>>> =>
    api.get(`/golf-courses/country/${encodeURIComponent(country)}`),

  getSyncStatus: (): Promise<AxiosResponse<ApiResponse<{ lastSync: string; status: string }>>> =>
    api.get('/golf-courses/sync/status'),

  sync: (country: string): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> =>
    api.post('/golf-courses/sync', { country }),
};

// =============================================================================
// Weather API
// =============================================================================

export const weatherAPI = {
  getCourseWeather: (courseId: string): Promise<AxiosResponse<ApiResponse<WeatherData>>> =>
    api.get(`/weather/course/${courseId}`),

  getClubWeather: (clubId: string): Promise<AxiosResponse<ApiResponse<WeatherData>>> =>
    api.get(`/weather/club/${clubId}`),

  getByLocation: (lat: number, lng: number): Promise<AxiosResponse<ApiResponse<WeatherData>>> =>
    api.get('/weather/location', { params: { lat, lng } }),

  getBestCourses: (limit = 10): Promise<AxiosResponse<ApiResponse<Array<GolfCourse & { weather: WeatherData }>>>> =>
    api.get('/weather/best-courses', { params: { limit } }),

  getRegionWeather: (city: string): Promise<AxiosResponse<ApiResponse<Array<GolfCourse & { weather: WeatherData }>>>> =>
    api.get('/weather/region', { params: { city } }),

  getWindForecast: (courseId: string): Promise<AxiosResponse<ApiResponse<WeatherData[]>>> =>
    api.get(`/weather/wind/${courseId}`),
};

// =============================================================================
// Settings API
// =============================================================================

export const settingsAPI = {
  saveNotifications: (data: Record<string, boolean>): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.post('/settings/notifications', data),
};

// =============================================================================
// Achievements API
// =============================================================================

export const achievementsAPI = {
  list: (category?: string): Promise<AxiosResponse<ApiResponse<Achievement[]>>> =>
    api.get('/achievements', { params: category ? { category } : {} }),

  getNew: (): Promise<AxiosResponse<ApiResponse<Achievement[]>>> =>
    api.get('/achievements/new'),

  getStats: (): Promise<AxiosResponse<ApiResponse<Record<string, number>>>> =>
    api.get('/achievements/stats'),

  getRecent: (limit = 5): Promise<AxiosResponse<ApiResponse<Achievement[]>>> =>
    api.get('/achievements/recent', { params: { limit } }),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<Achievement>>> =>
    api.get(`/achievements/${id}`),

  markViewed: (id: string): Promise<AxiosResponse<ApiResponse<Achievement>>> =>
    api.patch(`/achievements/${id}/viewed`),

  markAllViewed: (): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.post('/achievements/mark-all-viewed'),
};

// =============================================================================
// Badges API
// =============================================================================

export const badgesAPI = {
  getDefinitions: (includeUnavailable = true): Promise<AxiosResponse<ApiResponse<BadgeDefinition[]>>> =>
    api.get('/badges/definitions', { params: { includeUnavailable } }),

  getByCategory: (category: string, includeUnavailable = true): Promise<AxiosResponse<ApiResponse<BadgeDefinition[]>>> =>
    api.get(`/badges/definitions/${category}`, { params: { includeUnavailable } }),

  getProgress: (): Promise<AxiosResponse<ApiResponse<BadgeProgress[]>>> =>
    api.get('/badges/progress'),

  getRecent: (limit = 5): Promise<AxiosResponse<ApiResponse<BadgeProgress[]>>> =>
    api.get('/badges/recent', { params: { limit } }),

  getLeaderboard: (limit = 10): Promise<AxiosResponse<ApiResponse<Array<{ playerId: string; count: number }>>>> =>
    api.get('/badges/leaderboard', { params: { limit } }),

  award: (badgeId: string, playerId: string): Promise<AxiosResponse<ApiResponse<BadgeProgress>>> =>
    api.post('/badges/award', { badgeId, playerId }),
};

// =============================================================================
// Calibration API
// =============================================================================

export const calibrationAPI = {
  getCalibration: (playerId: string): Promise<AxiosResponse<ApiResponse<Calibration>>> =>
    api.get(`/calibration/player/${playerId}`),

  createCalibration: (data: Partial<Calibration>): Promise<AxiosResponse<ApiResponse<Calibration>>> =>
    api.post('/calibration', data),

  updateCalibration: (playerId: string, data: Partial<Calibration>): Promise<AxiosResponse<ApiResponse<Calibration>>> =>
    api.put(`/calibration/player/${playerId}`, data),

  deleteCalibration: (playerId: string): Promise<AxiosResponse<void>> =>
    api.delete(`/calibration/player/${playerId}`),

  startSession: (): Promise<AxiosResponse<ApiResponse<{ sessionId: string }>>> =>
    api.post('/calibration/start'),

  submitSamples: (sessionId: string, samples: Record<string, number>[]): Promise<AxiosResponse<ApiResponse<Calibration>>> =>
    api.post('/calibration/submit', { sessionId, samples }),
};

// =============================================================================
// Notes API
// =============================================================================

export const notesAPI = {
  getForPlayer: (playerId: string): Promise<AxiosResponse<ApiResponse<Note[]>>> =>
    api.get(`/notes/player/${playerId}`),

  getAll: (params: { playerId?: string; category?: string } = {}): Promise<AxiosResponse<ApiResponse<Note[]>>> =>
    api.get('/notes', { params }),

  getById: (noteId: string): Promise<AxiosResponse<ApiResponse<Note>>> =>
    api.get(`/notes/${noteId}`),

  create: (data: Partial<Note>): Promise<AxiosResponse<ApiResponse<Note>>> =>
    api.post('/notes', data),

  update: (noteId: string, data: Partial<Note>): Promise<AxiosResponse<ApiResponse<Note>>> =>
    api.put(`/notes/${noteId}`, data),

  delete: (noteId: string): Promise<AxiosResponse<void>> =>
    api.delete(`/notes/${noteId}`),
};

// =============================================================================
// Notifications API
// =============================================================================

export interface Notification {
  id: string;
  notificationType: string;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  nextCursor: string | null;
}

export const notificationsAPI = {
  getAll: (params: { unreadOnly?: string; limit?: string; cursor?: string } = {}): Promise<AxiosResponse<ApiResponse<NotificationsResponse>>> =>
    api.get('/notifications', { params }),

  getUnread: (): Promise<AxiosResponse<ApiResponse<NotificationsResponse>>> =>
    api.get('/notifications', { params: { unreadOnly: '1' } }),

  markRead: (id: string): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.patch(`/notifications/${id}/read`),

  markAllRead: (): Promise<AxiosResponse<ApiResponse<{ count: number }>>> =>
    api.post('/notifications/read-all'),

  getStreamStatus: (): Promise<AxiosResponse<ApiResponse<{ mode: string; activeSubscriptions: number; redisAvailable: boolean }>>> =>
    api.get('/notifications/stream/status'),
};

// =============================================================================
// Conversations/Messages API
// =============================================================================

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'coach_player';
  name?: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    role: string;
  }>;
  lastMessage?: {
    id: string;
    content: string;
    senderName: string;
    sentAt: string;
    isRead: boolean;
  };
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  createdAt: string;
  readBy: Array<{ userId: string; readAt: string }>;
}

export const conversationsAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<{ conversations: Conversation[]; total: number }>>> =>
    api.get('/messages/conversations'),

  getById: (id: string, params: { limit?: number; before?: string } = {}): Promise<AxiosResponse<ApiResponse<{ conversation: Conversation; messages: ConversationMessage[]; hasMore: boolean }>>> =>
    api.get(`/messages/conversations/${id}`, { params }),

  create: (data: { type: string; name?: string; participantIds: string[] }): Promise<AxiosResponse<ApiResponse<{ conversation: Conversation; existing: boolean }>>> =>
    api.post('/messages/conversations', data),

  markRead: (id: string): Promise<AxiosResponse<ApiResponse<{ markedAsRead: number }>>> =>
    api.post(`/messages/conversations/${id}/read`),

  sendMessage: (conversationId: string, content: string, attachments?: Array<{ type: string; url: string; name: string }>): Promise<AxiosResponse<ApiResponse<{ message: ConversationMessage }>>> =>
    api.post(`/messages/conversations/${conversationId}/messages`, { content, attachments }),

  editMessage: (messageId: string, content: string): Promise<AxiosResponse<ApiResponse<{ message: ConversationMessage }>>> =>
    api.patch(`/messages/messages/${messageId}`, { content }),

  deleteMessage: (messageId: string): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.delete(`/messages/messages/${messageId}`),

  getUnreadCount: (): Promise<AxiosResponse<ApiResponse<{ unreadCount: number }>>> =>
    api.get('/messages/unread-count'),
};

// =============================================================================
// Tournaments API
// =============================================================================

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location?: string;
  courseName?: string;
  city?: string;
  tournamentType?: string;
  level?: string;
  format?: string;
  entryFee?: number;
  maxParticipants?: number;
  currentParticipants?: number;
  registrationDeadline?: string;
  status?: string;
  description?: string;
}

export interface TournamentResult {
  id: string;
  name: string;
  date: string;
  location: string;
  result: {
    position: number;
    score: number;
    field: number;
  };
}

export const tournamentsAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<Tournament[]>>> =>
    api.get('/calendar/tournaments'),

  getMy: (): Promise<AxiosResponse<ApiResponse<{ registered: Tournament[]; pastResults: TournamentResult[] }>>> =>
    api.get('/calendar/my-tournaments'),

  getExternal: (): Promise<AxiosResponse<ApiResponse<{ tournaments: Tournament[] }>>> =>
    api.get('/calendar/external-tournaments'),

  addToCalendar: (tournamentId: string, data?: Record<string, unknown>): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.post('/calendar/add-tournament', { tournamentId, ...data }),

  recordResult: (data: { tournamentId: string; playerId: string; position: number; score: number; totalField: number }): Promise<AxiosResponse<ApiResponse<TournamentResult>>> =>
    api.post('/calendar/tournament-result', data),
};

// =============================================================================
// useApi Hook
// =============================================================================

/**
 * Hook for making API calls with built-in error handling
 * Returns an object with get and post methods
 */
export function useApi() {
  const get = async <T>(url: string): Promise<T> => {
    const response = await api.get<T>(url);
    return response.data;
  };

  const post = async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await api.post<T>(url, data);
    return response.data;
  };

  const put = async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await api.put<T>(url, data);
    return response.data;
  };

  const del = async <T>(url: string): Promise<T> => {
    const response = await api.delete<T>(url);
    return response.data;
  };

  return { get, post, put, delete: del };
}

// =============================================================================
// Export
// =============================================================================

export default api;
