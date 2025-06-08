import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, User, LogIn, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import Button from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Dark mode state, sync with localStorage or your preferred method
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  // Apply dark mode class on <html> or <body>
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/';
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'owner':
        return '/owner';
      default:
        return '/profile';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/90">
      <div className="container-custom mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-primary-950 dark:text-white">
            <Film className="h-6 w-6 text-accent-500" />
            <span className="text-xl font-bold">GRAB A SEAT</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/movies" className="text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400">
            Movies
          </Link>
          <Link to="/theatres" className="text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400">
            Theatres
          </Link>
          {isAuthenticated && (
            <Link to="/bookings" className="text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400">
              My Bookings
            </Link>
          )}

          {/* Dark Mode Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Dark Mode"
            className="flex items-center gap-1 rounded px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{darkMode ? 'Light' : 'Dark'}</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to={getDashboardLink()}
                className="flex items-center gap-2 text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400"
              >
                <User size={16} />
                {user?.name}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} leftIcon={<LogOut size={16} />}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                leftIcon={<LogIn size={16} />}
              >
                Login
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </div>
          )}
        </nav>

        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-white dark:bg-slate-950 md:hidden">
          <nav className="container-custom flex flex-col gap-4 p-4">
            <Link
              to="/movies"
              className="py-2 text-lg font-medium hover:text-primary-600 dark:hover:text-primary-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Movies
            </Link>
            <Link
              to="/theatres"
              className="py-2 text-lg font-medium hover:text-primary-600 dark:hover:text-primary-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Theatres
            </Link>
            {isAuthenticated && (
              <Link
                to="/bookings"
                className="py-2 text-lg font-medium hover:text-primary-600 dark:hover:text-primary-400"
                onClick={() => setIsMenuOpen(false)}
              >
                My Bookings
              </Link>
            )}

            {/* Dark Mode Toggle Button for Mobile */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle Dark Mode"
              className="mt-4 flex items-center gap-2 rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <Link
                    to={getDashboardLink()}
                    className="flex items-center gap-2 py-2 text-lg font-medium hover:text-primary-600 dark:hover:text-primary-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={20} />
                    {user?.name}
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    leftIcon={<LogOut size={20} />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    leftIcon={<LogIn size={20} />}
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      navigate('/register');
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
