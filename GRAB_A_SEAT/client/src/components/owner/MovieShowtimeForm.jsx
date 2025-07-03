import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, Film, DollarSign, Edit, Trash2, Plus } from 'lucide-react';
import { useMovieStore } from '../../stores/movieStore';
import { useTheatreStore } from '../../stores/theatreStore';
import { useAuthStore } from '../../stores/authStore';
import { ownerAPI } from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { toast } from 'sonner';

const genreOptions = [
  { value: 'action', label: 'Action' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'crime', label: 'Crime' },
  { value: 'drama', label: 'Drama' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'horror', label: 'Horror' },
  { value: 'romance', label: 'Romance' },
  { value: 'scifi', label: 'Sci-Fi' },
  { value: 'thriller', label: 'Thriller' },
];

const ratingOptions = [
  { value: 'G', label: 'G - General Audiences' },
  { value: 'PG', label: 'PG - Parental Guidance Suggested' },
  { value: 'PG-13', label: 'PG-13 - Parents Strongly Cautioned' },
  { value: 'R', label: 'R - Restricted' },
  { value: 'NC-17', label: 'NC-17 - Adults Only' },
];

const MovieShowtimeForm = () => {
  const { movies, fetchMovies } = useMovieStore();
  const { theatres, showtimes, fetchOwnerTheatres, fetchShowtimes, addShowtime, updateShowtime, deleteShowtime } = useTheatreStore();
  const { user } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('movie');
  const [screens, setScreens] = useState([]);
  const [isSubmittingMovie, setIsSubmittingMovie] = useState(false);
  const [isSubmittingShowtime, setIsSubmittingShowtime] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Movie form
  const movieForm = useForm({
    defaultValues: {
      title: '',
      description: '',
      duration: 120,
      releaseDate: new Date().toISOString().split('T')[0],
      genre: 'drama',
      rating: 'PG-13',
      language: 'English',
      trailerUrl: '',
    },
  });
  
  // Showtime form
  const showtimeForm = useForm({
    defaultValues: {
      movieId: '',
      theatreId: '',
      screenId: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '18:00',
      priceRegular: 12.99,
      pricePremium: 18.99,
    },
  });
  
  const selectedTheatreId = showtimeForm.watch('theatreId');
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        console.log('Loading data for MovieShowtimeForm...');
        await Promise.all([
          fetchMovies(),
          fetchOwnerTheatres(),
          fetchShowtimes()
        ]);
        console.log('Data loaded successfully');
      } catch (error) {
        console.error('Error loading form data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchMovies, fetchOwnerTheatres, fetchShowtimes]);
  
  useEffect(() => {
    if (selectedTheatreId) {
      const theatre = theatres.find((t) => t.id === selectedTheatreId);
      if (theatre && theatre.screens) {
        const screenOptions = theatre.screens.map((screen) => ({
          value: screen.id,
          label: screen.name,
        }));
        
        setScreens(screenOptions);
        if (screenOptions.length > 0) {
          showtimeForm.setValue('screenId', screenOptions[0].value);
        }
      }
    } else {
      setScreens([]);
      showtimeForm.setValue('screenId', '');
    }
  }, [selectedTheatreId, theatres, showtimeForm]);
  
  // Filter owner theatres safely
  const ownerTheatres = React.useMemo(() => {
    if (!user?._id || !Array.isArray(theatres)) return [];
    return theatres.filter(
      (theatre) => theatre.ownerId === user._id && theatre.approved
    );
  }, [theatres, user?._id]);
  
  const theatreOptions = React.useMemo(() => {
    return ownerTheatres.map((theatre) => ({
      value: theatre.id,
      label: `${theatre.name} - ${theatre.location}`,
    }));
  }, [ownerTheatres]);
  
  const movieOptions = React.useMemo(() => {
    if (!Array.isArray(movies)) return [];
    return movies.map((movie) => ({
      value: movie.id,
      label: movie.title,
    }));
  }, [movies]);
  
  // Filter showtimes by selected theatre and movie
  const filteredShowtimes = React.useMemo(() => {
    if (!Array.isArray(showtimes)) return [];
    return showtimes.filter(showtime => {
      const matchesTheatre = !selectedTheatre || showtime.theatreId === selectedTheatre;
      const matchesMovie = !selectedMovie || showtime.movieId === selectedMovie;
      return matchesTheatre && matchesMovie;
    });
  }, [showtimes, selectedTheatre, selectedMovie]);
  
  const onSubmitMovie = async (data) => {
    try {
      setIsSubmittingMovie(true);
      
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('duration', data.duration.toString());
      formData.append('releaseDate', data.releaseDate);
      formData.append('genre', data.genre);
      formData.append('rating', data.rating);
      formData.append('language', data.language);
      formData.append('trailerUrl', data.trailerUrl || '');
      
      if (data.poster && data.poster[0]) {
        formData.append('poster', data.poster[0]);
      }
      
      console.log('Submitting movie data...');
      await ownerAPI.addMovie(formData);
      await fetchMovies(); // Refresh movies list
      
      toast.success('Movie added successfully!');
      movieForm.reset();
      
      // Switch to showtime tab and pre-select the new movie
      setActiveTab('showtime');
      
    } catch (error) {
      console.error('Failed to add movie:', error);
      toast.error(error.message || 'Failed to add movie');
    } finally {
      setIsSubmittingMovie(false);
    }
  };
  
  const onSubmitShowtime = async (data) => {
    try {
      setIsSubmittingShowtime(true);
      
      const showData = {
        movieId: data.movieId,
        theatreId: data.theatreId,
        screenId: data.screenId,
        date: data.date,
        startTime: data.startTime,
        priceRegular: parseFloat(data.priceRegular),
        pricePremium: parseFloat(data.pricePremium),
      };
      
      console.log('Submitting showtime data:', showData);
      
      if (editingShowtime) {
        await updateShowtime(editingShowtime.id, showData);
        toast.success('Showtime updated successfully!');
        setEditingShowtime(null);
      } else {
        await addShowtime(showData);
        toast.success('Showtime created successfully!');
      }
      
      showtimeForm.reset();
      setActiveTab('manage'); // Switch to manage tab to see the new showtime
    } catch (error) {
      console.error('Failed to save showtime:', error);
      toast.error(error.message || 'Failed to save showtime');
    } finally {
      setIsSubmittingShowtime(false);
    }
  };
  
  const handleEditShowtime = (showtime) => {
    setEditingShowtime(showtime);
    showtimeForm.setValue('movieId', showtime.movieId);
    showtimeForm.setValue('theatreId', showtime.theatreId);
    showtimeForm.setValue('screenId', showtime.screenId);
    showtimeForm.setValue('date', showtime.date);
    showtimeForm.setValue('startTime', showtime.startTime);
    showtimeForm.setValue('priceRegular', showtime.price.regular);
    showtimeForm.setValue('pricePremium', showtime.price.premium);
    setActiveTab('showtime');
  };
  
  const handleDeleteShowtime = async (showtimeId) => {
    if (confirm('Are you sure you want to delete this showtime?')) {
      try {
        await deleteShowtime(showtimeId);
        toast.success('Showtime deleted successfully!');
      } catch (error) {
        console.error('Delete showtime error:', error);
        toast.error('Failed to delete showtime');
      }
    }
  };
  
  const cancelEditShowtime = () => {
    setEditingShowtime(null);
    showtimeForm.reset();
    setActiveTab('manage');
  };
  
  const getMovieTitle = (movieId) => {
    const movie = movies.find(m => m.id === movieId);
    return movie ? movie.title : 'Unknown Movie';
  };
  
  const getTheatreInfo = (theatreId) => {
    const theatre = theatres.find(t => t.id === theatreId);
    return theatre ? `${theatre.name} - ${theatre.location}` : 'Unknown Theatre';
  };

  console.log('MovieShowtimeForm render:', { 
    isLoading, 
    ownerTheatresCount: ownerTheatres.length,
    moviesCount: movies.length,
    showtimesCount: showtimes.length,
    activeTab 
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2">Loading movies and showtimes...</span>
      </div>
    );
  }
  
  if (ownerTheatres.length === 0) {
    return (
      <Card className="border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-950">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-warning-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-warning-800 dark:text-warning-200">
            No Approved Theatres
          </h3>
          <p className="mb-4 text-warning-700 dark:text-warning-300">
            You need at least one approved theatre to add movies and create showtimes. 
            Please create a theatre first and wait for admin approval.
          </p>
          <p className="text-sm text-warning-600 dark:text-warning-400">
            Once your theatre is approved, you'll be able to add movies and create showtimes.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('movie')}
            className={`inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'movie'
                ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Film className="mr-2 h-4 w-4" />
            Add Movie
          </button>
          
          <button
            onClick={() => setActiveTab('showtime')}
            className={`inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'showtime'
                ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {editingShowtime ? 'Edit Showtime' : 'Add Showtime'}
          </button>
          
          <button
            onClick={() => setActiveTab('manage')}
            className={`inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'manage'
                ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Edit className="mr-2 h-4 w-4" />
            Manage Showtimes ({filteredShowtimes.length})
          </button>
        </nav>
      </div>

      {/* Add Movie Tab */}
      {activeTab === 'movie' && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Movie</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Add a movie to your catalogue. After adding, you can create showtimes for it.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={movieForm.handleSubmit(onSubmitMovie)} className="space-y-4">
              <div>
                <Input
                  id="title"
                  label="Movie Title"
                  leftIcon={<Film size={16} />}
                  error={movieForm.formState.errors.title?.message}
                  {...movieForm.register('title', {
                    required: 'Movie title is required',
                    minLength: {
                      value: 2,
                      message: 'Title must be at least 2 characters',
                    },
                  })}
                  placeholder="Inception"
                />
              </div>
              
              <div>
                <label 
                  htmlFor="description" 
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900"
                  rows={4}
                  placeholder="Movie description..."
                  {...movieForm.register('description', {
                    required: 'Description is required',
                    minLength: {
                      value: 20,
                      message: 'Description must be at least 20 characters',
                    },
                  })}
                ></textarea>
                {movieForm.formState.errors.description && (
                  <p className="mt-1 text-xs text-danger-500">{movieForm.formState.errors.description.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  id="duration"
                  type="number"
                  label="Duration (minutes)"
                  leftIcon={<Clock size={16} />}
                  error={movieForm.formState.errors.duration?.message}
                  {...movieForm.register('duration', {
                    required: 'Duration is required',
                    min: {
                      value: 30,
                      message: 'Minimum duration is 30 minutes',
                    },
                    max: {
                      value: 300,
                      message: 'Maximum duration is 300 minutes',
                    },
                    valueAsNumber: true,
                  })}
                  min={30}
                  max={300}
                />
                
                <Input
                  id="releaseDate"
                  type="date"
                  label="Release Date"
                  leftIcon={<Calendar size={16} />}
                  error={movieForm.formState.errors.releaseDate?.message}
                  {...movieForm.register('releaseDate', {
                    required: 'Release date is required',
                  })}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Select
                  id="genre"
                  label="Genre"
                  options={genreOptions}
                  error={movieForm.formState.errors.genre?.message}
                  {...movieForm.register('genre', {
                    required: 'Genre is required',
                  })}
                />
                
                <Select
                  id="rating"
                  label="Rating"
                  options={ratingOptions}
                  error={movieForm.formState.errors.rating?.message}
                  {...movieForm.register('rating', {
                    required: 'Rating is required',
                  })}
                />
                
                <Input
                  id="language"
                  label="Language"
                  error={movieForm.formState.errors.language?.message}
                  {...movieForm.register('language', {
                    required: 'Language is required',
                  })}
                  placeholder="English"
                />
              </div>
              
              <div>
                <label 
                  htmlFor="poster" 
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Movie Poster
                </label>
                <input
                  id="poster"
                  type="file"
                  accept="image/*"
                  className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900"
                  {...movieForm.register('poster', {
                    required: 'Movie poster is required',
                  })}
                />
                {movieForm.formState.errors.poster && (
                  <p className="mt-1 text-xs text-danger-500">{movieForm.formState.errors.poster.message}</p>
                )}
              </div>
              
              <div>
                <Input
                  id="trailerUrl"
                  label="Trailer URL (YouTube) - Optional"
                  error={movieForm.formState.errors.trailerUrl?.message}
                  {...movieForm.register('trailerUrl', {
                    pattern: {
                      value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i,
                      message: 'Must be a valid YouTube URL',
                    },
                  })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isSubmittingMovie}
                  disabled={isSubmittingMovie}
                >
                  {isSubmittingMovie ? 'Adding Movie...' : 'Add Movie & Continue to Showtimes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Showtime Tab */}
      {activeTab === 'showtime' && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingShowtime ? 'Edit Showtime' : 'Add New Showtime'}
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {editingShowtime 
                ? 'Update the showtime details below.'
                : 'Create a new showtime for your approved theatre. Select a movie, theatre, and set pricing.'
              }
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={showtimeForm.handleSubmit(onSubmitShowtime)} className="space-y-4">
              <div>
                <Select
                  id="movieId"
                  label="Select Movie"
                  options={movieOptions}
                  error={showtimeForm.formState.errors.movieId?.message}
                  {...showtimeForm.register('movieId', {
                    required: 'Movie is required',
                  })}
                />
                {movieOptions.length === 0 && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    No movies available. Add a movie first to create showtimes.
                  </p>
                )}
              </div>
              
              <div>
                <Select
                  id="theatreId"
                  label="Select Theatre"
                  options={theatreOptions}
                  error={showtimeForm.formState.errors.theatreId?.message}
                  {...showtimeForm.register('theatreId', {
                    required: 'Theatre is required',
                  })}
                />
              </div>
              
              <div>
                <Select
                  id="screenId"
                  label="Select Screen"
                  options={screens}
                  error={showtimeForm.formState.errors.screenId?.message}
                  disabled={!selectedTheatreId}
                  {...showtimeForm.register('screenId', {
                    required: 'Screen is required',
                  })}
                />
                {!selectedTheatreId && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Select a theatre first to see available screens.
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  id="date"
                  type="date"
                  label="Show Date"
                  leftIcon={<Calendar size={16} />}
                  error={showtimeForm.formState.errors.date?.message}
                  {...showtimeForm.register('date', {
                    required: 'Date is required',
                    validate: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return selectedDate >= today || 'Date cannot be in the past';
                    },
                  })}
                />
                
                <Input
                  id="startTime"
                  type="time"
                  label="Start Time"
                  leftIcon={<Clock size={16} />}
                  error={showtimeForm.formState.errors.startTime?.message}
                  {...showtimeForm.register('startTime', {
                    required: 'Start time is required',
                  })}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  id="priceRegular"
                  type="number"
                  step="0.01"
                  label="Regular Seat Price ($)"
                  leftIcon={<DollarSign size={16} />}
                  error={showtimeForm.formState.errors.priceRegular?.message}
                  {...showtimeForm.register('priceRegular', {
                    required: 'Regular price is required',
                    min: {
                      value: 1,
                      message: 'Price must be at least $1',
                    },
                    max: {
                      value: 100,
                      message: 'Price cannot exceed $100',
                    },
                    valueAsNumber: true,
                  })}
                />
                
                <Input
                  id="pricePremium"
                  type="number"
                  step="0.01"
                  label="Premium Seat Price ($)"
                  leftIcon={<DollarSign size={16} />}
                  error={showtimeForm.formState.errors.pricePremium?.message}
                  {...showtimeForm.register('pricePremium', {
                    required: 'Premium price is required',
                    min: {
                      value: 1,
                      message: 'Price must be at least $1',
                    },
                    max: {
                      value: 150,
                      message: 'Price cannot exceed $150',
                    },
                    valueAsNumber: true,
                  })}
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={isSubmittingShowtime}
                  disabled={isSubmittingShowtime || movieOptions.length === 0 || theatreOptions.length === 0}
                  leftIcon={editingShowtime ? <Edit size={16} /> : <Plus size={16} />}
                >
                  {isSubmittingShowtime 
                    ? (editingShowtime ? 'Updating...' : 'Creating...') 
                    : (editingShowtime ? 'Update Showtime' : 'Create Showtime')
                  }
                </Button>
                
                {editingShowtime && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEditShowtime}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Manage Showtimes Tab */}
      {activeTab === 'manage' && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Existing Showtimes</CardTitle>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                id="filterTheatre"
                label="Filter by Theatre"
                options={[
                  { value: '', label: 'All Theatres' },
                  ...theatreOptions
                ]}
                value={selectedTheatre}
                onChange={setSelectedTheatre}
              />
              <Select
                id="filterMovie"
                label="Filter by Movie"
                options={[
                  { value: '', label: 'All Movies' },
                  ...movieOptions
                ]}
                value={selectedMovie}
                onChange={setSelectedMovie}
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredShowtimes.length === 0 ? (
              <div className="py-8 text-center text-slate-600 dark:text-slate-400">
                <p>No showtimes found. Create your first showtime above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredShowtimes.map((showtime) => (
                  <div
                    key={showtime.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{getMovieTitle(showtime.movieId)}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {getTheatreInfo(showtime.theatreId)} • {showtime.screenId.replace('-', ' ')}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(showtime.date).toLocaleDateString()} at {showtime.startTime}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Regular: ${showtime.price.regular} • Premium: ${showtime.price.premium}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditShowtime(showtime)}
                        leftIcon={<Edit size={16} />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteShowtime(showtime.id)}
                        leftIcon={<Trash2 size={16} />}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MovieShowtimeForm;