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
  const { theatres, fetchOwnerTheatres } = useTheatreStore();
  const { user } = useAuthStore();
  const [screens, setScreens] = useState([]);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
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
        setValue('screenId', screenOptions[0]?.value || '');
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
      const showData = {
        movieId: data.movieId,
        theatreId: data.theatreId,
        screenId: data.screenId,
        date: data.date,
        startTime: data.startTime,
        price: {
          regular: data.priceRegular,
          premium: data.pricePremium,
        },
      };
      
      await ownerAPI.createShow(showData);
      
      toast.success('Showtime created successfully!');
      reset();
    } catch (error) {
      toast.error(error.message || 'Failed to create showtime');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Showtime</CardTitle>
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
                  message: 'Price must be positive',
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
                  message: 'Price must be positive',
                },
                valueAsNumber: true,
              })}
            />
          </div>
          
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
            >
              Add Showtime
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShowtimeForm;