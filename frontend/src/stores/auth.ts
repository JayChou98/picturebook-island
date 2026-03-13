import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, LoginRequest, RegisterRequest, UpdateProfileRequest } from '@/types/user';
import api from '@/utils/api';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const loadUser = async () => {
    if (!token.value) return;
    
    loading.value = true;
    try {
      const response = await api.get('/auth/me');
      user.value = response.data.user;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load user';
      logout();
    } finally {
      loading.value = false;
    }
  };

  const login = async (credentials: LoginRequest) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/auth/login', credentials);
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/');
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const register = async (data: RegisterRequest) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/auth/register', data);
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/');
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (data: UpdateProfileRequest) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.put('/auth/profile', data);
      user.value = response.data.user;
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Update failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    loadUser,
    login,
    register,
    updateProfile,
    logout
  };
});