import React, { useState, useEffect } from 'react';
import { useBookingStore } from '../../stores/bookingStore';
import { formatCurrency } from '../../utils/helpers';
import Button from '../ui/Button';

const SeatSelector = ({ showtime, seatLayout, existingBookings }) => {
  const { selectedSeats, selectSeat, deselectSeat } = useBookingStore();
  const [bookedSeats, setBookedSeats] = useState([]);

  // Extract all confirmed booked seats for the current showtime
  useEffect(() => {
    const seats = existingBookings
      .filter(
        (booking) => booking.showtimeId === showtime.id && booking.status === 'confirmed'
      )
      .flatMap((booking) => booking.seats);
    setBookedSeats(seats);
  }, [existingBookings, showtime.id]);

  const handleSeatClick = (seatId, type) => {
    if (type === 'unavailable' || bookedSeats.includes(seatId)) {
      return;
    }
    if (selectedSeats.includes(seatId)) {
      deselectSeat(seatId);
    } else {
      selectSeat(seatId);
    }
  };

  // Handle keyboard interaction for accessibility
  const handleKeyDown = (e, seatId, type) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSeatClick(seatId, type);
    }
  };

  // Calculate total price based on selected seats
  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const type = seatLayout.seatMap[seatId];
      return total + (type === 'premium' ? showtime.price.premium : showtime.price.regular);
    }, 0);
  };

  const renderSeats = () => {
    const rows = [];

    for (let row = 0; row < seatLayout.rows; row++) {
      const rowLabel = String.fromCharCode(65 + row);
      const cols = [];

      // Row label (e.g., A, B, C)
      cols.push(
        <div
          key={`label-${rowLabel}`}
          className="flex h-8 w-8 items-center justify-center text-sm font-medium"
        >
          {rowLabel}
        </div>
      );

      for (let col = 0; col < seatLayout.columns; col++) {
        const seatId = `${rowLabel}${col + 1}`;
        const seatType = seatLayout.seatMap[seatId];
        const isSelected = selectedSeats.includes(seatId);
        const isBooked = bookedSeats.includes(seatId);

        cols.push(
          <div
            key={seatId}
            className={`seat
              ${isSelected ? 'seat-selected' : ''}
              ${isBooked || seatType === 'unavailable' ? 'seat-unavailable' : ''}
              ${seatType === 'premium' ? 'border-accent-400 dark:border-accent-700' : ''}
            `}
            onClick={() => handleSeatClick(seatId, seatType)}
            onKeyDown={(e) => handleKeyDown(e, seatId, seatType)}
            aria-label={`Seat ${seatId}`}
            role="button"
            tabIndex={0}
          >
            <span className="sr-only">
              Seat {seatId}, {seatType}, {isBooked ? 'unavailable' : 'available'}
            </span>
          </div>
        );
      }
      rows.push(
        <div key={`row-${rowLabel}`} className="mb-2 flex items-center gap-1">
          {cols}
        </div>
      );
    }

    return rows;
  };

  return (
    <div>
      <div className="mb-8">
        <h3 className="mb-4 text-center text-lg font-semibold">Select Your Seats</h3>
        <div className="mx-auto mb-4 flex max-w-xs justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="seat h-5 w-5" />
            <span>Regular</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="seat h-5 w-5 border-accent-400 dark:border-accent-700" />
            <span>Premium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="seat seat-unavailable h-5 w-5" />
            <span>Unavailable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="seat seat-selected h-5 w-5" />
            <span>Selected</span>
          </div>
        </div>

        <div className="screen mx-auto mb-8 w-4/5 text-center text-xs text-slate-600 after:content-['SCREEN'] dark:text-slate-400" />

        <div className="mx-auto flex justify-center overflow-x-auto pb-4">
          <div className="space-y-1">{renderSeats()}</div>
        </div>
      </div>

      <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
        <div className="mb-4 flex flex-wrap gap-2">
          <h4 className="text-sm font-medium">Selected Seats:</h4>
          {selectedSeats.length > 0 ? (
            selectedSeats.map((seat) => (
              <span
                key={seat}
                className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-sm font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"
              >
                {seat}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-600 dark:text-slate-400">No seats selected</span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-300 pt-4 dark:border-slate-700">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
            </p>
            <p className="text-lg font-semibold">Total: {formatCurrency(calculateTotal())}</p>
          </div>
          <Button variant="primary" disabled={selectedSeats.length === 0}>
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
