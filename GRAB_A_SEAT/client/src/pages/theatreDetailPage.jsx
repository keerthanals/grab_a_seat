import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ScreenShare } from 'lucide-react';
import { useTheatreStore } from '../stores/theatreStore';
import { useMovieStore } from '../stores/movieStore';
import Loader from '../components/ui/Loader';
import { Card } from '../components/ui/Card';
import MovieCard from '../components/movie/MovieCard';
import Button from '../components/ui/Button';

const TheatreDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theatres, showtimes, isLoading, fetchTheatres, fetchShowtimes } = useTheatreStore();
  const { movies, fetchMovies } = useMovieStore();
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchTheatres();
    fetchShowtimes();
    fetchMovies();
  }, [fetchTheatres, fetchShowtimes, fetchMovies]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size={36} />
      </div>
    );
  }

  const theatre = theatres.find(t => t.id === id);
  if (!theatre || !theatre.approved) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">Theatre not found</h1>
        <p className="mb-6">
          The theatre you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/theatres')}>Back to Theatres</Button>
      </div>
    );
  }

  // Get all showtimes for this theatre
  const theatreShowtimes = showtimes.filter(showtime => showtime.theatreId === theatre.id);

  // Get unique dates from showtimes
  const dates = Array.from(new Set(theatreShowtimes.map(showtime => showtime.date))).sort();

  // Set the first date as selected by default if not already set
  useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0]);
    }
  }, [dates, selectedDate]);

  // Get movies showing on the selected date
  const moviesOnSelectedDate = theatreShowtimes
    .filter(showtime => showtime.date === selectedDate)
    .map(showtime => showtime.movieId);

  // Remove duplicates
  const uniqueMovieIds = Array.from(new Set(moviesOnSelectedDate));

  // Get movie objects
  const moviesToShow = uniqueMovieIds
    .map(id => movies.find(movie => movie?.id === id))
    .filter(Boolean);

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="bg-primary-900 py-12 text-white">
        <div className="container-custom mx-auto">
          <h1 className="mb-2 text-3xl font-bold">{theatre.name}</h1>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin size={18} />
            <span>{theatre.location}</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-slate-300">
            <ScreenShare size={18} />
            <span>{theatre.screens.length} Screens</span>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="container-custom mx-auto overflow-x-auto py-4">
          <div className="flex space-x-2">
            {dates.map(date => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedDate === date
                    ? 'bg-primary-600 text-white dark:bg-primary-700'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700'
                }`}
              >
                {formatDate(date)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <h2 className="mb-6 text-2xl font-bold">Now Showing</h2>
        {moviesToShow.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-slate-600 dark:text-slate-400">No movies scheduled for this date.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {moviesToShow.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TheatreDetailPage;
