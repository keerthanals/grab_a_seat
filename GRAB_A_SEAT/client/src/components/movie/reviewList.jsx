import React, { useEffect } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useMovieStore } from '../../stores/movieStore';
import { formatDate } from '../../utils/helpers';
import Button from '../ui/Button';
import { Card } from '../ui/Card';

const ReviewList = ({ movieId }) => {
  const { user } = useAuthStore();
  const { reviews, deleteReview, fetchMovieReviews } = useMovieStore();

  useEffect(() => {
    if (movieId) {
      fetchMovieReviews(movieId);
    }
  }, [movieId, fetchMovieReviews]);

  const movieReviews = reviews.filter(review => review.movieId === movieId);

  if (movieReviews.length === 0) {
    return (
      <div className="py-6 text-center text-slate-600 dark:text-slate-400">
        <p>No reviews yet. Be the first to review this movie!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {movieReviews.map(review => (
        <ReviewItem
          key={review.id}
          review={review}
          canDelete={user?.role === 'admin' || user?.id === review.userId || user?._id === review.userId}
          onDelete={() => deleteReview(review.id)}
        />
      ))}
    </div>
  );
};

const ReviewItem = ({ review, canDelete, onDelete }) => {
  return (
    <Card className="border border-slate-200 shadow-sm dark:border-slate-800">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= review.rating
                        ? 'text-accent-500 fill-accent-500'
                        : 'text-slate-300 dark:text-slate-700'
                    }
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {review.userName || 'Anonymous User'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatDate(review.date || review.createdAt)}
              </span>
            </div>
            {review.comment && (
              <p className="text-slate-800 dark:text-slate-200">{review.comment}</p>
            )}
          </div>
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-slate-500 hover:text-danger-500 dark:text-slate-400 dark:hover:text-danger-500"
              aria-label="Delete review"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ReviewList;