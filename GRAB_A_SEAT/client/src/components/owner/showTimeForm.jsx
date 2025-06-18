import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, DollarSign, Edit, Trash2, Plus } from 'lucide-react';
import { useMovieStore } from '../../stores/movieStore';
import { useTheatreStore } from '../../stores/theatreStore';
import { useAuthStore } from '../../stores/authStore';
import { ownerAPI } from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { toast } from 'sonner';

const ShowtimeForm = () => {
  const { movies, fetchMovies } = useMovieStore();
  const { theatres, showtimes, fetchOwnerTheatres, fetchShowtimes, addShowtime, updateShowtime, deleteShowtime } = useTheatreStore();
  const { user } = useAuthStore();
  const [screens, setScreens] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
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
  
  const selectedTheatreId = watch('theatreId');
  
  useEffect(() => {
    fetchMovies();
    fetchOwnerTheatres();
    fetchShowtimes();
  }, [fetchMovies, fetchOwnerTheatres, fetchShowtimes]);
  
  useEffect(() => {
    if (selectedTheatreId) {
      const theatre = theatres.find((t) => t.id === selectedTheatreId);
      if (theatre) {
        const screenOptions = theatre.screens.map((screen) => ({
          value: screen.id,
          label: screen.name,
        }));
        
        setScreens(screenOptions);
        if (screenOptions.length > 0) {
          setValue('screenId', screenOptions[0].value);
        }
      }
    } else {
      setScreens([]);
      setValue('screenId', '');
    }
  }, [selectedTheatreId, theatres, setValue]);
  
  const ownerTheatres = theatres.filter(
    (theatre) => theatre.ownerId === user?._id && theatre.approved
  );
  
  const theatreOptions = ownerTheatres.map((theatre) => ({
    value: theatre.id,
    label: `${theatre.name} - ${theatre.location}`,
  }));
  
  const movieOptions = movies.map((movie) => ({
    value: movie.id,
    label: movie.title,
  }));
  
  // Filter showtimes by selected theatre and movie
  const filteredShowtimes = showtimes.filter(showtime => {
    const matchesTheatre = !selectedTheatre || showtime.theatreId === selectedTheatre;
    const matchesMovie = !selectedMovie || showtime.movieId === selectedMovie;
    return matchesTheatre && matchesMovie;
  });
  
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
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
      
      reset();
    } catch (error) {
      console.error('Failed to save showtime:', error);
      toast.error(error.message || 'Failed to save showtime');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEdit = (showtime) => {
    setEditingShowtime(showtime);
    setValue('movieId', showtime.movieId);
    setValue('theatreId', showtime.theatreId);
    setValue('screenId', showtime.screenId);
    setValue('date', showtime.date);
    setValue('startTime', showtime.startTime);
    setValue('priceRegular', showtime.price.regular);
    setValue('pricePremium', showtime.price.premium);
  };
  
  const handleDelete = async (showtimeId) => {
    if (confirm('Are you sure you want to delete this showtime?')) {
      try {
        await deleteShowtime(showtimeId);
        toast.success('Showtime deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete showtime');
      }
    }
  };
  
  const cancelEdit = () => {
    setEditingShowtime(null);
    reset();
  };
  
  const getMovieTitle = (movieId) => {
    const movie = movies.find(m => m.id === movieId);
    return movie ? movie.title : 'Unknown Movie';
  };
  
  const getTheatreInfo = (theatreId) => {
    const theatre = theatres.find(t => t.id === theatreId);
    return theatre ? `${theatre.name} - ${theatre.location}` : 'Unknown Theatre';
  };
  
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
            You need at least one approved theatre to create showtimes. 
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
      {/* Add/Edit Showtime Form */}
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Select
                id="movieId"
                label="Select Movie"
                options={movieOptions}
                error={errors.movieId?.message}
                {...register('movieId', {
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
                error={errors.theatreId?.message}
                {...register('theatreId', {
                  required: 'Theatre is required',
                })}
              />
            </div>
            
            <div>
              <Select
                id="screenId"
                label="Select Screen"
                options={screens}
                error={errors.screenId?.message}
                disabled={!selectedTheatreId}
                {...register('screenId', {
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
                error={errors.date?.message}
                {...register('date', {
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
                error={errors.startTime?.message}
                {...register('startTime', {
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
                error={errors.priceRegular?.message}
                {...register('priceRegular', {
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
                error={errors.pricePremium?.message}
                {...register('pricePremium', {
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
                isLoading={isSubmitting}
                disabled={isSubmitting || movieOptions.length === 0 || theatreOptions.length === 0}
                leftIcon={editingShowtime ? <Edit size={16} /> : <Plus size={16} />}
              >
                {isSubmitting 
                  ? (editingShowtime ? 'Updating...' : 'Creating...') 
                  : (editingShowtime ? 'Update Showtime' : 'Create Showtime')
                }
              </Button>
              
              {editingShowtime && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEdit}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Existing Showtimes */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Existing Showtimes</CardTitle>
          <div className="flex gap-4">
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
                      onClick={() => handleEdit(showtime)}
                      leftIcon={<Edit size={16} />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(showtime.id)}
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
    </div>
  );
};

export default ShowtimeForm;