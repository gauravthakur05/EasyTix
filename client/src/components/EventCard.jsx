import { Link } from "react-router-dom";
import { formatDate, formatCurrency, categoryColors } from "../utils/format";

export default function EventCard({ event }) {
  const soldOut = event.availableSeats === 0;

  return (
    <Link
      to={`/events/${event._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        {event.image ? (
          <img
            src={event.image}
            alt={event.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-4xl">🎫</div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            categoryColors[event.category] || categoryColors.Other
          }`}
        >
          {event.category}
        </span>
        {soldOut && (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
            Sold Out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-lg font-bold text-slate-900">{event.name}</h3>
        <p className="flex items-center gap-1 text-sm text-slate-500">
          📍 {event.venue}, {event.city}
        </p>
        <p className="flex items-center gap-1 text-sm text-slate-500">📅 {formatDate(event.date)}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-extrabold text-brand-700">{formatCurrency(event.price)}</span>
          <span className="text-xs font-medium text-slate-400">
            {event.availableSeats}/{event.totalSeats} seats left
          </span>
        </div>
      </div>
    </Link>
  );
}
