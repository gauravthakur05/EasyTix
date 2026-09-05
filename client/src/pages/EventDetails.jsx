import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchEventById } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatTime, formatCurrency, categoryColors } from "../utils/format";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventById(id)
      .then(({ data }) => setEvent(data.event))
      .catch(() => setError("Event not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      navigate("/login", { state: { from: `/events/${id}/seats` } });
      return;
    }
    navigate(`/events/${id}/seats`);
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading event...</div>;
  if (error || !event) return <div className="p-10 text-center text-red-600">{error}</div>;

  const soldOut = event.availableSeats === 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link to="/events" className="text-sm font-medium text-brand-600 hover:underline">
        ← Back to events
      </Link>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-64 w-full bg-slate-100 sm:h-80">
          {event.image ? (
            <img src={event.image} alt={event.name} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-6xl">🎫</div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 p-6 sm:grid-cols-3 sm:p-8">
          <div className="sm:col-span-2">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[event.category] || categoryColors.Other}`}>
              {event.category}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-900">{event.name}</h1>
            <p className="mt-3 whitespace-pre-line text-slate-600">{event.description}</p>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-slate-400">Venue</dt>
                <dd className="font-semibold text-slate-800">{event.venue}</dd>
              </div>
              <div>
                <dt className="text-slate-400">City</dt>
                <dd className="font-semibold text-slate-800">{event.city}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Date</dt>
                <dd className="font-semibold text-slate-800">{formatDate(event.date)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Time</dt>
                <dd className="font-semibold text-slate-800">{formatTime(event.time)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-400">Ticket Price</p>
            <p className="text-3xl font-extrabold text-brand-700">{formatCurrency(event.price)}</p>
            <p className="mt-2 text-sm text-slate-500">
              {event.availableSeats} of {event.totalSeats} seats available
            </p>
            <button
              onClick={handleBookNow}
              disabled={soldOut}
              className="mt-5 w-full rounded-xl bg-brand-600 py-3 font-semibold text-white shadow hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {soldOut ? "Sold Out" : "Select Seats"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
