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
      console.log('Fetching theatres...');
      const response = await adminAPI.getAllTheatres();
      console.log('Theatres API response:', response);
      
      const theatres = response.theatres || response || [];
      
      // Transform theatres to ensure consistent data structure
      const transformedTheatres = theatres.map(theatre => ({
        id: theatre._id || theatre.id,
        name: theatre.name,
        location: theatre.location,
        ownerId: theatre.ownerID || theatre.ownerId,
        ownerName: theatre.ownerName,
        ownerEmail: theatre.ownerEmail,
        approved: theatre.status === 'approved' || theatre.approved,
        status: theatre.status,
        rejectionReason: theatre.rejectionReason,
        screens: theatre.screens || Array.from({ length: theatre.totalScreens || 1 }, (_, i) => ({
          id: `screen-${i + 1}`,
          name: `Screen ${i + 1}`,
          seatLayout: {
            rows: 10,
            columns: 12,
            seatMap: generateSeatMap(10, 12)
          }
        })),
        createdAt: theatre.createdAt
      }));
      
      console.log('Theatres fetched and transformed:', transformedTheatres.length);
      set({ theatres: transformedTheatres, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch theatres:', error);
      set({
        error: error.message || 'Failed to fetch theatres',
        isLoading: false,
        theatres: []
      });
    }
  },
  
  fetchOwnerTheatres: async () => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('Fetching owner theatres...');
      const response = await ownerAPI.getOwnerTheatres();
      console.log('Owner theatres response:', response);
      
      const theatres = response.theatres || response || [];
      
      // Transform theatres to ensure consistent data structure
      const transformedTheatres = theatres.map(theatre => ({
        id: theatre._id || theatre.id,
        name: theatre.name,
        location: theatre.location,
        ownerId: theatre.ownerID || theatre.ownerId,
        approved: theatre.status === 'approved' || theatre.approved,
        status: theatre.status,
        rejectionReason: theatre.rejectionReason,
        screens: theatre.screens || Array.from({ length: theatre.totalScreens || 1 }, (_, i) => ({
          id: `screen-${i + 1}`,
          name: `Screen ${i + 1}`,
          seatLayout: {
            rows: 10,
            columns: 12,
            seatMap: generateSeatMap(10, 12)
          }
        })),
        createdAt: theatre.createdAt
      }));
      
      console.log('Owner theatres found:', transformedTheatres.length);
      console.log('Approved theatres:', transformedTheatres.filter(t => t.approved).length);
      
      set({ theatres: transformedTheatres, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch owner theatres:', error);
      set({
        error: error.message || 'Failed to fetch theatres',
        isLoading: false,
        theatres: []
      });
    }
  },
  
  fetchShowtimes: async () => {
    try {
      console.log('Fetching showtimes...');
      // Fetch showtimes from the API
      const response = await ownerAPI.getOwnerShows();
      console.log('Showtimes API response:', response);
      
      const showtimes = response.shows || response || [];
      
      // Transform showtimes to match frontend expectations
      const transformedShowtimes = showtimes.map(showtime => ({
        id: showtime._id || showtime.id,
        movieId: showtime.movieID || showtime.movieId,
        theatreId: showtime.theatreID || showtime.theatreId,
        screenId: `screen-${showtime.screenNumber}`,
        date: showtime.date,
        startTime: showtime.startTime,
        price: showtime.price || { regular: 12.99, premium: 18.99 },
        totalSeats: showtime.totalSeats || 120,
        availableSeats: showtime.availableSeats || showtime.totalSeats || 120
      }));
      
      console.log('Showtimes fetched and transformed:', transformedShowtimes.length);
      set({ showtimes: transformedShowtimes });
    } catch (error) {
      console.error('Failed to fetch showtimes:', error);
      set({
        error: error.message || 'Failed to fetch showtimes',
        showtimes: []
      });
    }
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
      console.log('Adding theatre with data:', theatreData);
      const response = await ownerAPI.createTheatre(theatreData);
      console.log('Theatre creation response:', response);
      
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
      
      console.log('Transformed theatre:', transformedTheatre);
      
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
      console.log('Adding showtime with data:', showtimeData);
      const response = await ownerAPI.createShow(showtimeData);
      console.log('Showtime creation response:', response);
      
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
      
      console.log('Transformed showtime:', transformedShowtime);
      
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
  
  updateShowtime: async (showtimeId, updateData) => {
    try {
      console.log('Updating showtime:', showtimeId, updateData);
      const response = await ownerAPI.updateShow(showtimeId, updateData);
      console.log('Showtime update response:', response);
      
      const updatedShowtime = response.show || response;
      
      // Transform updated showtime data
      const transformedShowtime = {
        id: updatedShowtime._id.toString(),
        movieId: updatedShowtime.movieID,
        theatreId: updatedShowtime.theatreID,
        screenId: `screen-${updatedShowtime.screenNumber}`,
        date: updatedShowtime.date,
        startTime: updatedShowtime.startTime,
        price: updatedShowtime.price,
        totalSeats: updatedShowtime.totalSeats,
        availableSeats: updatedShowtime.availableSeats
      };
      
      set((state) => ({
        showtimes: state.showtimes.map(showtime =>
          showtime.id === showtimeId ? transformedShowtime : showtime
        ),
      }));
      
      return transformedShowtime;
    } catch (error) {
      console.error('Failed to update showtime:', error);
      set({ error: error.message || 'Failed to update showtime' });
      throw error;
    }
  },
  
  deleteShowtime: async (showtimeId) => {
    try {
      await ownerAPI.deleteShow(showtimeId);
      
      set((state) => ({
        showtimes: state.showtimes.filter(showtime => showtime.id !== showtimeId),
      }));
    } catch (error) {
      console.error('Failed to delete showtime:', error);
      set({ error: error.message || 'Failed to delete showtime' });
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