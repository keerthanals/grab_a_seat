import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false, // <- NEW
  error: null,

  initializeAuth: () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        set({ user, isAuthenticated: true });
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    set({ isInitialized: true }); // <- FINISH INITIALIZATION
  },
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authAPI.login({ email, password });
      
      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      return response;
    } catch (error) {
      set({ 
        error: error.message || 'Login failed', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  register: async (name, email, password, role = 'user') => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authAPI.register({ name, email, password, role });
      
      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      return response;
    } catch (error) {
      set({ 
        error: error.message || 'Registration failed', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      set({ user: null, isAuthenticated: false, error: null });
    }
  },
  
  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authAPI.updateProfile(userData);
      
      // Update stored user data
      localStorage.setItem('userData', JSON.stringify(response.user));
      
      set({ 
        user: response.user, 
        isLoading: false 
      });
      
      return response;
    } catch (error) {
      set({ 
        error: error.message || 'Profile update failed', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  clearError: () => set({ error: null }),
}));

export { useAuthStore };