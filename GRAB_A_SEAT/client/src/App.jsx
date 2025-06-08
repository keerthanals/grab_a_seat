import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

import useDarkMode from './hooks/useDarkMode';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { isAuthenticated, user, isAuthLoaded } = useAuthStore();

  if (!isAuthLoaded) {
    return <div className="flex min-h-screen items-center justify-center text-white">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

function App() {
  const [darkMode] = useDarkMode();
  const { loadUserFromStorage, isAuthLoaded } = useAuthStore();

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  if (!isAuthLoaded) {
    return <div className="flex min-h-screen items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className={`flex min-h-screen flex-col ${darkMode ? 'dark' : ''}`}>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/theatres" element={<TheatresPage />} />
          <Route path="/theatres/:id" element={<TheatreDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/booking/:id" element={<ProtectedRoute element={<BookingPage />} />} />
          <Route path="/booking/confirmation" element={<ProtectedRoute element={<BookingConfirmationPage />} />} />
          <Route path="/bookings" element={<ProtectedRoute element={<BookingsPage />} />} />
          <Route path="/admin" element={<ProtectedRoute element={<AdminDashboardPage />} allowedRoles={['admin']} />} />
          <Route path="/owner" element={<ProtectedRoute element={<OwnerDashboardPage />} allowedRoles={['owner']} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
