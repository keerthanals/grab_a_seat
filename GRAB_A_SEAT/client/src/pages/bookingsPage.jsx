import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useBookingStore } from '../stores/bookingStore';
import { useMovieStore } from '../stores/movieStore';
import { useTheatreStore } from '../stores/theatreStore';
import { formatDate, formatTime, formatCurrency } from '../utils/helpers';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const BookingsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { bookings, isLoading: isBookingLoading, fetchBookings, cancelBooking } = useBookingStore();
  const { movies, fetchMovies } = useMovieStore();
  const { showtimes, theatres, fetchShowtimes, fetchTheatres } = useTheatreStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookings();
    fetchMovies();
    fetchShowtimes();
    fetchTheatres();
  }, [isAuthenticated, navigate, fetchBookings, fetchMovies, fetchShowtimes, fetchTheatres]);

  if (isBookingLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size={36} />
      </div>
    );
  }

  // Filter bookings for the current user
  const userBookings = bookings.filter(booking => booking.userId === user?.id);

  const getShowtimeDetails = (showtimeId) => {
    const showtime = showtimes.find(st => st.id === showtimeId);
    if (!showtime) return null;
    const movie = movies.find(m => m.id === showtime.movieId);
    const theatre = theatres.find(t => t.id === showtime.theatreId);
    const screen = theatre?.screens.find(s => s.id === showtime.screenId);
    return {
      movie,
      theatre,
      screen,
      date: showtime.date,
      startTime: showtime.startTime,
    };
  };

  const handleCancelBooking = (bookingId) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
    }
  };

  // Group bookings by status
  const upcomingBookings = userBookings.filter(booking => booking.status === 'confirmed');
  const pastBookings = userBookings.filter(booking => booking.status === 'cancelled');

  return (
    <div className="container-custom py-12">
      <h1 className="mb-8 text-3xl font-bold">My Bookings</h1>

      {userBookings.length === 0 ? (
        <div className="text-center">
          <p className="mb-6 text-lg text-slate-600 dark:text-slate-400">
            You don't have any bookings yet.
          </p>
          <Button onClick={() => navigate('/movies')}>Browse Movies</Button>
        </div>
      ) : (
        <div className="space-y-12">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Upcoming Bookings</h2>
            {upcomingBookings.length === 0 ? (
              <p className="text-slate-600 dark:text-slate-400">No upcoming bookings.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingBookings.map(booking => {
                  const details = getShowtimeDetails(booking.showtimeId);
                  if (!details) return null;
                  return (
                    <Card
                      key={booking.id}
                      className="overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                      {details.movie && (
                        <div
                          className="aspect-[4/1] bg-cover bg-center"
                          style={{ backgroundImage: `url(${details.movie.poster})` }}
                        >
                          <div className="flex h-full items-center justify-center bg-slate-900/70 p-4">
                            <h3 className="text-center text-xl font-semibold text-white">
                              {details.movie.title}
                            </h3>
                          </div>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="space-y-3 text-sm">
                          <p>
                            <span className="font-medium">Theatre:</span> {details.theatre?.name} &bull; {details.screen?.name}
                          </p>
                          <p>
                            <span className="font-medium">When:</span> {formatDate(details.date)} at {formatTime(details.startTime)}
                          </p>
                          <p>
                            <span className="font-medium">Seats:</span> {booking.seats.join(', ')}
                          </p>
                          <p>
                            <span className="font-medium">Total Paid:</span> {formatCurrency(booking.totalAmount)}
                          </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="danger" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                            Cancel Booking
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {pastBookings.length > 0 && (
            <div>
              <h2 className="mb-4 text-2xl font-semibold">Past Bookings</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pastBookings.map(booking => {
                  const details = getShowtimeDetails(booking.showtimeId);
                  if (!details) return null;
                  return (
                    <Card key={booking.id} className="border border-slate-200 opacity-75 dark:border-slate-800">
                      <CardHeader className="bg-slate-50 dark:bg-slate-900">
                        <CardTitle className="text-lg text-slate-600 dark:text-slate-400">
                          {details.movie?.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                          <p>
                            <span className="font-medium">Theatre:</span> {details.theatre?.name} &bull; {details.screen?.name}
                          </p>
                          <p>
                            <span className="font-medium">When:</span> {formatDate(details.date)} at {formatTime(details.startTime)}
                          </p>
                          <p>
                            <span className="font-medium">Seats:</span> {booking.seats.join(', ')}
                          </p>
                          <p>
                            <span className="font-medium">Status:</span>{' '}
                            <span className="text-danger-500">Cancelled</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
