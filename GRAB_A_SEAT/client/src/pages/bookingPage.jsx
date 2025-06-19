import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheatreStore } from '../stores/theatreStore';
import { useMovieStore } from '../stores/movieStore';
import { useBookingStore } from '../stores/bookingStore';
import { useAuthStore } from '../stores/authStore';
import { formatDate, formatTime, formatCurrency } from '../utils/helpers';
import Loader from '../components/ui/Loader';
import SeatSelector from '../components/booking/SeatSelector';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';

const BookingPage = () => {
  const { id } = useParams(); // showtime id
  const navigate = useNavigate();

  const { isAuthenticated, user } = useAuthStore();

  const {
    theatres,
    showtimes,
    isLoading: isTheatreLoading,
    fetchTheatres,
    fetchShowtimes
  } = useTheatreStore();

  const {
    movies,
    isLoading: isMovieLoading,
    fetchMovies
  } = useMovieStore();

  const {
    bookings,
    selectedSeats,
    isLoading: isBookingLoading,
    fetchUserBookings,
    createBooking
  } = useBookingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const loadData = async () => {
      try {
        await Promise.all([
          fetchTheatres(),
          fetchShowtimes(),
          fetchMovies(),
          fetchUserBookings()
        ]);
      } catch (error) {
        console.error('Error loading booking page data:', error);
      }
    };
    
    loadData();
  }, [isAuthenticated, navigate, fetchTheatres, fetchShowtimes, fetchMovies, fetchUserBookings]);

  const isLoading = isTheatreLoading || isMovieLoading || isBookingLoading;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size={36} />
      </div>
    );
  }

  const showtime = showtimes.find(s => s.id === id);

  if (!showtime) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">Showtime not found</h1>
        <p className="mb-6">The showtime you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/movies')}>Browse Movies</Button>
      </div>
    );
  }

  const movie = movies.find(m => m.id === showtime.movieId);
  const theatre = theatres.find(t => t.id === showtime.theatreId);
  const screen = theatre?.screens.find(s => s.id === showtime.screenId);

  if (!movie || !theatre || !screen) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">Information not found</h1>
        <p className="mb-6">Some details about this booking are missing.</p>
        <Button onClick={() => navigate('/movies')}>Browse Movies</Button>
      </div>
    );
  }

  const calculateTotal = () =>
    selectedSeats.reduce((total, seatId) => {
      const seatType = screen.seatLayout.seatMap[seatId];
      return total + (seatType === 'premium' ? showtime.price.premium : showtime.price.regular);
    }, 0);

  const handleBookTickets = async () => {
    if (selectedSeats.length === 0) return;

    try {
      setIsSubmitting(true);

      const bookingData = {
        userId: user._id || user.id,
        showtimeId: showtime.id,
        seats: selectedSeats,
        totalAmount: calculateTotal()
      };

      console.log('Creating booking with data:', bookingData);
      await createBooking(bookingData);

      navigate('/booking/confirmation', {
        state: {
          movieTitle: movie.title,
          theatreName: theatre.name,
          screenName: screen.name,
          date: showtime.date,
          time: showtime.startTime,
          seats: selectedSeats,
          totalAmount: calculateTotal()
        }
      });
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          ← Back
        </Button>
        <h1 className="mb-2 text-3xl font-bold">{movie.title}</h1>
        <p className="text-slate-600 dark:text-slate-400">
          {theatre.name} • {screen.name} • {formatDate(showtime.date)} at {formatTime(showtime.startTime)}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="bg-slate-50 dark:bg-slate-900">
              <CardTitle className="text-xl">Select Your Seats</CardTitle>
            </CardHeader>
            <CardContent>
              <SeatSelector 
                showtime={showtime} 
                seatLayout={screen.seatLayout} 
                existingBookings={bookings}
                onProceedToPayment={handleBookTickets}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-24">
            <CardHeader className="bg-slate-50 dark:bg-slate-900">
              <CardTitle className="text-xl">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <img src={movie.poster} alt={movie.title} className="h-24 w-16 rounded object-cover" />
                <div>
                  <h3 className="font-semibold">{movie.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {formatDate(showtime.date)} at {formatTime(showtime.startTime)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {theatre.name} • {screen.name}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                <div className="mb-2 flex justify-between">
                  <span className="font-medium">Selected Seats:</span>
                  <span>{selectedSeats.length === 0 ? 'None' : selectedSeats.join(', ')}</span>
                </div>
                <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                  {selectedSeats.map(seat => {
                    const type = screen.seatLayout.seatMap[seat];
                    const price = type === 'premium' ? showtime.price.premium : showtime.price.regular;
                    return (
                      <div key={seat} className="flex justify-between py-1">
                        <span>
                          Seat {seat} ({type === 'premium' ? 'Premium' : 'Regular'})
                        </span>
                        <span>{formatCurrency(price)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              <Button
                className="mt-4 w-full"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                disabled={selectedSeats.length === 0 || isSubmitting}
                onClick={handleBookTickets}
              >
                {isSubmitting ? 'Processing...' : 'Book Tickets'}
              </Button>
              <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                By proceeding, you agree to our terms of service and privacy policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;