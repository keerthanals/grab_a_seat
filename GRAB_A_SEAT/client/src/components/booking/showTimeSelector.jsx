import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers';
import { Card, CardContent, CardTitle } from '../ui/Card';

const ShowtimeSelector = ({ showtimes, theatres, movieId }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = React.useState('');

  // Get unique sorted dates for the selected movie
  const dates = React.useMemo(() => {
    const uniqueDates = new Set();
    showtimes
      .filter(showtime => showtime.movieId === movieId)
      .forEach(showtime => uniqueDates.add(showtime.date));
    return Array.from(uniqueDates).sort();
  }, [showtimes, movieId]);

  // Default select first available date
  React.useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0]);
    }
  }, [dates, selectedDate]);

  // Filter showtimes by selected movie and date
  const filteredShowtimes = React.useMemo(() => {
    return showtimes.filter(
      showtime => showtime.movieId === movieId && showtime.date === selectedDate
    );
  }, [showtimes, movieId, selectedDate]);

  // Group filtered showtimes by theatre
  const showtimesByTheatre = React.useMemo(() => {
    const grouped = {};
    filteredShowtimes.forEach(showtime => {
      if (!grouped[showtime.theatreId]) {
        grouped[showtime.theatreId] = [];
      }
      grouped[showtime.theatreId].push(showtime);
    });
    return grouped;
  }, [filteredShowtimes]);

  // Get theatre name from ID
  const getTheatreName = theatreId => {
    const theatre = theatres.find(t => t.id === theatreId);
    return theatre ? theatre.name : 'Unknown Theatre';
  };

  // Navigate to booking page on showtime click
  const handleBooking = showtimeId => {
    navigate(`/booking/${showtimeId}`);
  };

  // No showtimes available case
  if (dates.length === 0) {
    return (
      <div className="py-8 text-center text-slate-600 dark:text-slate-400">
        <p className="text-lg">No showtimes available for this movie.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div className="pb-4">
        <h3 className="mb-3 text-lg font-semibold">Select Date</h3>
        <div className="flex flex-wrap gap-2">
          {dates.map(date => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedDate === date
                  ? 'bg-primary-600 text-white dark:bg-primary-700'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700'
              }`}
            >
              <Calendar size={16} />
              {formatDate(date)}
            </button>
          ))}
        </div>
      </div>

      {/* Showtimes List */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Showtimes</h3>

        {Object.keys(showtimesByTheatre).length === 0 ? (
          <p className="py-4 text-center text-slate-600 dark:text-slate-400">
            No showtimes available for this date.
          </p>
        ) : (
          <div className="space-y-6">
            {Object.entries(showtimesByTheatre).map(([theatreId, theatreShowtimes]) => (
              <Card
                key={theatreId}
                className="overflow-hidden border border-slate-200 dark:border-slate-800"
              >
                <div className="bg-slate-50 px-6 py-3 dark:bg-slate-800">
                  <CardTitle className="text-lg">{getTheatreName(theatreId)}</CardTitle>
                </div>
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex flex-wrap gap-3">
                      {theatreShowtimes
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map(showtime => (
                          <button
                            key={showtime.id}
                            onClick={() => handleBooking(showtime.id)}
                            className="group relative flex flex-col items-center rounded-md border border-slate-300 p-3 transition-all hover:border-primary-500 hover:bg-primary-50 dark:border-slate-700 dark:hover:border-primary-600 dark:hover:bg-slate-800"
                          >
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span className="font-medium">{formatTime(showtime.startTime)}</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                              From {formatCurrency(showtime.price.regular)}
                            </p>
                            <div className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[8px] font-bold text-white group-hover:flex">
                              i
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowtimeSelector;
