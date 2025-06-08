import { create } from 'zustand';
import axios from 'axios';

// Optional: centralize base URL
const API = axios.create({
  baseURL: 'http://localhost:3001/api/user',
});

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isAuthLoaded: false,

  register: async (name, email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const res = await API.post('/register', { name, email, password, role });

      const { user, token } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        isAuthLoaded: true,
      });

      return true; // ✅ successful
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false, isAuthLoaded: true });
      return false; // ❌ failed
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await API.post('/login', { email, password });

      const { user, token } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        isAuthLoaded: true,
      });

      return true; // ✅ successful
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false, isAuthLoaded: true });
      return false; // ❌ failed
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAuthLoaded: true,
    });
  },

  loadUserFromStorage: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
        isAuthLoaded: true,
      });
    } else {
      set({ isAuthLoaded: true });
    }
  },
}));
