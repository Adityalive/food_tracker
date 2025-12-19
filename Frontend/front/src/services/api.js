import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export const foodAPI = {
  // CHANGE: Now accepts formData directly
  identifyFood: (formData) => api.post('/food/identify', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export const nutritionAPI = {
  getNutrition: (foodName, quantity = 100) => api.get(`/nutrition/search?query=${encodeURIComponent(foodName)}&quantity=${quantity}`),
};

export default api;
