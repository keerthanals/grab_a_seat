import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useMovieStore } from '../../stores/movieStore';
import Button from '../ui/Button';
import { cn } from '../../utils/helpers';

const ReviewForm = ({ movieId, onSuccess }) => {
  const { user } = useAuthStore();
  const { addReview } = useMovieStore();

  const [hoveredRating, setHoveredRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      rating: 0,
      comment: ''
    }
  });

  const rating = watch('rating');

  const onSubmit = (data) => {
    if (!user) return; // optionally you could notify user to login
    addReview({
      movieId,
      userId: user.id,
      rating: data.rating,
      comment: data.comment
    });
    reset();
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Rating input */}
      <div>
        <label className="block mb-2 text-sm font-medium" htmlFor="rating">
          Your Rating
        </label>
        <div className="flex gap-1" role="radiogroup" aria-label="Movie rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue('rating', value, { shouldValidate: true })}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
              aria-pressed={rating === value}
              aria-label={`${value} star${value > 1 ? 's' : ''}`}
            >
              <Star
                size={24}
                className={cn(
                  'transition-colors',
                  (hoveredRating || rating) >= value
                    ? 'text-accent-500 fill-accent-500'
                    : 'text-slate-300 dark:text-slate-700'
                )}
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="mt-1 text-xs text-danger-500">{errors.rating.message || 'Please select a rating'}</p>
        )}
      </div>

      {/* Comment textarea */}
      <div>
        <label htmlFor="comment" className="block mb-2 text-sm font-medium">
          Your Review
        </label>
        <textarea
          id="comment"
          {...register('comment', {
            required: 'Please write a review',
            minLength: {
              value: 10,
              message: 'Review must be at least 10 characters'
            }
          })}
          rows={4}
          className="w-full rounded-md border border-slate-300 p-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800"
          placeholder="Share your thoughts about this movie..."
        />
        {errors.comment && (
          <p className="mt-1 text-xs text-danger-500">{errors.comment.message}</p>
        )}
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Submit Review
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
