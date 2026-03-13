import axios from 'axios';

const API_BASE_URL = '/api';
const SERVER_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper function to get full image URL
export const getImageUrl = (path: string): string => {
  if (!path) return '';
  // If path already includes http/https, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Otherwise, prepend server base URL
  return `${SERVER_BASE_URL}${path}`;
};

// Picture Book APIs
export const createPictureBook = async (formData: FormData) => {
  const response = await api.post('/picturebooks', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePictureBook = async (id: string, formData: FormData) => {
  const response = await api.put(`/picturebooks/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deletePictureBook = async (id: string) => {
  const response = await api.delete(`/picturebooks/${id}`);
  return response.data;
};