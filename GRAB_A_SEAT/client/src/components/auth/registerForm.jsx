import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '../ui/Card';

const RegisterForm = () => {
  const { register: registerUser, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    const success = await registerUser(data.name, data.email, data.password, data.role);
    if (success) {
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'owner') navigate('/owner');
      else navigate('/');
    }
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Enter your details to register</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              id="name"
              label="Full Name"
              leftIcon={<User size={16} />}
              error={errors.name?.message}
              placeholder="John Doe"
              {...register('name', { required: 'Name is required' })}
            />
          </div>

          <div>
            <Input
              id="email"
              type="email"
              label="Email"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
          </div>

          <div>
            <Input
              id="password"
              type="password"
              label="Password"
              leftIcon={<Lock size={16} />}
              error={errors.password?.message}
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
          </div>

          <div>
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              leftIcon={<Lock size={16} />}
              error={errors.confirmPassword?.message}
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Register as
            </label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="w-full rounded border border-slate-300 p-2 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Select role</option>
              <option value="user">User</option>
              <option value="owner">Theatre Owner</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-danger-50 p-3 text-sm text-danger-500 dark:bg-danger-950 dark:text-danger-400">
              {error}
            </div>
          )}

          <div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Sign in
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
