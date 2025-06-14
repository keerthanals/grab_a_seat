import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import TheatresPage from './pages/TheatresPage';
import TheatreDetailPage from './pages/TheatreDetailPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import BookingsPage from './pages/BookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';

// Protected route component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { isAuthenticated, user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

// Role-based route component
const RoleBasedRoute = ({ element, adminElement, ownerElement }) => {
  const { isAuthenticated, user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  switch (user?.role) {
    case 'admin':
      return adminElement || <Navigate to="/admin" replace />;
    case 'owner':
      return ownerElement || <Navigate to="/owner" replace />;
    case 'user':
      return element || <Navigate to="/" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

function App() {
  const {
    initializeAuth,
    isInitialized,
    isAuthenticated,
    user,
  } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  if (!isInitialized) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/theatres" element={<TheatresPage />} />
          <Route path="/theatres/:id" element={<TheatreDetailPage />} />

          <Route
            path="/login"
            element={
              isAuthenticated ? (
                user?.role === 'admin' ? (
                  <Navigate to="/admin" replace />
                ) : user?.role === 'owner' ? (
                  <Navigate to="/owner" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <LoginPage />
              )
            }
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? (
                user?.role === 'admin' ? (
                  <Navigate to="/admin" replace />
                ) : user?.role === 'owner' ? (
                  <Navigate to="/owner" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <RegisterPage />
              )
            } 
          />

          {/* Booking routes for user only */}
          <Route
            path="/booking/:id"
            element={
              <RoleBasedRoute
                element={<BookingPage />}
                adminElement={<Navigate to="/admin" replace />}
                ownerElement={<Navigate to="/owner" replace />}
              />
            }
          />
          <Route
            path="/booking/confirmation"
            element={
              <RoleBasedRoute
                element={<BookingConfirmationPage />}
                adminElement={<Navigate to="/admin" replace />}
                ownerElement={<Navigate to="/owner" replace />}
              />
            }
          />
          <Route
            path="/bookings"
            element={
              <RoleBasedRoute
                element={<BookingsPage />}
                adminElement={<Navigate to="/admin" replace />}
                ownerElement={<Navigate to="/owner" replace />}
              />
            }
          />

          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={<AdminDashboardPage />}
                allowedRoles={['admin']}
              />
            }
          />

          {/* Owner Route */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute
                element={<OwnerDashboardPage />}
                allowedRoles={['owner']}
              />
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;