import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMovieStore } from '../stores/movieStore';
import { useTheatreStore } from '../stores/theatreStore';
import { useAuthStore } from '../stores/authStore';
import { formatDate, calculateAverageRating } from '../utils/helpers';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import ShowtimeSelector from '../components/booking/ShowtimeSelector';
import ReviewList from '../components/movie/ReviewList';
import ReviewForm from '../components/movie/ReviewForm';
import { Card } from '../components/ui/Card';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { movies, reviews, isLoading, fetchMovies, fetchMovieReviews } = useMovieStore();
  const { theatres, showtimes, fetchTheatres, fetchShowtimes } = useTheatreStore();
  const { user, isAuthenticated } = useAuthStore();

  const [activeTab, setActiveTab] = useState('showtimes');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchMovies(),
          fetchTheatres(),
          fetchShowtimes()
        ]);
      } catch (error) {
        console.error('Error loading movie detail data:', error);
      }
    };

    loadData();
  }, [fetchMovies, fetchTheatres, fetchShowtimes]);

  // Fetch reviews when movie is loaded and reviews tab is active
  useEffect(() => {
    if (id && activeTab === 'reviews') {
      const loadReviews = async () => {
        setReviewsLoading(true);
        try {
          await fetchMovieReviews(id);
        } catch (error) {
          console.error('Error loading reviews:', error);
        } finally {
          setReviewsLoading(false);
        }
      };
      loadReviews();
    }
  }, [id, activeTab, fetchMovieReviews]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size={36} />
      </div>
    );
  }

  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">Movie not found</h1>
        <p className="mb-6">The movie you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/movies')}>Back to Movies</Button>
      </div>
    );
  }

  const movieReviews = reviews.filter(review => review.movieId === movie.id);
  const averageRating = calculateAverageRating(movieReviews);
  const hasUserReviewed = isAuthenticated ? movieReviews.some(r => r.userId === (user?.id || user?._id)) : false;

  const formatDuration = minutes => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleAddReview = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowReviewForm(true);
    setActiveTab('reviews');
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    // Refresh reviews
    fetchMovieReviews(id);
  };

  return (
    <div>
      {/* Hero Section with poster background */}
      <div className="relative h-[60vh] w-full bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${movie.poster})` }}
        />
        <div className="container-custom relative flex h-full items-end py-12">
          <motion.div
            className="mb-6 flex max-w-4xl flex-col text-white md:flex-row md:items-end md:gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 h-auto w-64 shrink-0 overflow-hidden rounded-lg shadow-lg md:mb-0">
              <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="mb-2 text-3xl font-bold md:text-4xl">{movie.title}</h1>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-accent-500" fill="currentColor" />
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(movie.duration)}</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(movie.releaseDate)}</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="rounded bg-slate-700 px-2 py-1 text-xs font-medium">{movie.rating}</span>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {movie.genre.map(genre => (
                  <span
                    key={genre}
                    className="rounded-full bg-primary-700 px-3 py-1 text-xs font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Section: Overview, Showtimes/Reviews Tabs */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <div className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Overview</h2>
                <p className="mb-6 leading-relaxed text-slate-700 dark:text-slate-300">{movie.description}</p>

                {movie.trailerUrl && (
                  <div className="mt-6">
                    <h3 className="mb-3 text-lg font-medium">Trailer</h3>
                    <div className="aspect-video overflow-hidden rounded-lg">
                      <iframe
                        width="100%"
                        height="100%"
                        src={movie.trailerUrl}
                        title={`${movie.title} Trailer`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <div className="mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('showtimes')}
                  className={`inline-flex items-center border-b-2 py-2 text-sm font-medium ${
                    activeTab === 'showtimes'
                      ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
                      : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Clock size={16} className="mr-2" />
                  Showtimes
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`inline-flex items-center border-b-2 py-2 text-sm font-medium ${
                    activeTab === 'reviews'
                      ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
                      : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Star size={16} className="mr-2" />
                  Reviews ({movieReviews.length})
                </button>
              </div>
            </div>

            <div className="mb-8">
              {activeTab === 'showtimes' && (
                <ShowtimeSelector showtimes={showtimes} theatres={theatres} movieId={movie.id} />
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {showReviewForm && !hasUserReviewed && (
                    <Card className="mb-6 border border-slate-200 dark:border-slate-800">
                      <div className="p-6">
                        <h3 className="mb-4 text-lg font-semibold">Write a Review</h3>
                        <ReviewForm movieId={movie.id} onSuccess={handleReviewSuccess} />
                      </div>
                    </Card>
                  )}
                  {reviewsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader size={24} />
                    </div>
                  ) : (
                    <ReviewList movieId={movie.id} />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Section: Call to action & Similar movies */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {!hasUserReviewed && !showReviewForm && (
                <Card className="border border-slate-200 dark:border-slate-800">
                  <div className="p-6">
                    <h3 className="mb-3 text-lg font-semibold">Share Your Thoughts</h3>
                    <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                      Have you watched this movie? Let others know what you think!
                    </p>
                    <Button variant="primary" className="w-full" onClick={handleAddReview}>
                      Write a Review
                    </Button>
                  </div>
                </Card>
              )}

              <Card className="border border-slate-200 dark:border-slate-800">
                <div className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">More Like This</h3>
                  <div className="space-y-4">
                    {movies
                      .filter(
                        m =>
                          m.id !== movie.id &&
                          m.genre.some(g => movie.genre.includes(g))
                      )
                      .slice(0, 3)
                      .map(similarMovie => (
                        <div
                          key={similarMovie.id}
                          className="flex cursor-pointer gap-3 rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                          onClick={() => navigate(`/movies/${similarMovie.id}`)}
                        >
                          <img
                            src={similarMovie.poster}
                            alt={similarMovie.title}
                            className="h-20 w-14 rounded object-cover"
                          />
                          <div>
                            <h4 className="font-medium">{similarMovie.title}</h4>
                            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                              <Star size={12} className="text-accent-500" fill="currentColor" />
                              <span>
                                {calculateAverageRating(
                                  reviews.filter(r => r.movieId === similarMovie.id)
                                ).toFixed(1)}
                              </span>
                              <span>|</span>
                              <span>{formatDuration(similarMovie.duration)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;