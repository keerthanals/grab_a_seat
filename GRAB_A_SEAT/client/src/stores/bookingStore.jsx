import { create } from 'zustand';

// Mock data
const mockBookings = [
  {
    id: '1',
    userId: '3',
    showtimeId: '1',
    seats: ['A3', 'A4'],
    totalAmount: 25.98,
    bookingDate: '2025-04-28',
    status: 'confirmed',
  },
  {
    id: '2',
    userId: '3',
    showtimeId: '4',
    seats: ['C5', 'C6', 'C7'],
    totalAmount: 41.97,
    bookingDate: '2025-04-29',
    status: 'confirmed',
  },
  {
    id: '3',
    userId: '2',
    showtimeId: '2',
    seats: ['F10', 'F11'],
    totalAmount: 29.98,
    bookingDate: '2025-04-30',
    status: 'cancelled',
  },
];

export const useBookingStore = create((set) => ({
  bookings: [],
  selectedSeats: [],
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set({ bookings: mockBookings, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch bookings',
        isLoading: false,
      });
    }
  },

  createBooking: (bookingData) => {
    set((state) => {
      const newBooking = {
        id: Math.random().toString(36).substring(2, 9),
        bookingDate: new Date().toISOString().split('T')[0],
        status: 'confirmed',
        ...bookingData,
      };

      return {
        bookings: [...state.bookings, newBooking],
        selectedSeats: [],
      };
    });
  },

  cancelBooking: (id) => {
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
}));
