import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const errorData = error.response.data;

      // Handle 401 - redirect to login (unless already on login page)
      if (error.response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        // Avoid redirect loop on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      // Handle 403 - log forbidden access attempt
      if (error.response.status === 403) {
        console.warn('[Auth] Forbidden access:', error.config?.url);
      }

      // Return standardized error
      return Promise.reject({
        type: errorData?.type || 'system_failure',
        message: errorData?.message || 'An error occurred',
        details: errorData?.details,
        status: error.response.status,
      });
    }

    // Network or timeout error
    return Promise.reject({
      type: 'system_failure',
      message: 'Network error. Please check your connection.',
      status: 0,
    });
  }
);

export default apiClient;
