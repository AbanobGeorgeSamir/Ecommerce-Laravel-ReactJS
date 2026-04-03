import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const APP_BASE_URL = import.meta.env.VITE_APP_URL || 'http://localhost:8000';

export const getStoredToken = () => localStorage.getItem('token');

export const clearStoredAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';
    const isAuthFormRequest = requestUrl.includes('/login') || requestUrl.includes('/register');

    if (status === 401 && !isAuthFormRequest && getStoredToken()) {
      clearStoredAuth();

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const getCsrfCookie = () =>
  axios.get(`${APP_BASE_URL}/sanctum/csrf-cookie`, {
    withCredentials: true
  });

export const fetchAuthenticatedUser = async () => {
  const { data } = await api.get('/user');
  return data;
};

export default api;
