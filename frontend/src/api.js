import axios from 'axios';

// Mengecek apakah proyek menggunakan Vite atau React biasa (CRA)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Membuat instance axios terpusat
const API = axios.create({
  baseURL: API_URL,
});

// Otomatis menyertakan token JWT jika pengguna sudah login (opsional tapi sangat berguna)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper untuk mengambil pesan error secara aman dari response API
export const getErrorMessage = (err, defaultMsg = 'Something went wrong') => {
  if (err.response && err.response.data) {
    const data = err.response.data;
    if (typeof data === 'string') {
      return data;
    }
    if (typeof data === 'object') {
      return data.msg || data.message || data.error || JSON.stringify(data);
    }
  }
  return err.message || defaultMsg;
};

// Response Interceptor untuk menangani token kedaluwarsa (401 Unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Arahkan ke halaman login jika terjadi error 401
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;