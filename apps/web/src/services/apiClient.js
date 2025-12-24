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

      // Handle 401 - redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
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
