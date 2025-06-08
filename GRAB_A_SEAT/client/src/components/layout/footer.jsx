import React from 'react';
import { Film, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Film className="h-6 w-6 text-accent-500" />
              <span className="text-xl font-bold text-primary-950 dark:text-white">
                GRAB A SEAT
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your premier destination for booking movie tickets and sharing your movie experiences.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/movies"
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  to="/theatres"
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                >
                  Theatres
                </Link>
              </li>
              <li>
                <Link
                  to="/bookings"
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                >
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-slate-600 dark:text-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">
                  123 Cinema Street, Movie City
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-slate-600 dark:text-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-slate-600 dark:text-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">support@grabaseat.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-800">
          <p className="text-center text-xs text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} grabaseat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
