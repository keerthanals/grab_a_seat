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
      
      // Extract showtimes from theatres if they exist
      let allShowtimes = [];
      theatres.forEach(theatre => {
        if (theatre.showtimes && Array.isArray(theatre.showtimes)) {
          const theatreShowtimes = theatre.showtimes.map(showtime => ({
            ...showtime,
            theatreId: theatre.id
          }));
          allShowtimes = [...allShowtimes, ...theatreShowtimes];
        }
      });
      
      set({ theatres, showtimes: allShowtimes, isLoading: false });
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
    // This is now handled in fetchTheatres
    return;
  },
  
  approveTheatre: async (id) => {
    try {
      await adminAPI.approveRejectTheatre(id, 'approve');
      
      set((state) => ({
        theatres: state.theatres.map((theatre) =>
          theatre.id === id ? { ...theatre, approved: true, status: 'approved' } : theatre
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
      
      // Transform the theatre data to match frontend expectations
      const transformedTheatre = {
        id: newTheatre._id.toString(),
        name: newTheatre.name,
        location: newTheatre.location,
        ownerId: newTheatre.ownerID,
        approved: newTheatre.status === 'approved',
        status: newTheatre.status,
        screens: Array.from({ length: newTheatre.totalScreens }, (_, i) => ({
          id: `screen-${i + 1}`,
          name: `Screen ${i + 1}`,
          seatLayout: {
            rows: 10,
            columns: 12,
            seatMap: generateSeatMap(10, 12)
          }
        })),
        createdAt: newTheatre.createdAt
      };
      
      set((state) => ({
        theatres: [...state.theatres, transformedTheatre],
      }));
      
      return transformedTheatre;
    } catch (error) {
      console.error('Failed to create theatre:', error);
      set({ error: error.message || 'Failed to create theatre' });
      throw error;
    }
  },
  
  addShowtime: async (showtimeData) => {
    try {
      const response = await ownerAPI.createShow(showtimeData);
      const newShowtime = response.show || response;
      
      // Transform showtime data to match frontend expectations
      const transformedShowtime = {
        id: newShowtime._id.toString(),
        movieId: newShowtime.movieID,
        theatreId: newShowtime.theatreID,
        screenId: `screen-${newShowtime.screenNumber}`,
        date: newShowtime.date,
        startTime: newShowtime.startTime,
        price: newShowtime.price,
        totalSeats: newShowtime.totalSeats,
        availableSeats: newShowtime.availableSeats
      };
      
      set((state) => ({
        showtimes: [...state.showtimes, transformedShowtime],
      }));
      
      return transformedShowtime;
    } catch (error) {
      console.error('Failed to create showtime:', error);
      set({ error: error.message || 'Failed to create showtime' });
      throw error;
    }
  },
  
  clearError: () => set({ error: null }),
}));

// Helper function to generate seat map
const generateSeatMap = (rows, columns) => {
  const seatMap = {};
  for (let row = 0; row < rows; row++) {
    const rowLabel = String.fromCharCode(65 + row); // A, B, C, etc.
    for (let col = 1; col <= columns; col++) {
      const seatId = `${rowLabel}${col}`;
      // Make some seats premium (last 3 rows)
      seatMap[seatId] = row >= rows - 3 ? 'premium' : 'regular';
    }
  }
  return seatMap;
};

export { useTheatreStore };