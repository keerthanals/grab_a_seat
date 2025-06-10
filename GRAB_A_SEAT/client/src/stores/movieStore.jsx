import { create } from 'zustand';
import { reviewAPI, adminAPI } from '../services/api';

const useMovieStore = create((set, get) => ({
  movies: [],
  reviews: [],
  isLoading: false,
  error: null,
  
  fetchMovies: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Use admin endpoint to get all movies (including owner-added ones)
      const response = await adminAPI.getAllMovies();
      const movies = response.movies || response || [];
      set({ movies, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch movies:', error);
      set({
        error: error.message || 'Failed to fetch movies',
        isLoading: false,
      });
    }
  },
  
  fetchMovieReviews: async (movieId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await reviewAPI.getAllReviewsByAdmin(movieId);
      const reviews = response.reviews || response || [];
      set({ reviews, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      set({
        error: error.message || 'Failed to fetch reviews',
        isLoading: false,
      });
    }
  },
  
  addReview: async (reviewData) => {
    try {
      const response = await reviewAPI.addReview(reviewData);
      const newReview = response.review || response;
      
      set((state) => ({
        reviews: [...state.reviews, newReview],
      }));
      
      return newReview;
    } catch (error) {
      console.error('Failed to add review:', error);
      set({ error: error.message || 'Failed to add review' });
      throw error;
    }
  },
  
  deleteReview: async (reviewId) => {
    try {
      await reviewAPI.deleteReviewByAdmin(reviewId);
      
      set((state) => ({
        reviews: state.reviews.filter((review) => review.id !== reviewId),
      }));
    } catch (error) {
      console.error('Failed to delete review:', error);
      set({ error: error.message || 'Failed to delete review' });
      throw error;
    }
  },
  
  // Owner-specific function to get reviews for movies in their theatres
  fetchOwnerMovieReviews: async (movieId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await reviewAPI.getMovieReviewsByOwner(movieId);
      const reviews = response.reviews || response || [];
      set({ reviews, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch owner reviews:', error);
      set({
        error: error.message || 'Failed to fetch reviews',
        isLoading: false,
      });
    }
  },
  
  // Admin-specific function to get all reviews for a movie
  fetchAdminMovieReviews: async (movieId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await reviewAPI.getAllReviewsByAdmin(movieId);
      const reviews = response.reviews || response || [];
      set({ reviews, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch admin reviews:', error);
      set({
        error: error.message || 'Failed to fetch reviews',
        isLoading: false,
      });
    }
  },
  
  clearError: () => set({ error: null }),
}));

export { useMovieStore };