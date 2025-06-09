import React from 'react';
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      duration: 120,
      releaseDate: new Date().toISOString().split('T')[0],
      genre: 'drama',
      rating: 'PG-13',
      trailerUrl: '',
    },
  });
  
  const onSubmit = async (data) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(data).forEach(key => {
        if (key === 'poster' && data[key][0]) {
          formData.append('poster', data[key][0]);
        } else if (key !== 'poster') {
          formData.append(key, data[key]);
        }
      });
      
      await ownerAPI.addMovie(formData);
      
      toast.success('Movie added successfully!');
      reset();
    } catch (error) {
      toast.error(error.message || 'Failed to add movie');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Movie</CardTitle>
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
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              label="Trailer URL (YouTube)"
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
            >
              Add Movie
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MovieForm;