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

export default API;