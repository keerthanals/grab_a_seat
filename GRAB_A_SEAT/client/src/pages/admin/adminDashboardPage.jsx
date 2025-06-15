import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Film, Users, TicketCheck, UserCheck } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useTheatreStore } from '../../stores/theatreStore';
import { useBookingStore } from '../../stores/bookingStore';
import { useMovieStore } from '../../stores/movieStore';
import { adminAPI } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import TheatreApprovalCard from '../../components/admin/TheatreApprovalCard';
import BookingDetailsTable from '../../components/admin/BookingDetailsTable';
import AdminApprovalCard from '../../components/admin/AdminApprovalCard';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';

const Star = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { theatres, isLoading: isTheatreLoading, fetchTheatres } = useTheatreStore();
  const { bookings, isLoading: isBookingLoading, fetchBookings } = useBookingStore();
  const { movies, reviews, isLoading: isMovieLoading, fetchMovies } = useMovieStore();
  const [activeTab, setActiveTab] = useState('theatres');
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchTheatres();
    fetchBookings();
    fetchMovies();
    fetchPendingAdmins();
    fetchAllUsers();
  }, [isAuthenticated, user, navigate, fetchTheatres, fetchBookings, fetchMovies]);

  const fetchPendingAdmins = async () => {
    setIsLoadingAdmins(true);
    try {
      console.log('Fetching pending admins...');
      
      const response = await adminAPI.getPendingAdmins();
      
      console.log('Pending admins response:', response);
      setPendingAdmins(response.pendingAdmins || []);
    } catch (error) {
      console.error('Failed to fetch pending admins:', error);
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      console.log('Fetching all users...');
      
      const response = await adminAPI.getAllUsers();
      
      console.log('All users response:', response);
      setAllUsers(response.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const isLoading = isTheatreLoading || isBookingLoading || isMovieLoading || isLoadingAdmins;
  const pendingTheatres = theatres.filter(t => !t.approved);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size={36} />
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Theatres</p>
                <h3 className="mt-1 text-3xl font-semibold">{theatres.length}</h3>
              </div>
              <Building2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="text-success-500">{theatres.filter(t => t.approved).length} approved</span> •{' '}
              <span className="text-accent-500">{pendingTheatres.length} pending</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Movies</p>
                <h3 className="mt-1 text-3xl font-semibold">{movies.length}</h3>
              </div>
              <Film className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="text-success-500">
                {movies.reduce((sum, m) => sum + reviews.filter(r => r.movieId === m.id).length, 0)} reviews
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Users</p>
                <h3 className="mt-1 text-3xl font-semibold">{allUsers.length}</h3>
              </div>
              <Users className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {allUsers.filter(u => u.role === 'admin').length} admins, {allUsers.filter(u => u.role === 'owner').length} owners, {allUsers.filter(u => u.role === 'user').length} users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Bookings</p>
                <h3 className="mt-1 text-3xl font-semibold">{bookings.length}</h3>
              </div>
              <TicketCheck className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="text-success-500">{bookings.filter(b => b.status === 'confirmed').length} active</span> •{' '}
              <span className="text-danger-500">{bookings.filter(b => b.status === 'cancelled').length} cancelled</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Admins</p>
                <h3 className="mt-1 text-3xl font-semibold">{pendingAdmins.length}</h3>
              </div>
              <UserCheck className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('admins')}
            className={`inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'admins'
                ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Admin Approvals ({pendingAdmins.length})
          </button>

          <button
            onClick={() => setActiveTab('theatres')}
            className={`inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'theatres'
                ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Building2 className="mr-2 h-4 w-4" />
            Theatre Approvals ({pendingTheatres.length})
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
            Booking Details
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
              activeTab === 'reviews'
                ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Star className="mr-2 h-4 w-4" />
            Manage Reviews
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'admins' && (
          <>
            <h2 className="mb-6 text-2xl font-semibold">Admin Approval Requests</h2>
            {pendingAdmins.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-slate-600 dark:text-slate-400">No pending admin requests.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingAdmins.map(admin => (
                  <AdminApprovalCard 
                    key={admin._id} 
                    admin={admin} 
                    onUpdate={fetchPendingAdmins}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'theatres' && (
          <>
            <h2 className="mb-6 text-2xl font-semibold">Theatres Pending Approval</h2>
            {pendingTheatres.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-slate-600 dark:text-slate-400">No theatres pending approval.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingTheatres.map(theatre => (
                  <TheatreApprovalCard 
                    key={theatre.id} 
                    theatre={theatre} 
                    onUpdate={fetchTheatres}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'bookings' && (
          <>
            <h2 className="mb-6 text-2xl font-semibold">All Booking Details</h2>
            <Card>
              <CardContent className="p-0">
                <BookingDetailsTable bookings={bookings} />
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'reviews' && (
          <>
            <h2 className="mb-6 text-2xl font-semibold">Manage Reviews</h2>
            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <th className="p-3 text-left text-sm font-medium text-slate-600 dark:text-slate-400">Movie</th>
                        <th className="p-3 text-left text-sm font-medium text-slate-600 dark:text-slate-400">Rating</th>
                        <th className="p-3 text-left text-sm font-medium text-slate-600 dark:text-slate-400">Review</th>
                        <th className="p-3 text-left text-sm font-medium text-slate-600 dark:text-slate-400">Date</th>
                        <th className="p-3 text-left text-sm font-medium text-slate-600 dark:text-slate-400">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map(review => {
                        const movie = movies.find(m => m.id === review.movieId);
                        return (
                          <tr key={review.id} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900">
                            <td className="p-3 text-sm">{movie?.title || 'Unknown Movie'}</td>
                            <td className="p-3 text-sm">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={i < review.rating ? 'text-accent-500 fill-accent-500' : 'text-slate-300 dark:text-slate-700'}
                                  />
                                ))}
                              </div>
                            </td>
                            <td className="p-3 text-sm max-w-xs truncate">{review.comment}</td>
                            <td className="p-3 text-sm">{new Date(review.date).toLocaleDateString()}</td>
                            <td className="p-3 text-sm">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-danger-500 hover:bg-danger-50 hover:text-danger-600 dark:hover:bg-danger-950"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this review?')) {
                                    // delete review logic
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                      {reviews.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-slate-600 dark:text-slate-400">
                            No reviews found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;