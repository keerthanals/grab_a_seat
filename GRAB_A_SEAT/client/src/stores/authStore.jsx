import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  initializeAuth: () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    console.log('Initializing auth:', { hasToken: !!token, hasUserData: !!userData });

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        console.log('Auth initialized with user:', { id: user._id || user.id, role: user.role, status: user.status });
        set({ user, isAuthenticated: true });
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    set({ isInitialized: true });
  },
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('Attempting login for:', email);
      const response = await authAPI.login({ email, password });
      
      console.log('Login response:', { 
        hasToken: !!response.token, 
        userId: response.user._id || response.user.id,
        userRole: response.user.role,
        userStatus: response.user.status
      });
      
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
      console.error('Login error:', error);
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
      console.log('Attempting registration:', { name, email, role });
      const response = await authAPI.register({ name, email, password, role });
      
      console.log('Registration response:', { 
        requiresApproval: response.requiresApproval,
        hasToken: !!response.token,
        userRole: response.user?.role,
        userStatus: response.user?.status
      });
      
      // For admin role, don't auto-login, show pending approval message
      if (role === 'admin') {
        set({ isLoading: false });
        return { ...response, requiresApproval: true };
      }
      
      // Store token and user data for other roles
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
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
      console.log('User logged out successfully');
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