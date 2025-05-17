import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
  baseURL: BASE_URL,            // veya `${BASE_URL}/api/v1` yapabilirisin
  timeout: 10000,               // 10 saniye
  withCredentials: true,        // gerekliyse çerezleri de gönder
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor: token ekle
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: global hata yönetimi
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (status === 500) {
        console.error('Server error. Please try again later.', error.response.data);
      }
    } else {
      console.error('Network or CORS error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
