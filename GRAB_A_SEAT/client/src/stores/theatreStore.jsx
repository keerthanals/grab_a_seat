import { create } from 'zustand';
import { adminAPI, ownerAPI } from '../services/api';

const useTheatreStore = create((set, get) => ({
  theatres: [],
  showtimes: [],
  isLoading: false,
  error: null,
  
  fetchTheatres: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await adminAPI.getAllTheatres();
      const theatres = response.theatres || response || [];
      set({ theatres, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch theatres:', error);
      set({
        error: error.message || 'Failed to fetch theatres',
        isLoading: false,
      });
    }
  },
  
  fetchOwnerTheatres: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await ownerAPI.getOwnerTheatres();
      const theatres = response.theatres || response || [];
      set({ theatres, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch owner theatres:', error);
      set({
        error: error.message || 'Failed to fetch theatres',
        isLoading: false,
      });
    }
  },
  
  fetchShowtimes: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Get all theatres which should include showtimes
      const response = await adminAPI.getAllTheatres();
      
      // Extract showtimes from theatres data
      let allShowtimes = [];
      const theatres = response.theatres || response || [];
      
      theatres.forEach(theatre => {
        if (theatre.showtimes && Array.isArray(theatre.showtimes)) {
          allShowtimes = [...allShowtimes, ...theatre.showtimes];
        }
      });
      
      set({ showtimes: allShowtimes, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch showtimes:', error);
      set({
        error: error.message || 'Failed to fetch showtimes',
        isLoading: false,
      });
    }
  },
  
  approveTheatre: async (id) => {
    try {
      await adminAPI.approveRejectTheatre(id, 'approve');
      
      set((state) => ({
        theatres: state.theatres.map((theatre) =>
          theatre.id === id ? { ...theatre, approved: true } : theatre
        ),
      }));
    } catch (error) {
      console.error('Failed to approve theatre:', error);
      set({ error: error.message || 'Failed to approve theatre' });
      throw error;
    }
  },
  
  rejectTheatre: async (id) => {
    try {
      await adminAPI.approveRejectTheatre(id, 'reject');
      
      set((state) => ({
        theatres: state.theatres.filter((theatre) => theatre.id !== id),
      }));
    } catch (error) {
      console.error('Failed to reject theatre:', error);
      set({ error: error.message || 'Failed to reject theatre' });
      throw error;
    }
  },
  
  addTheatre: async (theatreData) => {
    try {
      const response = await ownerAPI.createTheatre(theatreData);
      const newTheatre = response.theatre || response;
      
      set((state) => ({
        theatres: [...state.theatres, newTheatre],
      }));
      
      return newTheatre;
    } catch (error) {
      console.error('Failed to create theatre:', error);
      set({ error: error.message || 'Failed to create theatre' });
      throw error;
    }
  },
  
  addShowtime: async (showtimeData) => {
    try {
      const response = await ownerAPI.createShow(showtimeData);
      const newShowtime = response.showtime || response;
      
      set((state) => ({
        showtimes: [...state.showtimes, newShowtime],
      }));
      
      return newShowtime;
    } catch (error) {
      console.error('Failed to create showtime:', error);
      set({ error: error.message || 'Failed to create showtime' });
      throw error;
    }
  },
  
  clearError: () => set({ error: null }),
}));

export { useTheatreStore };