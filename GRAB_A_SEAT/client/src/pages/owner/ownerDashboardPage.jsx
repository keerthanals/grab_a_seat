import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Film, TicketCheck, Calendar } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useTheatreStore } from '../../stores/theatreStore';
import { useBookingStore } from '../../stores/bookingStore';
import { useMovieStore } from '../../stores/movieStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import TheatreForm from '../../components/owner/TheatreForm';
import MovieShowtimeForm from '../../components/owner/MovieShowtimeForm';
import BookingDetailsTable from '../../components/admin/BookingDetailsTable';
import Loader from '../../components/ui/Loader';
import TheatreCard from '../../components/theatre/TheatreCard';

const OwnerDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { theatres, showtimes, isLoading: isTheatreLoading, fetchOwnerTheatres, fetchShowtimes } = useTheatreStore();
  const { bookings, isLoading: isBookingLoading, fetchOwnerBookings } = useBookingStore();
  const { fetchMovies } = useMovieStore();
  const [activeTab, setActiveTab] = useState('theatres');
  
  useEffect(() => {
    // Redirect if not authenticated or not a theatre owner
    if (!isAuthenticated || user?.role !== 'owner') {
      navigate('/login');
      return;
    }
    
    console.log('Owner dashboard loading data for user:', user._id);
    
    // Fetch all necessary data
    const loadData = async () => {
      try {
        await Promise.all([
          fetchOwnerTheatres(),
          fetchShowtimes(),
          fetchOwnerBookings(),
          fetchMovies()
        ]);
      } catch (error) {
        console.error('Error loading owner dashboard data:', error);
      }
    };
    
    loadData();
  }, [isAuthenticated, user, navigate, fetchOwnerTheatres, fetchShowtimes, fetchOwnerBookings, fetchMovies]);
  
  const isLoading = isTheatreLoading || isBookingLoading;
  
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size={36} />
      </div>
    );
  }
  
  // Filter theatres owned by current user
  const userTheatres = theatres.filter((theatre) => {
    console.log('Checking theatre:', theatre.name, 'ownerId:', theatre.ownerId, 'user._id:', user?._id);
    return theatre.ownerId === user?._id;
  });
  
  console.log('User theatres found:', userTheatres.length);
  console.log('All theatres:', theatres.length);
  console.log('User ID:', user?._id);
  
  // Filter bookings for the user's theatres
  const userTheatreIds = userTheatres.map((theatre) => theatre.id);
  const theatreShowtimes = showtimes.filter((showtime) => 
    userTheatreIds.includes(showtime.theatreId)
  );
  const theatreShowtimeIds = theatreShowtimes.map((showtime) => showtime.id);
  const theatreBookings = bookings.filter((booking) => 
    theatreShowtimeIds.includes(booking.showtimeId)
  );
  
  const approvedTheatres = userTheatres.filter(t => t.approved);
  const pendingTheatres = userTheatres.filter(t => !t.approved);
  
  return (
    <div className="container-custom py-12">
      <h1 className="mb-8 text-3xl font-bold">Theatre Owner Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  My Theatres
                </p>
                <h3 className="mt-1 text-3xl font-semibold">
                  {userTheatres.length}
                </h3>
              </div>
              <Building2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="text-success-500">
                {approvedTheatres.length} approved
              </span>
              {" • "}
              <span className="text-accent-500">
                {pendingTheatres.length} pending
              </span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Screens
                </p>
                <h3 className="mt-1 text-3xl font-semibold">
                  {userTheatres.reduce((sum, theatre) => sum + (theatre.screens?.length || 0), 0)}
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
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Active Showtimes
                </p>
                <h3 className="mt-1 text-3xl font-semibold">
                  {theatreShowtimes.length}
                </h3>
              </div>
              <Calendar className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Bookings
                </p>
                <h3 className="mt-1 text-3xl font-semibold">
                  {theatreBookings.length}
                </h3>
              </div>
              <TicketCheck className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="text-success-500">
                {theatreBookings.filter((b) => b.status === 'confirmed').length} active
              </span>
              {" • "}
              <span className="text-danger-500">
                {theatreBookings.filter((b) => b.status === 'cancelled').length} cancelled
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('theatres')}
            className={`inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'theatres'
                ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Building2 className="mr-2 h-4 w-4" />
            My Theatres ({userTheatres.length})
          </button>
          <button
            onClick={() => setActiveTab('movies-showtimes')}
            className={`inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'movies-showtimes'
                ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Film className="mr-2 h-4 w-4" />
            Movies & Showtimes
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'bookings'
                ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <TicketCheck className="mr-2 h-4 w-4" />
            Bookings ({theatreBookings.length})
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div>
        {/* My Theatres */}
        {activeTab === 'theatres' && (
          <div className="space-y-8">
            {/* Approved Theatres */}
            {approvedTheatres.length > 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-semibold text-success-600 dark:text-success-400">
                  Approved Theatres ({approvedTheatres.length})
                </h2>
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {approvedTheatres.map((theatre) => (
                    <div key={theatre.id} className="relative">
                      <TheatreCard theatre={theatre} />
                      <div className="absolute -top-2 -right-2">
                        <span className="inline-flex items-center rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-800 dark:bg-success-900 dark:text-success-300">
                          ✓ Approved
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Theatres */}
            {pendingTheatres.length > 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-semibold text-accent-600 dark:text-accent-400">
                  Pending Approval ({pendingTheatres.length})
                </h2>
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pendingTheatres.map((theatre) => (
                    <div key={theatre.id} className="relative opacity-75">
                      <TheatreCard theatre={theatre} />
                      <div className="absolute -top-2 -right-2">
                        <span className="inline-flex items-center rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-800 dark:bg-accent-900 dark:text-accent-300">
                          ⏳ Pending
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Theatres Message */}
            {userTheatres.length === 0 && (
              <Card className="mb-8 p-8 text-center">
                <div className="mb-4">
                  <Building2 className="mx-auto h-16 w-16 text-slate-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">No Theatres Yet</h3>
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                  You don't have any theatres yet. Create your first theatre to get started.
                </p>
              </Card>
            )}
            
            {/* Create Theatre Form */}
            <div>
              <h2 className="mb-6 text-2xl font-semibold">Create New Theatre</h2>
              <TheatreForm />
            </div>
          </div>
        )}
        
        {/* Movies & Showtimes */}
        {activeTab === 'movies-showtimes' && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Manage Movies & Showtimes</h2>
            <MovieShowtimeForm />
          </div>
        )}
        
        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Theatre Bookings</h2>
            
            {theatreBookings.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="mb-4">
                  <TicketCheck className="mx-auto h-16 w-16 text-slate-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">No Bookings Yet</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  No bookings found for your theatres. Once customers start booking tickets, they'll appear here.
                </p>
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