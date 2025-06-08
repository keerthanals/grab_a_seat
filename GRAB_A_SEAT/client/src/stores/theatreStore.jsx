import { create } from 'zustand';

// Mock seat layout creation function
const createSeatLayout = (rows, columns) => {
  const seatMap = {};
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const seatId = `${String.fromCharCode(65 + row)}${col + 1}`;
      
      if ((row === 0 && col === 0) || (row === rows - 1 && col === columns - 1)) {
        seatMap[seatId] = 'unavailable';
      } else if (row >= rows - 2) {
        seatMap[seatId] = 'premium';
      } else {
        seatMap[seatId] = 'regular';
      }
    }
  }
  
  return {
    rows,
    columns,
    seatMap,
  };
};

// Mock data
const mockTheatres = [
  {
    id: '1',
    name: 'CineWorld',
    location: '123 Main St, City',
    ownerId: '2',
    approved: true,
    screens: [
      {
        id: '1',
        name: 'Screen 1',
        theatreId: '1',
        seatLayout: createSeatLayout(10, 12),
      },
      {
        id: '2',
        name: 'Screen 2',
        theatreId: '1',
        seatLayout: createSeatLayout(8, 10),
      },
    ],
  },
  {
    id: '2',
    name: 'MoviePlex',
    location: '456 Oak Ave, Town',
    ownerId: '2',
    approved: true,
    screens: [
      {
        id: '3',
        name: 'Screen 1',
        theatreId: '2',
        seatLayout: createSeatLayout(12, 16),
      },
    ],
  },
  {
    id: '3',
    name: 'FilmHouse',
    location: '789 Pine Rd, Village',
    ownerId: '2',
    approved: false,
    screens: [
      {
        id: '4',
        name: 'Screen 1',
        theatreId: '3',
        seatLayout: createSeatLayout(6, 8),
      },
    ],
  },
];

const mockShowtimes = [
  {
    id: '1',
    movieId: '1',
    screenId: '1',
    theatreId: '1',
    date: '2025-05-01',
    startTime: '14:30',
    endTime: '17:00',
    price: {
      regular: 12.99,
      premium: 18.99,
    },
  },
  {
    id: '2',
    movieId: '1',
    screenId: '1',
    theatreId: '1',
    date: '2025-05-01',
    startTime: '19:30',
    endTime: '22:00',
    price: {
      regular: 14.99,
      premium: 20.99,
    },
  },
  {
    id: '3',
    movieId: '2',
    screenId: '2',
    theatreId: '1',
    date: '2025-05-01',
    startTime: '15:00',
    endTime: '17:30',
    price: {
      regular: 12.99,
      premium: 18.99,
    },
  },
  {
    id: '4',
    movieId: '3',
    screenId: '3',
    theatreId: '2',
    date: '2025-05-01',
    startTime: '16:00',
    endTime: '19:00',
    price: {
      regular: 13.99,
      premium: 19.99,
    },
  },
];

export const useTheatreStore = create((set) => ({
  theatres: [],
  showtimes: [],
  isLoading: false,
  error: null,
  
  fetchTheatres: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({ theatres: mockTheatres, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch theatres',
        isLoading: false,
      });
    }
  },
  
  fetchShowtimes: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({ showtimes: mockShowtimes, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch showtimes',
        isLoading: false,
      });
    }
  },
  
  approveTheatre: (id) => {
    set((state) => ({
      theatres: state.theatres.map((theatre) =>
        theatre.id === id ? { ...theatre, approved: true } : theatre
      ),
    }));
  },
  
  rejectTheatre: (id) => {
    set((state) => ({
      theatres: state.theatres.filter((theatre) => theatre.id !== id),
    }));
  },
  
  addTheatre: (theatreData) => {
    set((state) => {
      const newTheatre = {
        id: Math.random().toString(36).substring(2, 9),
        approved: false,
        ...theatreData,
      };
      
      return {
        theatres: [...state.theatres, newTheatre],
      };
    });
  },
  
  addShowtime: (showtimeData) => {
    set((state) => {
      const newShowtime = {
        id: Math.random().toString(36).substring(2, 9),
        ...showtimeData,
      };
      
      return {
        showtimes: [...state.showtimes, newShowtime],
      };
    });
  },
}));
