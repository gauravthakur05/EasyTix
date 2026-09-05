import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchBookingById } from "../api/endpoints";
import { formatCurrency, formatDate, formatTime } from "../utils/format";

export default function BookingSuccess() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingById(id)
      .then(({ data }) => setBooking(data.booking))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10 text-center text-slate-500">Loading confirmation...</div>;
  if (!booking) return <div className="p-10 text-center text-red-600">Booking not found.</div>;

  const { event } = booking;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl">✅</div>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Booking Confirmed!</h1>
      <p className="mt-1 text-slate-500">Your ticket has been booked successfully. Reference: {booking.bookingRef}</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">{event.name}</h2>
        <p className="text-sm text-slate-500">
          {formatDate(event.date)} at {formatTime(event.time)} · {event.venue}, {event.city}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-400">Seats</p>
            <p className="font-semibold text-slate-800">{booking.seats.join(", ")}</p>
          </div>
          <div>
            <p className="text-slate-400">Total Paid</p>
            <p className="font-semibold text-slate-800">{formatCurrency(booking.totalAmount)}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to={`/tickets/${booking._id}`}
          className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow hover:bg-brand-700"
        >
          View QR Ticket
        </Link>
        <Link
          to="/my-bookings"
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Go to My Bookings
        </Link>
      </div>
    </div>
  );
}
