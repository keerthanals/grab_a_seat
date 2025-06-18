import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useMovieStore } from '../../stores/movieStore';
import MovieCard from './MovieCard';
import Loader from '../ui/Loader';
import Input from '../ui/Input';

const MovieList = () => {
  const { movies, isLoading, fetchMovies, error } = useMovieStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    console.log('MovieList: Movies changed', movies.length);
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

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button 
          onClick={() => fetchMovies()} 
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Retry
        </button>
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
            {searchTerm ? `No movies found matching "${searchTerm}"` : 'No movies available'}
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