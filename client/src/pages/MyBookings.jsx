import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchMyBookings, cancelBooking } from "../api/endpoints";
import { formatCurrency, formatDate, formatTime } from "../utils/format";

const statusStyles = {
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
  PENDING: "bg-amber-100 text-amber-700",
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const load = () => {
    setLoading(true);
    fetchMyBookings()
      .then(({ data }) => setBookings(data.bookings))
      .catch(() => toast.error("Could not load bookings."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking? Seats will be released and payment refunded (simulated).")) return;
    setCancellingId(id);
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled and refunded.");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-extrabold text-slate-900">My Bookings</h1>
      <p className="mt-1 text-slate-500">Your ticket history and QR tickets.</p>

      {loading ? (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
          No bookings yet.{" "}
          <Link to="/events" className="font-semibold text-brand-600 hover:underline">
            Browse events →
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">{b.event?.name || "Event removed"}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[b.status]}`}>
                    {b.status}
                  </span>
                </div>
                {b.event && (
                  <p className="text-sm text-slate-500">
                    {formatDate(b.event.date)} · {formatTime(b.event.time)} · {b.event.venue}, {b.event.city}
                  </p>
                )}
                <p className="mt-1 text-sm text-slate-600">
                  Seats: <span className="font-medium">{b.seats.join(", ")}</span> · Ref: {b.bookingRef}
                </p>
                <p className="text-sm font-semibold text-slate-800">{formatCurrency(b.totalAmount)}</p>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/tickets/${b._id}`}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View Ticket
                </Link>
                {b.status === "CONFIRMED" && (
                  <button
                    onClick={() => handleCancel(b._id)}
                    disabled={cancellingId === b._id}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    {cancellingId === b._id ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
