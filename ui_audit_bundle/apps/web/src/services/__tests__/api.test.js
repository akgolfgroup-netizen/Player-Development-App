// Mock axios before importing anything
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };

  return {
    create: jest.fn(() => mockAxiosInstance),
    default: {
      create: jest.fn(() => mockAxiosInstance),
    },
  };
});

const axios = require('axios');

describe('API Service', () => {
  let mockAxiosInstance;
  let requestInterceptor;
  let responseInterceptor;

  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    localStorage.clear();
    delete window.location;
    window.location = { href: '' };

    // Setup mock axios instance
    mockAxiosInstance = {
      get: jest.fn(() => Promise.resolve({ data: {} })),
      post: jest.fn(() => Promise.resolve({ data: {} })),
      put: jest.fn(() => Promise.resolve({ data: {} })),
      delete: jest.fn(() => Promise.resolve({ data: {} })),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    };

    axios.create.mockReturnValue(mockAxiosInstance);

    // Capture interceptors when they're registered
    mockAxiosInstance.interceptors.request.use.mockImplementation((success, error) => {
      requestInterceptor = { success, error };
    });

    mockAxiosInstance.interceptors.response.use.mockImplementation((success, error) => {
      responseInterceptor = { success, error };
    });

    // Re-require the module to get fresh instance
    jest.resetModules();
    require('../api');
  });

  describe('Base Configuration', () => {
    it('creates axios instance with correct base URL', () => {
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: expect.stringMatching(/\/api\/v1$/),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('uses environment variable for API URL if available', () => {
      const originalEnv = process.env.REACT_APP_API_URL;
      process.env.REACT_APP_API_URL = 'https://api.example.com/api/v1';

      jest.resetModules();
      require('../api');

      process.env.REACT_APP_API_URL = originalEnv;
    });

    it('falls back to localhost when environment variable is not set', () => {
      const originalEnv = process.env.REACT_APP_API_URL;
      delete process.env.REACT_APP_API_URL;

      jest.resetModules();
      require('../api');

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'http://localhost:4000/api/v1',
        })
      );

      process.env.REACT_APP_API_URL = originalEnv;
    });
  });

  describe('Request Interceptor', () => {
    it('registers request interceptor', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    });

    it('adds Authorization header when token exists', () => {
      const token = 'test-token-123';
      localStorage.setItem('accessToken', token);

      const config = { headers: {} };
      const result = requestInterceptor.success(config);

      expect(result.headers.Authorization).toBe(`Bearer ${token}`);
    });

    it('does not add Authorization header when token is missing', () => {
      const config = { headers: {} };
      const result = requestInterceptor.success(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('handles request errors', async () => {
      const error = new Error('Request error');
      await expect(requestInterceptor.error(error)).rejects.toThrow('Request error');
    });
  });

  describe('Response Interceptor', () => {
    it('registers response interceptor', () => {
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });

    it('passes through successful responses', () => {
      const response = { data: { success: true } };
      const result = responseInterceptor.success(response);

      expect(result).toEqual(response);
    });

    it('handles 401 errors by clearing token and redirecting', async () => {
      localStorage.setItem('accessToken', 'test-token');
      const error = {
        response: { status: 401 },
      };

      await expect(responseInterceptor.error(error)).rejects.toEqual(error);
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(window.location.href).toBe('/login');
    });

    it('passes through non-401 errors', async () => {
      const error = {
        response: { status: 500 },
      };

      await expect(responseInterceptor.error(error)).rejects.toEqual(error);
      expect(window.location.href).toBe('');
    });

    it('handles errors without response object', async () => {
      const error = new Error('Network error');

      await expect(responseInterceptor.error(error)).rejects.toEqual(error);
    });
  });

  describe('Auth API', () => {
    const { authAPI } = require('../api');

    it('login makes POST request with credentials', () => {
      authAPI.login('test@example.com', 'password123');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('register makes POST request with data', () => {
      const userData = { email: 'new@example.com', password: 'pass', name: 'User' };
      authAPI.register(userData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/register', userData);
    });

    it('logout makes POST request', () => {
      authAPI.logout();

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/logout');
    });

    it('requestPasswordReset makes POST request with email', () => {
      authAPI.requestPasswordReset('user@example.com');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/forgot-password', {
        email: 'user@example.com',
      });
    });

    it('resetPassword makes POST request with token and new password', () => {
      authAPI.resetPassword('reset-token', 'user@example.com', 'newpass');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/reset-password', {
        token: 'reset-token',
        email: 'user@example.com',
        newPassword: 'newpass',
      });
    });
  });

  describe('Dashboard API', () => {
    const { dashboardAPI } = require('../api');

    it('getStats makes GET request with player ID', () => {
      dashboardAPI.getStats('player-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/dashboard/player-123');
    });

    it('getRecentTests makes GET request with player ID', () => {
      dashboardAPI.getRecentTests('player-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/dashboard/player-123/recent-tests');
    });

    it('getUpcomingSessions makes GET request with player ID', () => {
      dashboardAPI.getUpcomingSessions('player-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/dashboard/player-123/upcoming-sessions');
    });
  });

  describe('Players API', () => {
    const { playersAPI } = require('../api');

    it('getAll makes GET request', () => {
      playersAPI.getAll();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/players');
    });

    it('getById makes GET request with ID', () => {
      playersAPI.getById('player-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/players/player-123');
    });

    it('create makes POST request with data', () => {
      const playerData = { name: 'John Doe', email: 'john@example.com' };
      playersAPI.create(playerData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/players', playerData);
    });

    it('update makes PUT request with ID and data', () => {
      const playerData = { name: 'John Updated' };
      playersAPI.update('player-123', playerData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/players/player-123', playerData);
    });

    it('delete makes DELETE request with ID', () => {
      playersAPI.delete('player-123');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/players/player-123');
    });
  });

  describe('Coaches API', () => {
    const { coachesAPI } = require('../api');

    it('getAll makes GET request', () => {
      coachesAPI.getAll();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coaches');
    });

    it('getById makes GET request with ID', () => {
      coachesAPI.getById('coach-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coaches/coach-123');
    });

    it('getDashboard makes GET request', () => {
      coachesAPI.getDashboard();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coaches/dashboard');
    });

    it('getAthletes makes GET request', () => {
      coachesAPI.getAthletes();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coaches/athletes');
    });

    it('getWeeklyStats makes GET request', () => {
      coachesAPI.getWeeklyStats();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/coaches/stats/weekly');
    });
  });

  describe('Tests API', () => {
    const { testsAPI } = require('../api');

    it('getAll makes GET request', () => {
      testsAPI.getAll();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tests');
    });

    it('getResults makes GET request with player ID query param', () => {
      testsAPI.getResults('player-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tests/results?playerId=player-123');
    });

    it('createResult makes POST request with data', () => {
      const testData = { score: 85, testId: 'test-1' };
      testsAPI.createResult(testData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/tests/results/enhanced', testData);
    });

    it('getResultById makes GET request with ID', () => {
      testsAPI.getResultById('result-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tests/results/result-123/enhanced');
    });
  });

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      const { authAPI } = require('../api');
      mockAxiosInstance.post.mockRejectedValue(new Error('Network Error'));

      await expect(authAPI.login('test@example.com', 'password')).rejects.toThrow('Network Error');
    });

    it('handles API errors with response data', async () => {
      const { playersAPI } = require('../api');
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid input' },
        },
      };
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(playersAPI.getAll()).rejects.toEqual(error);
    });
  });

  describe('Token Management', () => {
    it('retrieves token from localStorage for each request', () => {
      const token1 = 'token-1';
      localStorage.setItem('accessToken', token1);

      let config = { headers: {} };
      requestInterceptor.success(config);
      expect(config.headers.Authorization).toBe(`Bearer ${token1}`);

      // Change token
      const token2 = 'token-2';
      localStorage.setItem('accessToken', token2);

      config = { headers: {} };
      requestInterceptor.success(config);
      expect(config.headers.Authorization).toBe(`Bearer ${token2}`);
    });

    it('removes token on 401 error', async () => {
      localStorage.setItem('accessToken', 'test-token');
      const error = { response: { status: 401 } };

      await expect(responseInterceptor.error(error)).rejects.toEqual(error);
      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });
});
