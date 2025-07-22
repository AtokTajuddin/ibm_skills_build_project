// api.js - Centralized API configuration
const API_BASE_URL = process.env.REACT_APP_BACKEND_BASEURL || 'https://virtual-hospital-project-git-master-atoktajuddins-projects.vercel.app/api';

// Export configured API base URL
export const apiBaseUrl = API_BASE_URL;

// Export specific API endpoints
export const endpoints = {
  subscriber: `${API_BASE_URL}/subscriber`,
  stats: `${API_BASE_URL}/stripe/api/stats`,
  products: `${API_BASE_URL}/product`,
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    verify: `${API_BASE_URL}/auth/verify`,
    profile: `${API_BASE_URL}/auth/profile`,
  },
  virtualDoctor: `${API_BASE_URL}/virtual-doctor`,
};

export default {
  baseUrl: API_BASE_URL,
  endpoints
};
