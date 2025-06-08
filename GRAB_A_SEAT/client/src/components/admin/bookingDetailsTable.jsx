import React from 'react';
import { useMovieStore } from '../../stores/movieStore';
import { useTheatreStore } from '../../stores/theatreStore';
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers';

const BookingDetailsTable = ({ bookings }) => {
  const { movies } = useMovieStore();
  const { showtimes, theatres } = useTheatreStore();

  if (bookings.length === 0) {
    return (
      <div className="py-8 text-center text-slate-600 dark:text-slate-400">
        <p>No bookings found.</p>
      </div>
    );
  }

  const getMovieTitle = (showtimeId) => {
    const showtime = showtimes.find((st) => st.id === showtimeId);
    if (!showtime) return 'Unknown Movie';
    const movie = movies.find((m) => m.id === showtime.movieId);
    return movie?.title || 'Unknown Movie';
  };

  const getTheatreName = (showtimeId) => {
    const showtime = showtimes.find((st) => st.id === showtimeId);
    if (!showtime) return 'Unknown Theatre';
    const theatre = theatres.find((t) => t.id === showtime.theatreId);
    return theatre?.name || 'Unknown Theatre';
  };

  const getShowtimeDetails = (showtimeId) => {
    const showtime = showtimes.find((st) => st.id === showtimeId);
    if (!showtime) return { date: 'Unknown', time: 'Unknown' };
    return {
      date: formatDate(showtime.date),
      time: formatTime(showtime.startTime),
    };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className="whitespace-nowrap border-b border-slate-200 p-3 text-left text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400">
              Booking ID
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 p-3 text-left text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400">
              Movie
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 p-3 text-left text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400">
              Theatre
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 p-3 text-left text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400">
              Date & Time
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 p-3 text-left text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400">
              Seats
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 p-3 text-left text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400">
              Amount
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 p-3 text-left text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const showtimeDetails = getShowtimeDetails(booking.showtimeId);
            const statusClass =
              booking.status === 'confirmed'
                ? 'bg-success-50 text-success-500 dark:bg-success-950 dark:text-success-300'
                : 'bg-danger-50 text-danger-500 dark:bg-danger-950 dark:text-danger-300';

            return (
              <tr
                key={booking.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <td className="whitespace-nowrap border-b border-slate-200 p-3 text-sm dark:border-slate-700">
                  {booking.id}
                </td>
                <td className="whitespace-nowrap border-b border-slate-200 p-3 text-sm dark:border-slate-700">
                  {getMovieTitle(booking.showtimeId)}
                </td>
                <td className="whitespace-nowrap border-b border-slate-200 p-3 text-sm dark:border-slate-700">
                  {getTheatreName(booking.showtimeId)}
                </td>
                <td className="whitespace-nowrap border-b border-slate-200 p-3 text-sm dark:border-slate-700">
                  {showtimeDetails.date} at {showtimeDetails.time}
                </td>
                <td className="whitespace-nowrap border-b border-slate-200 p-3 text-sm dark:border-slate-700">
                  {booking.seats.join(', ')}
                </td>
                <td className="whitespace-nowrap border-b border-slate-200 p-3 text-sm dark:border-slate-700">
                  {formatCurrency(booking.totalAmount)}
                </td>
                <td className="whitespace-nowrap border-b border-slate-200 p-3 text-sm dark:border-slate-700">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusClass}`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookingDetailsTable;
