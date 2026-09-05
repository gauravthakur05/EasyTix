import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchEventById, fetchSeatMap } from "../api/endpoints";
import SeatMap from "../components/SeatMap";
import { formatCurrency, formatDate } from "../utils/format";

const MAX_SEATS = 8;

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([fetchEventById(id), fetchSeatMap(id)])
      .then(([eventRes, seatRes]) => {
        setEvent(eventRes.data.event);
        setSeats(seatRes.data.seats);
      })
      .catch(() => toast.error("Could not load seat map."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleSeat = (seatId) => {
    setSelected((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      toast.error("Select at least one seat.");
      return;
    }
    navigate(`/events/${id}/checkout`, { state: { seats: selected } });
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading seat map...</div>;
  if (!event) return <div className="p-10 text-center text-red-600">Event not found.</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to={`/events/${id}`} className="text-sm font-medium text-brand-600 hover:underline">
        ← Back to event
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold text-slate-900">{event.name}</h1>
      <p className="text-sm text-slate-500">
        {formatDate(event.date)} · {event.venue}, {event.city}
      </p>

      <div className="mt-6">
        <SeatMap seats={seats} selectedSeats={selected} onToggleSeat={toggleSeat} maxSelectable={MAX_SEATS} />
      </div>

      <div className="sticky bottom-4 mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:flex-row">
        <div>
          <p className="text-sm text-slate-500">
            {selected.length} seat{selected.length !== 1 ? "s" : ""} selected{" "}
            {selected.length > 0 && `(${selected.join(", ")})`}
          </p>
          <p className="text-lg font-extrabold text-brand-700">
            {formatCurrency(event.price * selected.length)}
          </p>
        </div>
        <button
          onClick={handleContinue}
          className="w-full rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow hover:bg-brand-700 sm:w-auto"
        >
          Continue to Checkout
        </button>
      </div>
    </div>
  );
}
