import React from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, Film } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

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
      releaseDate: new Date().toISOString().split('T')[0], // Today’s date in YYYY-MM-DD
      genre: 'drama',
      rating: 'PG-13',
      posterUrl: '',
      trailerUrl: '',
    },
  });

  const onSubmit = (data) => {
    // In a real app, send data to your API or state management
    console.log('Submitted movie:', data);

    reset();
    alert('Movie added successfully!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Movie</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Movie Title */}
          <Input
            id="title"
            label="Movie Title"
            placeholder="Inception"
            leftIcon={<Film size={16} />}
            error={errors.title?.message}
            {...register('title', { required: 'Movie title is required' })}
          />

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Movie description..."
              className="mt-1 w-full rounded-md border border-slate-300 p-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900"
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 20,
                  message: 'Description must be at least 20 characters',
                },
              })}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-danger-500">{errors.description.message}</p>
            )}
          </div>

          {/* Duration and Release Date */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              id="duration"
              type="number"
              label="Duration (minutes)"
              placeholder="120"
              leftIcon={<Clock size={16} />}
              min={30}
              max={300}
              error={errors.duration?.message}
              {...register('duration', {
                required: 'Duration is required',
                min: { value: 30, message: 'Minimum duration is 30 minutes' },
                max: { value: 300, message: 'Maximum duration is 300 minutes' },
              })}
            />
            <Input
              id="releaseDate"
              type="date"
              label="Release Date"
              leftIcon={<Calendar size={16} />}
              error={errors.releaseDate?.message}
              {...register('releaseDate', { required: 'Release date is required' })}
            />
          </div>

          {/* Genre and Rating */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              id="genre"
              label="Genre"
              options={genreOptions}
              error={errors.genre?.message}
              {...register('genre', { required: 'Genre is required' })}
            />
            <Select
              id="rating"
              label="Rating"
              options={ratingOptions}
              error={errors.rating?.message}
              {...register('rating', { required: 'Rating is required' })}
            />
          </div>

          {/* Poster URL */}
          <Input
            id="posterUrl"
            label="Poster URL"
            placeholder="https://example.com/poster.jpg"
            error={errors.posterUrl?.message}
            {...register('posterUrl', {
              required: 'Poster URL is required',
              pattern: {
                value: /^(https?:\/\/.*)\.(jpeg|jpg|gif|png)$/i,
                message: 'Must be a valid image URL',
              },
            })}
          />

          {/* Trailer URL */}
          <Input
            id="trailerUrl"
            label="Trailer URL (YouTube)"
            placeholder="https://youtube.com/watch?v=..."
            error={errors.trailerUrl?.message}
            {...register('trailerUrl', {
              pattern: {
                value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i,
                message: 'Must be a valid YouTube URL',
              },
            })}
          />

          {/* Submit Button */}
          <div className="pt-2">
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Add Movie
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MovieForm;
