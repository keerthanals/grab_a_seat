import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserCheck } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/Card';

const roleOptions = [
  { value: 'user', label: 'User - Book tickets and watch movies' },
  { value: 'owner', label: 'Theatre Owner - Manage theatres and shows' },
  { value: 'admin', label: 'Admin - Manage the entire platform' },
];

const RegisterForm = () => {
  const { register: registerUser, error, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
    },
  });
  
  const password = watch('password');
  
  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data.name, data.email, data.password, data.role);
      
      // Redirect based on user role
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else if (response.user.role === 'owner') {
        navigate('/owner');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Enter your details to register
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              id="name"
              label="Full Name"
              leftIcon={<User size={16} />}
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
              })}
              placeholder="John Doe"
            />
          </div>
          
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
            <Select
              id="role"
              label="Account Type"
              options={roleOptions}
              error={errors.role?.message}
              {...register('role', {
                required: 'Role is required',
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
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              leftIcon={<Lock size={16} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
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