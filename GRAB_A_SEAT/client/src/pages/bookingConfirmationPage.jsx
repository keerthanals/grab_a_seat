import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Film, Ticket } from 'lucide-react';
import { formatDate, formatCurrency } from '../utils/helpers';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get booking details from location state
  const bookingDetails = location.state;

  if (!bookingDetails) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">Booking Information Not Found</h1>
        <p className="mb-6">The booking information is missing or invalid.</p>
        <Button onClick={() => navigate('/movies')}>Browse Movies</Button>
      </div>
    );
  }

  // Generate a random booking confirmation number
  const confirmationNumber = `CIN${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  return (
    <div className="container-custom max-w-3xl py-12">
      <div className="mb-12 text-center">
        <CheckCircle size={64} className="mx-auto mb-4 text-success-500" />
        <h1 className="mb-2 text-3xl font-bold text-success-500">Booking Confirmed!</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Your tickets have been booked successfully.
        </p>
      </div>

      <Card className="mb-8 overflow-hidden border border-slate-200 dark:border-slate-800">
        <CardHeader className="bg-primary-900 text-white">
          <CardTitle>Booking Details</CardTitle>
          <p className="mt-1 text-sm text-primary-200">Confirmation #{confirmationNumber}</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-primary-50 p-6 dark:bg-primary-950">
            <h2 className="mb-4 text-xl font-semibold">{bookingDetails.movieTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-primary-600 dark:text-primary-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Date</p>
                  <p className="text-slate-600 dark:text-slate-400">{formatDate(bookingDetails.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 text-primary-600 dark:text-primary-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Time</p>
                  <p className="text-slate-600 dark:text-slate-400">{bookingDetails.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-primary-600 dark:text-primary-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Theatre</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    {bookingDetails.theatreName} &bull; {bookingDetails.screenName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Ticket className="mt-1 h-5 w-5 text-primary-600 dark:text-primary-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Seats</p>
                  <p className="text-slate-600 dark:text-slate-400">{bookingDetails.seats.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 p-6 dark:border-slate-800">
            <div className="flex justify-between">
              <span className="font-medium">Total Amount:</span>
              <span className="font-semibold">{formatCurrency(bookingDetails.totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
        <Button
          variant="primary"
          leftIcon={<Film size={16} />}
          onClick={() => navigate('/movies')}
        >
          Browse More Movies
        </Button>
        <Button
          variant="outline"
          leftIcon={<Ticket size={16} />}
          onClick={() => navigate('/bookings')}
        >
          View My Bookings
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
