import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/Card';

const LoginForm = () => {
  const { login, error, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const onSubmit = async (data) => {
    try {
      const response = await login(data.email, data.password);
      
      // Redirect based on user role
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else if (response.user.role === 'owner') {
        navigate('/owner');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              id="email"
              type="email"
              label="Email"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <Input
              id="password"
              type="password"
              label="Password"
              leftIcon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <div className="rounded-md bg-danger-50 p-3 text-sm text-danger-500 dark:bg-danger-950 dark:text-danger-400">
              {error}
            </div>
          )}
          
          <div>
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </div>
          
          
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Sign up
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;