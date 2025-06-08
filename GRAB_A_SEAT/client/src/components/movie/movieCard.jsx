import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { useMovieStore } from '../../stores/movieStore';
import { calculateAverageRating } from '../../utils/helpers';
import Button from '../ui/Button';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { reviews } = useMovieStore();

  const movieReviews = reviews.filter((review) => review.movieId === movie.id);
  const averageRating = calculateAverageRating(movieReviews);

  const handleClick = () => {
    navigate(`/movies/${movie.id}`);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl dark:bg-slate-900"
      onClick={handleClick}
      style={{ width: '300px' }}
    >
      <div className="aspect-[3/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
          <div className="absolute bottom-0 p-4 text-white">
            <p className="mb-2 line-clamp-3 text-sm">{movie.description}</p>
            <Button
              size="sm"
              variant="accent"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/movies/${movie.id}`);
              }}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-1 line-clamp-1 text-lg font-semibold text-slate-900 dark:text-white">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-accent-500" fill="currentColor" />
            <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(movie.duration)}</span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {movie.genre.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
