import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, Film } from 'lucide-react';
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

const MovieForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
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
  
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all form fields to FormData
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('duration', data.duration.toString());
      formData.append('releaseDate', data.releaseDate);
      formData.append('genre', data.genre);
      formData.append('rating', data.rating);
      formData.append('language', data.language);
      formData.append('trailerUrl', data.trailerUrl || '');
      
      // Add poster file if selected
      if (data.poster && data.poster[0]) {
        formData.append('poster', data.poster[0]);
      }
      
      console.log('Submitting movie data:', {
        title: data.title,
        description: data.description,
        duration: data.duration,
        releaseDate: data.releaseDate,
        genre: data.genre,
        rating: data.rating,
        language: data.language,
        trailerUrl: data.trailerUrl,
        hasPoster: !!(data.poster && data.poster[0])
      });
      
      const response = await ownerAPI.addMovie(formData);
      console.log('Movie added successfully:', response);
      
      toast.success('Movie added successfully!');
      reset();
    } catch (error) {
      console.error('Failed to add movie:', error);
      toast.error(error.message || 'Failed to add movie');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Movie</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Add a movie to your theatre's catalog. You can create showtimes after adding the movie.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              id="title"
              label="Movie Title"
              leftIcon={<Film size={16} />}
              error={errors.title?.message}
              {...register('title', {
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
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 20,
                  message: 'Description must be at least 20 characters',
                },
              })}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-xs text-danger-500">{errors.description.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              id="duration"
              type="number"
              label="Duration (minutes)"
              leftIcon={<Clock size={16} />}
              error={errors.duration?.message}
              {...register('duration', {
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
              error={errors.releaseDate?.message}
              {...register('releaseDate', {
                required: 'Release date is required',
              })}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Select
              id="genre"
              label="Genre"
              options={genreOptions}
              error={errors.genre?.message}
              {...register('genre', {
                required: 'Genre is required',
              })}
            />
            
            <Select
              id="rating"
              label="Rating"
              options={ratingOptions}
              error={errors.rating?.message}
              {...register('rating', {
                required: 'Rating is required',
              })}
            />
            
            <Input
              id="language"
              label="Language"
              error={errors.language?.message}
              {...register('language', {
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
              {...register('poster', {
                required: 'Movie poster is required',
              })}
            />
            {errors.poster && (
              <p className="mt-1 text-xs text-danger-500">{errors.poster.message}</p>
            )}
          </div>
          
          <div>
            <Input
              id="trailerUrl"
              label="Trailer URL (YouTube) - Optional"
              error={errors.trailerUrl?.message}
              {...register('trailerUrl', {
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
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Movie...' : 'Add Movie'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MovieForm;