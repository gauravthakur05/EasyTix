import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchBookingById } from "../api/endpoints";
import { formatCurrency, formatDate, formatTime } from "../utils/format";

export default function Ticket() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingById(id)
      .then(({ data }) => setBooking(data.booking))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10 text-center text-slate-500">Loading ticket...</div>;
  if (!booking) return <div className="p-10 text-center text-red-600">Ticket not found.</div>;

  const { event } = booking;
  const cancelled = booking.status === "CANCELLED";

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <Link to="/my-bookings" className="text-sm font-medium text-brand-600 hover:underline">
        ← Back to my bookings
      </Link>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        <div className="bg-gradient-to-r from-brand-600 to-indigo-600 p-5 text-white">
          <p className="text-xs uppercase tracking-wide text-brand-100">E-Ticket</p>
          <h1 className="text-xl font-extrabold">{event.name}</h1>
          <p className="text-sm text-brand-100">
            {formatDate(event.date)} · {formatTime(event.time)}
          </p>
        </div>

        <div className="border-b border-dashed border-slate-300 p-6 text-center">
          {cancelled ? (
            <div className="grid h-56 place-items-center rounded-xl bg-red-50 text-red-600">
              <div>
                <p className="text-4xl">✕</p>
                <p className="mt-2 font-semibold">Ticket Cancelled</p>
              </div>
            </div>
          ) : (
            <img src={booking.qrCode} alt="QR Ticket" className="mx-auto h-56 w-56 rounded-xl border border-slate-200 p-2" />
          )}
          <p className="mt-3 text-xs text-slate-400">Show this QR code at the venue entrance</p>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6 text-sm">
          <div>
            <p className="text-slate-400">Booking Ref</p>
            <p className="font-semibold text-slate-800">{booking.bookingRef}</p>
          </div>
          <div>
            <p className="text-slate-400">Status</p>
            <p
              className={`font-semibold ${
                cancelled ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {booking.status}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Seats</p>
            <p className="font-semibold text-slate-800">{booking.seats.join(", ")}</p>
          </div>
          <div>
            <p className="text-slate-400">Venue</p>
            <p className="font-semibold text-slate-800">
              {event.venue}, {event.city}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Amount Paid</p>
            <p className="font-semibold text-slate-800">{formatCurrency(booking.totalAmount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
