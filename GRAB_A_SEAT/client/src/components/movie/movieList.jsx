import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useMovieStore } from '../../stores/movieStore';
import MovieCard from './MovieCard';
import Loader from '../ui/Loader';
import Input from '../ui/Input';

const MovieList = () => {
  const { movies, isLoading, fetchMovies } = useMovieStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState(movies);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.genre.some((genre) => genre.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredMovies(filtered);
    }
  }, [searchTerm, movies]);

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader size={36} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Input
          placeholder="Search by movie title or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={16} />}
          className="max-w-md"
        />
      </div>

      {filteredMovies.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-lg text-slate-600 dark:text-slate-400">
            No movies found matching "{searchTerm}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;
