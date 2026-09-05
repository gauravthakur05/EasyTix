import { useEffect, useState } from "react";
import { fetchAdminBookings } from "../../api/endpoints";
import { formatCurrency, formatDate } from "../../utils/format";

const statusStyles = {
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
  PENDING: "bg-amber-100 text-amber-700",
};

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminBookings()
      .then(({ data }) => setBookings(data.bookings))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-slate-900">All Bookings ({bookings.length})</h2>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-slate-500">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Seats</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{b.bookingRef}</td>
                  <td className="px-4 py-3 text-slate-600">{b.event?.name || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {b.user?.name}
                    <br />
                    <span className="text-xs text-slate-400">{b.user?.email}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{b.seats.join(", ")}</td>
                  <td className="px-4 py-3 text-slate-600">{formatCurrency(b.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(b.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
