import axios from 'axios';

const api = axios.create({
  baseURL: 'http://supplyradar.local/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor: Attach Sanctum Token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token'); // We will also store it in Pinia, but fallback if needed, or get it from store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    // Maybe trigger logout or clear token
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;
