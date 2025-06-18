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
      console.log('Fetching movies...');
      // Use admin endpoint to get all movies (including owner-added ones)
      const response = await adminAPI.getAllMovies();
      console.log('Movies API response:', response);
      
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
      
    } catch (error) {
      console.error('Failed to fetch movies:', error);
      set({
        error: error.message || 'Failed to fetch movies',
        isLoading: false,
        movies: [] // Set empty array on error
      });
    }
  },
  
  fetchMovieReviews: async (movieId) => {
    if (!movieId) return;
    
    try {
      console.log('Fetching reviews for movie:', movieId);
      const response = await reviewAPI.getAllReviewsByAdmin(movieId);
      console.log('Reviews API response:', response);
      
      const reviews = response.reviews || response || [];
      
      // Transform reviews to match frontend expectations
      const transformedReviews = reviews.map(review => ({
        id: review._id || review.id,
        movieId: review.movieID || review.movieId,
        userId: review.userID?._id || review.userID?.id || review.userId,
        userName: review.userID?.name || review.userName || 'Anonymous',
        rating: review.rating,
        comment: review.comment,
        date: review.createdAt || review.date,
        createdAt: review.createdAt
      }));
      
      console.log('Reviews transformed:', transformedReviews.length);
      set({ reviews: transformedReviews });
      
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      set({ error: error.message || 'Failed to fetch reviews' });
    }
  },
  
  addReview: async (reviewData) => {
    try {
      console.log('Adding review with data:', reviewData);
      const response = await reviewAPI.addReview(reviewData);
      console.log('Add review response:', response);
      
      const newReview = response.review || response;
      
      // Transform the new review
      const transformedReview = {
        id: newReview._id || newReview.id,
        movieId: newReview.movieID || reviewData.movieId,
        userId: newReview.userID?._id || newReview.userID || reviewData.userId,
        userName: newReview.userID?.name || 'You',
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
  
  clearError: () => set({ error: null }),
}));

export { useMovieStore };