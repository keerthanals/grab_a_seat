import React, { useEffect } from 'react';
import { useMovieStore } from '../stores/movieStore';
import MovieList from '../components/movie/MovieList';
import Loader from '../components/ui/Loader';

const MoviesPage = () => {
  const { isLoading, fetchMovies, movies, error } = useMovieStore();

  useEffect(() => {
    console.log('MoviesPage: Starting to fetch movies');
    fetchMovies();
  }, [fetchMovies]);

  console.log('MoviesPage render:', { isLoading, moviesCount: movies.length, error });

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <h1 className="mb-8 text-3xl font-bold">Movies</h1>
        <div className="flex h-96 items-center justify-center">
          <Loader size={36} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-12">
        <h1 className="mb-8 text-3xl font-bold">Movies</h1>
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading movies: {error}</p>
          <button 
            onClick={() => fetchMovies()} 
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="mb-8 text-3xl font-bold" role="heading" aria-level={1}>
        Movies
      </h1>
      {movies.length === 0 ? (
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">No movies found.</p>
        </div>
      ) : (
        <MovieList />
      )}
    </div>
  );
};

export default MoviesPage;