import { create } from 'zustand';
import { reviewAPI, publicAPI, adminAPI } from '../services/api';

const useMovieStore = create((set, get) => ({
  movies: [],
  reviews: [],
  isLoading: false,
  error: null,
  
  fetchMovies: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const movies = await publicAPI.getAllMovies();
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
      const reviews = await reviewAPI.getAllReviewsByAdmin(movieId);
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
      const newReview = await reviewAPI.addReview(reviewData);
      
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
      const reviews = await reviewAPI.getMovieReviewsByOwner(movieId);
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
      const reviews = await reviewAPI.getAllReviewsByAdmin(movieId);
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