import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../stores/authStore';
import { useTheatreStore } from '../../stores/theatreStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const TheatreForm = () => {
  const { user } = useAuthStore();
  const { addTheatre } = useTheatreStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      location: '',
      screenCount: 1
    }
  });

  const onSubmit = (data) => {
    if (!user) return;

    // Create screens based on count
    const screens = [];
    for (let i = 0; i < data.screenCount; i++) {
      screens.push({
        id: `screen-${Math.random().toString(36).substring(2, 9)}`,
        name: `Screen ${i + 1}`,
        theatreId: '',
        seatLayout: {
          rows: 8,
          columns: 10,
          seatMap: {}
        }
      });
    }

    // Create theatre
    addTheatre({
      name: data.name,
      location: data.location,
      ownerId: user.id,
      screens
    });

    reset();
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
              placeholder="CineWorld"
              error={errors.name?.message}
              {...register('name', { required: 'Theatre name is required' })}
            />
          </div>

          <div>
            <Input
              id="location"
              label="Theatre Location"
              placeholder="123 Main St, City"
              error={errors.location?.message}
              {...register('location', { required: 'Location is required' })}
            />
          </div>

          <div>
            <Input
              id="screenCount"
              type="number"
              label="Number of Screens"
              min={1}
              max={10}
              error={errors.screenCount?.message}
              {...register('screenCount', {
                required: 'Number of screens is required',
                min: { value: 1, message: 'At least one screen is required' },
                max: { value: 10, message: 'Maximum 10 screens allowed' }
              })}
            />
          </div>

          <div>
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Create Theatre
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TheatreForm;
