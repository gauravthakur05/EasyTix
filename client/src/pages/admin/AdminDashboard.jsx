import { useEffect, useState } from "react";
import { fetchAdminStats } from "../../api/endpoints";
import { formatCurrency } from "../../utils/format";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "bg-blue-50 text-blue-700" },
        { label: "Total Events", value: stats.totalEvents, icon: "🎫", color: "bg-purple-50 text-purple-700" },
        { label: "Total Bookings", value: stats.totalBookings, icon: "📋", color: "bg-emerald-50 text-emerald-700" },
        {
          label: "Simulated Revenue",
          value: formatCurrency(stats.totalRevenue),
          icon: "💰",
          color: "bg-amber-50 text-amber-700",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className={`grid h-10 w-10 place-items-center rounded-xl text-lg ${c.color}`}>{c.icon}</div>
            <p className="mt-3 text-2xl font-extrabold text-slate-900">{c.value}</p>
            <p className="text-sm text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        <h2 className="mb-2 text-base font-bold text-slate-900">Quick Tips</h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Use <b>Manage Events</b> to create, edit, or delete events.</li>
          <li>Use <b>All Bookings</b> to review every booking made across the platform.</li>
          <li>Revenue only counts <b>CONFIRMED</b> bookings and excludes cancelled/refunded ones.</li>
        </ul>
      </div>
    </div>
  );
}
