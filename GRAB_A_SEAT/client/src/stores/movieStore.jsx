import { create } from 'zustand';

// Mock data for demo
const mockMovies = [
  {
    id: '1',
    title: 'Inception',
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    duration: 148,
    releaseDate: '2010-07-16',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    rating: 'PG-13',
    trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
  },
  {
    id: '2',
    title: 'The Dark Knight',
    poster: 'https://images.pexels.com/photos/10353568/pexels-photo-10353568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    duration: 152,
    releaseDate: '2008-07-18',
    genre: ['Action', 'Crime', 'Drama'],
    rating: 'PG-13',
    trailerUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
  },
  {
    id: '3',
    title: 'Interstellar',
    poster: 'https://images.pexels.com/photos/11737246/pexels-photo-11737246.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    duration: 169,
    releaseDate: '2014-11-07',
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    rating: 'PG-13',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
  },
  {
    id: '4',
    title: 'The Shawshank Redemption',
    poster: 'https://images.pexels.com/photos/8851097/pexels-photo-8851097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description:
      'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    duration: 142,
    releaseDate: '1994-10-14',
    genre: ['Drama'],
    rating: 'R',
    trailerUrl: 'https://www.youtube.com/embed/6hB3S9bIaco',
  },
];

const mockReviews = [
  {
    id: '1',
    movieId: '1',
    userId: '3',
    rating: 5,
    comment: "One of the best movies I've ever seen!",
    date: '2023-01-15',
  },
  {
    id: '2',
    movieId: '1',
    userId: '2',
    rating: 4,
    comment: 'Great concept, but a bit confusing at times.',
    date: '2023-02-20',
  },
  {
    id: '3',
    movieId: '2',
    userId: '3',
    rating: 5,
    comment: "Heath Ledger's performance was incredible!",
    date: '2023-03-10',
  },
];

export const useMovieStore = create((set) => ({
  movies: [],
  reviews: [],
  isLoading: false,
  error: null,

  fetchMovies: async () => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set({ movies: mockMovies, reviews: mockReviews, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch movies',
        isLoading: false,
      });
    }
  },

  addReview: (reviewData) => {
    set((state) => {
      const newReview = {
        id: Math.random().toString(36).substring(2, 9),
        date: new Date().toISOString().split('T')[0],
        ...reviewData,
      };

      return {
        reviews: [...state.reviews, newReview],
      };
    });
  },

  deleteReview: (id) => {
    set((state) => ({
      reviews: state.reviews.filter((review) => review.id !== id),
    }));
  },
}));
