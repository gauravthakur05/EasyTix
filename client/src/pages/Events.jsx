import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchEvents, fetchEventFilters } from "../api/endpoints";
import EventCard from "../components/EventCard";

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({ cities: [], categories: [] });

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const city = searchParams.get("city") || "All";
  const sort = searchParams.get("sort") || "date_asc";

  useEffect(() => {
    fetchEventFilters().then(({ data }) => setFilterOptions(data)).catch(() => {});
  }, []);

  const loadEvents = useCallback(() => {
    setLoading(true);
    fetchEvents({ search, category, city, sort })
      .then(({ data }) => setEvents(data.events))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, city, sort]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "All") next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold text-slate-900">Browse Events</h1>
      <p className="mt-1 text-slate-500">Find something happening near you.</p>

      <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
        <input
          value={search}
          onChange={(e) => updateParam("search", e.target.value)}
          placeholder="Search events..."
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 sm:col-span-2"
        />
        <select
          value={category}
          onChange={(e) => updateParam("category", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        >
          <option value="All">All Categories</option>
          {filterOptions.categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={city}
          onChange={(e) => updateParam("city", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        >
          <option value="All">All Cities</option>
          {filterOptions.cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 sm:col-span-4"
        >
          <option value="date_asc">Date: Soonest first</option>
          <option value="date_desc">Date: Latest first</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
            No events match your filters. Try adjusting your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
