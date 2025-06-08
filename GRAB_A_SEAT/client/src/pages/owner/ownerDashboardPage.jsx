import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Film, TicketCheck, Calendar } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useTheatreStore } from '../../stores/theatreStore';
import { useBookingStore } from '../../stores/bookingStore';
import { useMovieStore } from '../../stores/movieStore';
import { Card, CardContent } from '../../components/ui/Card';
import TheatreForm from '../../components/owner/TheatreForm';
import MovieForm from '../../components/owner/MovieForm';
import ShowtimeForm from '../../components/owner/ShowtimeForm';
import BookingDetailsTable from '../../components/admin/BookingDetailsTable';
import Loader from '../../components/ui/Loader';
import TheatreCard from '../../components/theatre/TheatreCard';

const OwnerDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const {
    theatres,
    showtimes,
    isLoading: isTheatreLoading,
    fetchTheatres,
    fetchShowtimes
  } = useTheatreStore();
  const {
    bookings,
    isLoading: isBookingLoading,
    fetchBookings
  } = useBookingStore();
  const { fetchMovies } = useMovieStore();

  const [activeTab, setActiveTab] = useState('theatres');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'owner') {
      navigate('/login');
      return;
    }
    fetchTheatres();
    fetchShowtimes();
    fetchBookings();
    fetchMovies();
  }, [isAuthenticated, user, navigate, fetchTheatres, fetchShowtimes, fetchBookings, fetchMovies]);

  const isLoading = isTheatreLoading || isBookingLoading;
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size={36} />
      </div>
    );
  }

  const userTheatres = theatres.filter(t => t.ownerId === user?.id);
  const userTheatreIds = userTheatres.map(t => t.id);
  const theatreShowtimes = showtimes.filter(s => userTheatreIds.includes(s.theatreId));
  const theatreShowtimeIds = theatreShowtimes.map(s => s.id);
  const theatreBookings = bookings.filter(b => theatreShowtimeIds.includes(b.showtimeId));

  return (
    <div className="container-custom py-12">
      <h1 className="mb-8 text-3xl font-bold">Theatre Owner Dashboard</h1>

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">My Theatres</p>
                <h3 className="mt-1 text-3xl font-semibold">{userTheatres.length}</h3>
              </div>
              <Building2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="text-success-500">{userTheatres.filter(t => t.approved).length} approved</span> •{" "}
              <span className="text-accent-500">{userTheatres.filter(t => !t.approved).length} pending</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Screens</p>
                <h3 className="mt-1 text-3xl font-semibold">
                  {userTheatres.reduce((sum, t) => sum + t.screens.length, 0)}
                </h3>
              </div>
              <Film className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Showtimes</p>
                <h3 className="mt-1 text-3xl font-semibold">{theatreShowtimes.length}</h3>
              </div>
              <Calendar className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Bookings</p>
                <h3 className="mt-1 text-3xl font-semibold">{theatreBookings.length}</h3>
              </div>
              <TicketCheck className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="text-success-500">{theatreBookings.filter(b => b.status === 'confirmed').length} active</span> •{" "}
              <span className="text-danger-500">{theatreBookings.filter(b => b.status === 'cancelled').length} cancelled</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-4">
          {[
            { key: 'theatres', label: 'My Theatres', Icon: Building2 },
            { key: 'movies', label: 'Add Movie', Icon: Film },
            { key: 'showtimes', label: 'Add Showtime', Icon: Calendar },
            { key: 'bookings', label: 'Bookings', Icon: TicketCheck },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === key
                  ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {activeTab === 'theatres' && (
          <div className="space-y-8">
            <div>
              <h2 className="mb-6 text-2xl font-semibold">My Theatres</h2>
              {userTheatres.length === 0 ? (
                <Card className="mb-8 p-8 text-center">
                  <p className="mb-4 text-slate-600 dark:text-slate-400">You don't have any theatres yet.</p>
                </Card>
              ) : (
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {userTheatres.map(theatre => (
                    <TheatreCard key={theatre.id} theatre={theatre} />
                  ))}
                </div>
              )}
            </div>
            <div>
              <h2 className="mb-6 text-2xl font-semibold">Add New Theatre</h2>
              <TheatreForm />
            </div>
          </div>
        )}

        {activeTab === 'movies' && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Add New Movie</h2>
            <MovieForm />
          </div>
        )}

        {activeTab === 'showtimes' && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Add New Showtimes</h2>
            {userTheatres.filter(t => t.approved).length === 0 ? (
              <Card className="p-8 text-center">
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                  You need at least one approved theatre to add showtimes.
                </p>
              </Card>
            ) : (
              <ShowtimeForm />
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Theatre Bookings</h2>
            {theatreBookings.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-slate-600 dark:text-slate-400">No bookings found for your theatres.</p>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <BookingDetailsTable bookings={theatreBookings} />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
