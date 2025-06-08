import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardTitle } from '../ui/Card';
import Button from '../ui/Button';

const TheatreCard = ({ theatre, compact = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/theatres/${theatre.id}`);
  };

  if (compact) {
    return (
      <Card
        className="cursor-pointer transition-all hover:shadow-md"
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <CardTitle className="mb-1 text-base">{theatre.name}</CardTitle>
          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
            <MapPin size={14} />
            <span>{theatre.location}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border border-slate-200 transition-all hover:shadow-md dark:border-slate-800">
      <CardContent className="p-0">
        <div className="aspect-[4/1] bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-900 dark:to-primary-700">
          <div className="flex h-full items-center justify-center">
            <h3 className="text-2xl font-bold text-white">{theatre.name}</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center gap-1 text-slate-700 dark:text-slate-300">
            <MapPin size={18} />
            <span className="font-medium">{theatre.location}</span>
          </div>

          <div className="mb-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {theatre.screens.length} {theatre.screens.length === 1 ? 'Screen' : 'Screens'}
            </p>
          </div>

          <Button variant="primary" className="w-full" onClick={handleClick}>
            View Showtimes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TheatreCard;
