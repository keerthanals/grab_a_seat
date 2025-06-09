import { create } from 'zustand';
import { adminAPI, ownerAPI, publicAPI } from '../services/api';

const useTheatreStore = create((set, get) => ({
  theatres: [],
  showtimes: [],
  isLoading: false,
  error: null,
  
  fetchTheatres: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const theatres = await publicAPI.getAllTheatres();
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
      const theatres = await ownerAPI.getOwnerTheatres();
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
      // Note: You might need to add a public endpoint for showtimes
      // For now, using admin endpoint
      const showtimes = await adminAPI.getAllTheatres(); // Adjust this endpoint
      set({ showtimes: showtimes.showtimes || [], isLoading: false });
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
      const newTheatre = await ownerAPI.createTheatre(theatreData);
      
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
      const newShowtime = await ownerAPI.createShow(showtimeData);
      
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