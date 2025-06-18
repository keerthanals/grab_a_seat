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
      
      // Transform bookings to ensure consistent data structure
      const transformedBookings = bookings.map(booking => ({
        id: booking._id || booking.id,
        userId: booking.userID || booking.userId,
        userName: booking.userName,
        userEmail: booking.userEmail,
        showtimeId: booking.showID || booking.showtimeId,
        theatreId: booking.theatreID || booking.theatreId,
        seats: booking.seats || [],
        totalAmount: booking.totalAmount,
        status: booking.status || 'confirmed',
        bookingDate: booking.bookingDate || booking.createdAt,
        createdAt: booking.createdAt
      }));
      
      console.log('Bookings fetched and transformed:', transformedBookings.length);
      set({ bookings: transformedBookings, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      set({
        error: error.message || 'Failed to fetch bookings',
        isLoading: false,
        bookings: []
      });
    }
  },
  
  fetchUserBookings: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await bookingAPI.getUserBookings();
      const bookings = response.bookings || response || [];
      
      // Transform bookings to ensure consistent data structure
      const transformedBookings = bookings.map(booking => ({
        id: booking._id || booking.id,
        userId: booking.userID || booking.userId,
        showtimeId: booking.showID || booking.showtimeId,
        theatreId: booking.theatreID || booking.theatreId,
        seats: booking.seats || [],
        totalAmount: booking.totalAmount,
        status: booking.status || 'confirmed',
        bookingDate: booking.bookingDate || booking.createdAt,
        createdAt: booking.createdAt
      }));
      
      console.log('User bookings fetched:', transformedBookings.length);
      set({ bookings: transformedBookings, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch user bookings:', error);
      set({
        error: error.message || 'Failed to fetch bookings',
        isLoading: false,
        bookings: []
      });
    }
  },
  
  fetchOwnerBookings: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await ownerAPI.getOwnerBookings();
      const bookings = response.bookings || response || [];
      
      // Transform bookings to ensure consistent data structure
      const transformedBookings = bookings.map(booking => ({
        id: booking._id || booking.id,
        userId: booking.userID || booking.userId,
        userName: booking.userName,
        userEmail: booking.userEmail,
        showtimeId: booking.showID || booking.showtimeId,
        theatreId: booking.theatreID || booking.theatreId,
        seats: booking.seats || [],
        totalAmount: booking.totalAmount,
        status: booking.status || 'confirmed',
        bookingDate: booking.bookingDate || booking.createdAt,
        createdAt: booking.createdAt
      }));
      
      console.log('Owner bookings fetched:', transformedBookings.length);
      set({ bookings: transformedBookings, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch owner bookings:', error);
      set({
        error: error.message || 'Failed to fetch bookings',
        isLoading: false,
        bookings: []
      });
    }
  },
  
  createBooking: async (bookingData) => {
    try {
      console.log('Creating booking with data:', bookingData);
      const response = await bookingAPI.createBooking(bookingData);
      const newBooking = response.booking || response;
      
      // Transform the new booking
      const transformedBooking = {
        id: newBooking._id || newBooking.id,
        userId: newBooking.userID || bookingData.userId,
        showtimeId: newBooking.showID || bookingData.showtimeId,
        theatreId: newBooking.theatreID || bookingData.theatreId,
        seats: newBooking.seats || bookingData.seats,
        totalAmount: newBooking.totalAmount || bookingData.totalAmount,
        status: newBooking.status || 'confirmed',
        bookingDate: newBooking.bookingDate || new Date().toISOString(),
        createdAt: newBooking.createdAt || new Date().toISOString()
      };
      
      set((state) => ({
        bookings: [...state.bookings, transformedBooking],
        selectedSeats: [],
      }));
      
      console.log('Booking created successfully:', transformedBooking.id);
      return transformedBooking;
    } catch (error) {
      console.error('Failed to create booking:', error);
      set({ error: error.message || 'Failed to create booking' });
      throw error;
    }
  },
  
  cancelBooking: async (bookingId) => {
    try {
      await bookingAPI.cancelBooking(bookingId);
      
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
        ),
      }));
      
      console.log('Booking cancelled successfully:', bookingId);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      // For now, just update locally if API call fails
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
        ),
      }));
    }
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