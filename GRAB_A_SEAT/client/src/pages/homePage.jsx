import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Star, ThumbsUp, Film } from 'lucide-react';
import { useMovieStore } from '../stores/movieStore';
import MovieCard from '../components/movie/MovieCard';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { movies, isLoading, fetchMovies } = useMovieStore();
  const navigate = useNavigate();

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
    <div>
      <section className="relative bg-gradient-to-br from-primary-950 to-primary-800 py-20 text-white">
        <div className="container-custom mx-auto">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
              Book Your Perfect Movie Experience
            </h1>
            <p className="mb-8 text-lg text-slate-200">
              Discover new releases, book tickets, select your seats, and share your thoughts with our vibrant community.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="accent" onClick={() => navigate('/movies')}>
                Browse Movies
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/20"
                onClick={() => navigate('/theatres')}
              >
                Find Theatres
              </Button>
            </div>
          </motion.div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent dark:from-slate-950 dark:to-transparent" />
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom mx-auto">
          <h2 className="mb-12 text-center text-3xl font-bold">Why GRAB A SEAT ?</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <Ticket className="h-10 w-10 text-primary-600 dark:text-primary-400" />,
                title: 'Easy Booking',
                description: 'Book tickets in just a few clicks with our simple and intuitive interface.',
              },
              {
                icon: <Star className="h-10 w-10 text-accent-500" />,
                title: 'Premium Experience',
                description: 'Choose from regular or premium seating options for your perfect movie experience.',
              },
              {
                icon: <ThumbsUp className="h-10 w-10 text-primary-600 dark:text-primary-400" />,
                title: 'Review & Share',
                description: 'Share your thoughts on movies and read reviews from other movie lovers.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container-custom mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Movies</h2>
            <Button
              variant="outline"
              onClick={() => navigate('/movies')}
              rightIcon={<Film size={16} />}
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {movies.slice(0, 4).map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent-500 py-16 text-white">
        <div className="container-custom mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Experience Cinema at its Best?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg">
            Grab a Seat today and start your journey through the world of cinema. Book tickets, write
            reviews, and connect with fellow movie enthusiasts.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="bg-white text-accent-600 hover:bg-slate-100"
            onClick={() => navigate('/register')}
          >
            Sign Up Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
