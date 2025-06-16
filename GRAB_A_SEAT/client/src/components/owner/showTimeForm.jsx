import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, DollarSign } from 'lucide-react';
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
  const { theatres, fetchOwnerTheatres, addShowtime } = useTheatreStore();
  const { user } = useAuthStore();
  const [screens, setScreens] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
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
  }, [fetchMovies, fetchOwnerTheatres]);
  
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
    (theatre) => theatre.ownerId === user?.id && theatre.approved
  );
  
  const theatreOptions = ownerTheatres.map((theatre) => ({
    value: theatre.id,
    label: theatre.name,
  }));
  
  const movieOptions = movies.map((movie) => ({
    value: movie.id,
    label: movie.title,
  }));
  
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
      
      const response = await ownerAPI.createShow(showData);
      console.log('Showtime created successfully:', response);
      
      // Add to store
      await addShowtime(showData);
      
      toast.success('Showtime created successfully!');
      reset();
    } catch (error) {
      console.error('Failed to create showtime:', error);
      toast.error(error.message || 'Failed to create showtime');
    } finally {
      setIsSubmitting(false);
    }
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
    <Card>
      <CardHeader>
        <CardTitle>Add New Showtime</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Create a new showtime for your approved theatre. Select a movie, theatre, and set pricing.
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
          
          <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-950">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Pricing Information
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>
                    Premium seats are typically located in the last 3 rows and offer better viewing experience.
                    Regular seats are in the front and middle sections.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting || movieOptions.length === 0 || theatreOptions.length === 0}
            >
              {isSubmitting ? 'Creating Showtime...' : 'Create Showtime'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShowtimeForm;