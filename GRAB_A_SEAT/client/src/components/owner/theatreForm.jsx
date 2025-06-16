import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../stores/authStore';
import { useTheatreStore } from '../../stores/theatreStore';
import { ownerAPI } from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { toast } from 'sonner';

const TheatreForm = () => {
  const { user } = useAuthStore();
  const { addTheatre } = useTheatreStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      location: '',
      screenCount: 1,
    },
  });
  
  const onSubmit = async (data) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      const theatreData = {
        name: data.name,
        location: data.location,
        screenCount: parseInt(data.screenCount),
      };
      
      await addTheatre(theatreData);
      
      setShowSuccessMessage(true);
      reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      
    } catch (error) {
      toast.error(error.message || 'Failed to create theatre');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccessMessage) {
    return (
      <Card className="border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-950">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-success-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-success-800 dark:text-success-200">
            Theatre Request Submitted Successfully!
          </h3>
          <p className="mb-4 text-success-700 dark:text-success-300">
            Your theatre creation request has been submitted to the admin for approval. 
            Once approved, you'll be able to add movies and create showtimes for your theatre.
          </p>
          <p className="text-sm text-success-600 dark:text-success-400">
            You will be notified once the admin reviews your request. This usually takes 1-2 business days.
          </p>
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowSuccessMessage(false)}
              className="border-success-500 text-success-700 hover:bg-success-100 dark:border-success-400 dark:text-success-300 dark:hover:bg-success-900"
            >
              Create Another Theatre
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Theatre</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Submit your theatre for admin approval. Once approved, you can add movies and showtimes.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              id="name"
              label="Theatre Name"
              error={errors.name?.message}
              {...register('name', {
                required: 'Theatre name is required',
                minLength: {
                  value: 3,
                  message: 'Theatre name must be at least 3 characters',
                },
              })}
              placeholder="CineWorld"
            />
          </div>
          
          <div>
            <Input
              id="location"
              label="Theatre Location"
              error={errors.location?.message}
              {...register('location', {
                required: 'Location is required',
                minLength: {
                  value: 5,
                  message: 'Location must be at least 5 characters',
                },
              })}
              placeholder="123 Main St, City, State"
            />
          </div>
          
          <div>
            <Input
              id="screenCount"
              type="number"
              label="Number of Screens"
              error={errors.screenCount?.message}
              {...register('screenCount', {
                required: 'Number of screens is required',
                min: {
                  value: 1,
                  message: 'At least one screen is required',
                },
                max: {
                  value: 10,
                  message: 'Maximum 10 screens allowed',
                },
                valueAsNumber: true,
              })}
              min={1}
              max={10}
            />
          </div>
          
          <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-950">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Approval Process
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>
                    After submitting your theatre, an admin will review and approve it. 
                    Once approved, you can add movies and create showtimes.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting Request...' : 'Submit Theatre for Approval'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TheatreForm;