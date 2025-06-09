import React from 'react';
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
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
      const theatreData = {
        name: data.name,
        location: data.location,
        screenCount: data.screenCount,
      };
      
      await addTheatre(theatreData);
      
      toast.success('Theatre request submitted for approval!');
      reset();
    } catch (error) {
      toast.error(error.message || 'Failed to create theatre');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Theatre</CardTitle>
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
              })}
              placeholder="123 Main St, City"
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
              })}
              min={1}
              max={10}
            />
          </div>
          
          <div>
            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
            >
              Create Theatre
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TheatreForm;