import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchEvents } from "../api/endpoints";
import EventCard from "../components/EventCard";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents({ sort: "date_asc" })
      .then(({ data }) => setEvents(data.events.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/events${search ? `?search=${encodeURIComponent(search)}` : ""}`);
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Book in minutes
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              Find. Book. Attend.
              <br /> Live events made easy.
            </h1>
            <p className="mt-4 text-brand-100 sm:text-lg">
              Browse concerts, sports, theatre, and more. Pick your seats, pay securely (test mode),
              and get an instant QR ticket.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex max-w-lg gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, venues, cities..."
                className="w-full rounded-xl border-0 px-4 py-3 text-slate-900 shadow-lg outline-none ring-2 ring-transparent focus:ring-accent-500"
              />
              <button
                type="submit"
                className="rounded-xl bg-accent-500 px-6 py-3 font-semibold text-white shadow-lg hover:bg-accent-600"
              >
                Search
              </button>
            </form>
          </div>
        </div>
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Upcoming Events</h2>
          <Link to="/events" className="text-sm font-semibold text-brand-600 hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-slate-500">No events available yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { icon: "🔍", title: "Discover", text: "Search and filter events by category, city, and date." },
            { icon: "💺", title: "Pick Seats", text: "Choose your exact seats from a live seat map." },
            { icon: "🎟️", title: "Get Your Ticket", text: "Pay securely and receive an instant QR ticket." },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
