import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL
});

// CSRF token management - seamless implementation
let csrfToken = null;
let csrfPromise = null;

// Function to get CSRF token with caching
const getCSRFToken = async () => {
  // If already fetching, wait for the existing promise
  if (csrfPromise) {
    return csrfPromise;
  }

  // If token exists and is still valid, use it
  if (csrfToken) {
    return csrfToken;
  }

  // Fetch new token
  csrfPromise = api.get('/auth/csrf-token')
    .then(response => {
      if (response.data.success) {
        csrfToken = response.data.csrfToken;
        csrfPromise = null; // Clear promise
        return csrfToken;
      }
      throw new Error('Failed to get CSRF token');
    })
    .catch(error => {
      console.warn('Could not get CSRF token:', error);
      csrfPromise = null; // Clear promise on error
      return null;
    });

  return csrfPromise;
};

// Add interceptor for seamless auth and CSRF handling
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add CSRF token for state-changing requests (except Firebase/Google auth)
  const isFirebaseRoute = config.url?.includes('firebase') || config.url?.includes('google');
  
  if (['post', 'put', 'delete', 'patch'].includes(config.method.toLowerCase()) && !isFirebaseRoute) {
    try {
      const csrf = await getCSRFToken();
      if (csrf) {
        config.headers['X-CSRF-Token'] = csrf;
      }
    } catch (error) {
      // Silently continue without CSRF if it fails
      console.warn('CSRF token fetch failed, continuing without it');
    }
  }

  return config;
});

// Add response interceptor for seamless error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle CSRF token errors by refreshing token and retrying
    if (error.response?.status === 403 && 
        error.response?.data?.message?.includes('CSRF') &&
        !originalRequest._retry) {
      
      originalRequest._retry = true;
      csrfToken = null; // Clear cached token
      
      try {
        const newToken = await getCSRFToken();
        if (newToken) {
          originalRequest.headers['X-CSRF-Token'] = newToken;
          return api.request(originalRequest);
        }
      } catch (retryError) {
        console.error('CSRF retry failed:', retryError);
      }
    }

    // Handle auth token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth services with seamless CSRF handling
export const authService = {
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
  
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  
  firebaseLogin: async (tokenData) => {
    return api.post('/auth/firebase-login', tokenData);
  },
  
  refreshToken: async (refreshToken) => {
    return api.post('/auth/refresh', { refreshToken });
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      // Clear local storage and CSRF token
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      csrfToken = null;
    }
  },
  
  logoutAll: async () => {
    try {
      await api.post('/auth/logout-all');
    } catch (error) {
      console.warn('Logout all request failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      csrfToken = null;
    }
  },
  
  getSessions: () => api.get('/auth/sessions')
};

// Virtual doctor service
export const virtualDoctorService = {
  sendMessage: (message, conversationId) => api.post('/virtual-doctor/message', { message, conversationId }),
  getConversations: () => api.get('/virtual-doctor/conversations'),
  getConversation: (id) => api.get(`/virtual-doctor/conversations/${id}`)
};

export default api;
