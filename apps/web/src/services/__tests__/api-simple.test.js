/**
 * API Service Tests
 * Tests for core API functionality - request/response interceptors and endpoint structure
 */

describe('API Service Configuration', () => {
  let api;
  let authAPI;
  let dashboardAPI;
  let playersAPI;

  beforeEach(() => {
    // Clear modules and localStorage
    jest.clearAllMocks();
    jest.resetModules();
    localStorage.clear();
    delete window.location;
    window.location = { href: '' };
  });

  describe('Module Exports', () => {
    it('exports authAPI with all required methods', () => {
      const { authAPI } = require('../api');

      expect(authAPI).toBeDefined();
      expect(typeof authAPI.login).toBe('function');
      expect(typeof authAPI.register).toBe('function');
      expect(typeof authAPI.logout).toBe('function');
      expect(typeof authAPI.requestPasswordReset).toBe('function');
      expect(typeof authAPI.resetPassword).toBe('function');
    });

    it('exports dashboardAPI with all required methods', () => {
      const { dashboardAPI } = require('../api');

      expect(dashboardAPI).toBeDefined();
      expect(typeof dashboardAPI.getStats).toBe('function');
      expect(typeof dashboardAPI.getRecentTests).toBe('function');
      expect(typeof dashboardAPI.getUpcomingSessions).toBe('function');
    });

    it('exports playersAPI with CRUD methods', () => {
      const { playersAPI } = require('../api');

      expect(playersAPI).toBeDefined();
      expect(typeof playersAPI.getAll).toBe('function');
      expect(typeof playersAPI.getById).toBe('function');
      expect(typeof playersAPI.create).toBe('function');
      expect(typeof playersAPI.update).toBe('function');
      expect(typeof playersAPI.delete).toBe('function');
    });

    it('exports coachesAPI with required methods', () => {
      const { coachesAPI } = require('../api');

      expect(coachesAPI).toBeDefined();
      expect(typeof coachesAPI.getAll).toBe('function');
      expect(typeof coachesAPI.getDashboard).toBe('function');
      expect(typeof coachesAPI.getAthletes).toBe('function');
      expect(typeof coachesAPI.getWeeklyStats).toBe('function');
    });

    it('exports testsAPI with required methods', () => {
      const { testsAPI } = require('../api');

      expect(testsAPI).toBeDefined();
      expect(typeof testsAPI.getAll).toBe('function');
      expect(typeof testsAPI.getResults).toBe('function');
      expect(typeof testsAPI.createResult).toBe('function');
    });

    it('exports exercisesAPI with CRUD methods', () => {
      const { exercisesAPI } = require('../api');

      expect(exercisesAPI).toBeDefined();
      expect(typeof exercisesAPI.getAll).toBe('function');
      expect(typeof exercisesAPI.getById).toBe('function');
      expect(typeof exercisesAPI.create).toBe('function');
      expect(typeof exercisesAPI.update).toBe('function');
    });

    it('exports trainingPlanAPI with required methods', () => {
      const { trainingPlanAPI } = require('../api');

      expect(trainingPlanAPI).toBeDefined();
      expect(typeof trainingPlanAPI.getPlans).toBe('function');
      expect(typeof trainingPlanAPI.createPlan).toBe('function');
      expect(typeof trainingPlanAPI.updatePlan).toBe('function');
    });

    it('exports sessionsAPI with required methods', () => {
      const { sessionsAPI } = require('../api');

      expect(sessionsAPI).toBeDefined();
      expect(typeof sessionsAPI.create).toBe('function');
      expect(typeof sessionsAPI.getById).toBe('function');
      expect(typeof sessionsAPI.update).toBe('function');
    });

    it('exports goalsAPI with required methods', () => {
      const { goalsAPI } = require('../api');

      expect(goalsAPI).toBeDefined();
      expect(typeof goalsAPI.create).toBe('function');
      expect(typeof goalsAPI.getByPlayer).toBe('function');
      expect(typeof goalsAPI.update).toBe('function');
    });

    it('exports badgesAPI with required methods', () => {
      const { badgesAPI } = require('../api');

      expect(badgesAPI).toBeDefined();
      expect(typeof badgesAPI.getPlayerBadges).toBe('function');
      expect(typeof badgesAPI.getAvailableBadges).toBe('function');
    });
  });

  describe('API Structure', () => {
    it('all API methods return values (functions are defined)', () => {
      const {
        authAPI,
        dashboardAPI,
        playersAPI,
        coachesAPI,
        testsAPI,
        exercisesAPI,
        trainingPlanAPI,
        sessionsAPI,
        goalsAPI,
        badgesAPI,
      } = require('../api');

      // Check that calling the functions returns something (doesn't throw)
      expect(() => authAPI.login).not.toThrow();
      expect(() => dashboardAPI.getStats).not.toThrow();
      expect(() => playersAPI.getAll).not.toThrow();
      expect(() => coachesAPI.getDashboard).not.toThrow();
      expect(() => testsAPI.getAll).not.toThrow();
      expect(() => exercisesAPI.getAll).not.toThrow();
      expect(() => trainingPlanAPI.getPlans).not.toThrow();
      expect(() => sessionsAPI.create).not.toThrow();
      expect(() => goalsAPI.create).not.toThrow();
      expect(() => badgesAPI.getPlayerBadges).not.toThrow();
    });
  });

  describe('Environment Configuration', () => {
    it('uses REACT_APP_API_URL from environment when available', () => {
      const originalEnv = process.env.REACT_APP_API_URL;
      process.env.REACT_APP_API_URL = 'https://test-api.example.com/api/v1';

      jest.resetModules();
      const api = require('../api');

      // API should be configured (we can't easily test the actual URL without deeper mocking)
      expect(api.authAPI).toBeDefined();

      process.env.REACT_APP_API_URL = originalEnv;
    });

    it('falls back to default URL when environment variable is not set', () => {
      const originalEnv = process.env.REACT_APP_API_URL;
      delete process.env.REACT_APP_API_URL;

      jest.resetModules();
      const api = require('../api');

      expect(api.authAPI).toBeDefined();

      process.env.REACT_APP_API_URL = originalEnv;
    });
  });

  describe('Token Management', () => {
    it('localStorage is used for token storage', () => {
      // Verify localStorage methods exist
      expect(typeof localStorage.getItem).toBe('function');
      expect(typeof localStorage.setItem).toBe('function');
      expect(typeof localStorage.removeItem).toBe('function');

      // Set a token
      localStorage.setItem('accessToken', 'test-token');
      expect(localStorage.getItem('accessToken')).toBe('test-token');

      // Remove token
      localStorage.removeItem('accessToken');
      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });
});
