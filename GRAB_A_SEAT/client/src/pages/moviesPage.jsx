import React, { useEffect } from 'react';
import { useMovieStore } from '../stores/movieStore';
import MovieList from '../components/movie/MovieList';
import Loader from '../components/ui/Loader';

const MoviesPage = () => {
  const { isLoading, fetchMovies, movies } = useMovieStore();

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size={36} />
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="mb-8 text-3xl font-bold" role="heading" aria-level={1}>
        Movies
      </h1>
      {movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <MovieList />
      )}
    </div>
  );
};

export default MoviesPage;
