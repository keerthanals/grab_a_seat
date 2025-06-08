import React from 'react';
import { Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="mx-auto max-w-screen-lg px-4 py-16">
      <div className="mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <Film className="h-8 w-8 text-accent-500" />
          <span className="text-2xl font-bold text-primary-950 dark:text-white">GRAB A SEAT</span>
        </Link>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
