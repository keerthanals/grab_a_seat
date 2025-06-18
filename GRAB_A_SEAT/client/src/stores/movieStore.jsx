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
      
      // Transform the data to match frontend expectations
      const transformedMovies = movies.map(movie => ({
        id: movie._id || movie.id,
        title: movie.title,
        description: movie.description,
        duration: movie.duration,
        genre: Array.isArray(movie.genre) ? movie.genre : [movie.genre],
        rating: movie.rating || 'PG-13',
        releaseDate: movie.releaseDate,
        poster: movie.poster || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
        trailerUrl: movie.trailerUrl,
        language: movie.language || 'English',
        createdAt: movie.createdAt
      }));
      
      console.log('Movies fetched and transformed:', transformedMovies.length);
      set({ movies: transformedMovies, isLoading: false });
      
      // Also fetch all reviews for all movies
      await get().fetchAllReviews();
    } catch (error) {
      console.error('Failed to fetch movies:', error);
      set({
        error: error.message || 'Failed to fetch movies',
        isLoading: false,
        movies: [] // Set empty array on error
      });
    }
  },
  
  fetchAllReviews: async () => {
    try {
      // For now, we'll fetch reviews when needed per movie
      // This is a placeholder for future implementation
      console.log('Reviews will be fetched per movie');
    } catch (error) {
      console.error('Failed to fetch all reviews:', error);
    }
  },
  
  fetchMovieReviews: async (movieId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await reviewAPI.getAllReviewsByAdmin(movieId);
      const reviews = response.reviews || response || [];
      
      // Transform reviews to match frontend expectations
      const transformedReviews = reviews.map(review => ({
        id: review._id || review.id,
        movieId: review.movieID || review.movieId,
        userId: review.userID?._id || review.userId,
        userName: review.userID?.name || review.userName,
        rating: review.rating,
        comment: review.comment,
        date: review.createdAt || review.date,
        createdAt: review.createdAt
      }));
      
      set({ reviews: transformedReviews, isLoading: false });
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
      console.log('Adding review with data:', reviewData);
      const response = await reviewAPI.addReview(reviewData);
      const newReview = response.review || response;
      
      // Transform the new review
      const transformedReview = {
        id: newReview._id || newReview.id,
        movieId: newReview.movieID || reviewData.movieId,
        userId: newReview.userID || reviewData.userId,
        rating: newReview.rating,
        comment: newReview.comment,
        date: newReview.createdAt || new Date().toISOString(),
        createdAt: newReview.createdAt || new Date().toISOString()
      };
      
      set((state) => ({
        reviews: [...state.reviews, transformedReview],
      }));
      
      console.log('Review added successfully:', transformedReview);
      return transformedReview;
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
      
      const transformedReviews = reviews.map(review => ({
        id: review._id || review.id,
        movieId: review.movieID || review.movieId,
        userId: review.userID?._id || review.userId,
        userName: review.userID?.name || review.userName,
        rating: review.rating,
        comment: review.comment,
        date: review.createdAt || review.date,
        createdAt: review.createdAt
      }));
      
      set({ reviews: transformedReviews, isLoading: false });
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
      
      const transformedReviews = reviews.map(review => ({
        id: review._id || review.id,
        movieId: review.movieID || review.movieId,
        userId: review.userID?._id || review.userId,
        userName: review.userID?.name || review.userName,
        rating: review.rating,
        comment: review.comment,
        date: review.createdAt || review.date,
        createdAt: review.createdAt
      }));
      
      set({ reviews: transformedReviews, isLoading: false });
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