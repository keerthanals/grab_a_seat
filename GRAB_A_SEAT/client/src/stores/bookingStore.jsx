import { create } from 'zustand';
import { bookingAPI, adminAPI, ownerAPI } from '../services/api';

const useBookingStore = create((set, get) => ({
  bookings: [],
  selectedSeats: [],
  isLoading: false,
  error: null,
  
  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Get all bookings for admin view or user's bookings
      const response = await adminAPI.getAllBookings();
      const bookings = response.bookings || response || [];
      set({ bookings, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      set({
        error: error.message || 'Failed to fetch bookings',
        isLoading: false,
      });
    }
  },
  
  fetchOwnerBookings: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await ownerAPI.getOwnerBookings();
      const bookings = response.bookings || response || [];
      set({ bookings, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch owner bookings:', error);
      set({
        error: error.message || 'Failed to fetch bookings',
        isLoading: false,
      });
    }
  },
  
  createBooking: async (bookingData) => {
    try {
      const response = await bookingAPI.createBooking(bookingData);
      const newBooking = response.booking || response;
      
      set((state) => ({
        bookings: [...state.bookings, newBooking],
        selectedSeats: [],
      }));
      
      return newBooking;
    } catch (error) {
      console.error('Failed to create booking:', error);
      set({ error: error.message || 'Failed to create booking' });
      throw error;
    }
  },
  
  cancelBooking: (id) => {
    // Note: You might need to add a cancel booking endpoint
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id ? { ...booking, status: 'cancelled' } : booking
      ),
    }));
  },
  
  selectSeat: (seat) => {
    set((state) => ({
      selectedSeats: [...state.selectedSeats, seat],
    }));
  },
  
  deselectSeat: (seat) => {
    set((state) => ({
      selectedSeats: state.selectedSeats.filter((s) => s !== seat),
    }));
  },
  
  clearSelectedSeats: () => {
    set({ selectedSeats: [] });
  },
  
  clearError: () => set({ error: null }),
}));

export { useBookingStore };