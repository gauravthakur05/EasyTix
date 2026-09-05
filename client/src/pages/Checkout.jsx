import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchEventById, checkoutBooking } from "../api/endpoints";
import { formatCurrency, formatDate } from "../utils/format";

export default function Checkout() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const seats = location.state?.seats || [];

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [card, setCard] = useState({ name: "", number: "4242 4242 4242 4242", expiry: "12/29", cvv: "123" });

  useEffect(() => {
    if (seats.length === 0) {
      navigate(`/events/${id}/seats`, { replace: true });
      return;
    }
    fetchEventById(id)
      .then(({ data }) => setEvent(data.event))
      .catch(() => toast.error("Could not load event."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => setCard((c) => ({ ...c, [e.target.name]: e.target.value }));

  const handlePay = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await checkoutBooking({ eventId: id, seatIds: seats, card });
      toast.success("Payment successful! Ticket booked.");
      navigate(`/booking-success/${data.booking._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading checkout...</div>;
  if (!event) return null;

  const total = event.price * seats.length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link to={`/events/${id}/seats`} className="text-sm font-medium text-brand-600 hover:underline">
        ← Back to seat selection
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold text-slate-900">Checkout</h1>

      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-5">
        <form onSubmit={handlePay} className="sm:col-span-3 space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
            🧪 Test mode — no real card is charged. Use <b>4242 4242 4242 4242</b> for success or a card ending
            in <b>0002</b> to simulate a decline.
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Cardholder Name</label>
            <input
              name="name"
              required
              value={card.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Card Number</label>
            <input
              name="number"
              required
              value={card.number}
              onChange={handleChange}
              placeholder="4242 4242 4242 4242"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Expiry</label>
              <input
                name="expiry"
                required
                value={card.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">CVV</label>
              <input
                name="cvv"
                required
                value={card.cvv}
                onChange={handleChange}
                placeholder="123"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-xl bg-brand-600 py-3 font-semibold text-white shadow hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? "Processing payment..." : `Pay ${formatCurrency(total)}`}
          </button>
        </form>

        <div className="sm:col-span-2 h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-900">Order Summary</h2>
          <p className="mt-3 text-sm font-semibold text-slate-800">{event.name}</p>
          <p className="text-xs text-slate-500">
            {formatDate(event.date)} · {event.venue}, {event.city}
          </p>
          <div className="mt-4 space-y-1 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Seats</span>
              <span className="font-medium">{seats.join(", ")}</span>
            </div>
            <div className="flex justify-between">
              <span>Price / ticket</span>
              <span className="font-medium">{formatCurrency(event.price)}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity</span>
              <span className="font-medium">{seats.length}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-base font-bold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
