import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "../../api/endpoints";
import { formatDate, formatCurrency } from "../../utils/format";

const emptyForm = {
  name: "",
  description: "",
  category: "Music",
  city: "",
  venue: "",
  date: "",
  time: "",
  image: "",
  price: "",
  rows: "A,B,C",
  seatsPerRow: 5,
};

const categories = ["Music", "Sports", "Theatre", "Comedy", "Conference", "Workshop", "Other"];

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    fetchEvents({})
      .then(({ data }) => setEvents(data.events))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (event) => {
    setEditingId(event._id);
    setForm({
      ...emptyForm,
      name: event.name,
      description: event.description,
      category: event.category,
      city: event.city,
      venue: event.venue,
      date: event.date.slice(0, 10),
      time: event.time,
      image: event.image || "",
      price: event.price,
    });
    setShowForm(true);
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        const { rows, seatsPerRow, ...editable } = form;
        await updateEvent(editingId, { ...editable, price: Number(form.price) });
        toast.success("Event updated.");
      } else {
        const payload = {
          ...form,
          price: Number(form.price),
          rows: form.rows.split(",").map((r) => r.trim().toUpperCase()).filter(Boolean),
          seatsPerRow: Number(form.seatsPerRow),
        };
        await createEvent(payload);
        toast.success("Event created.");
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save event.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? This also removes its bookings.")) return;
    try {
      await deleteEvent(id);
      toast.success("Event deleted.");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete event.");
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Events ({events.length})</h2>
        <button
          onClick={openCreate}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + New Event
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Seats</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((event) => (
                <tr key={event._id}>
                  <td className="px-4 py-3 font-medium text-slate-800">{event.name}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(event.date)}</td>
                  <td className="px-4 py-3 text-slate-500">{formatCurrency(event.price)}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {event.availableSeats}/{event.totalSeats}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(event)} className="mr-3 font-semibold text-brand-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(event._id)} className="font-semibold text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">{editingId ? "Edit Event" : "Create Event"}</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Event name"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
              <textarea
                name="description"
                required
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
              </div>
              <input
                name="venue"
                required
                value={form.venue}
                onChange={handleChange}
                placeholder="Venue"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  name="date"
                  required
                  value={form.date}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
                <input
                  type="time"
                  name="time"
                  required
                  value={form.time}
                  onChange={handleChange}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
              </div>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                name="price"
                required
                value={form.price}
                onChange={handleChange}
                placeholder="Ticket price"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />

              {!editingId && (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="rows"
                    value={form.rows}
                    onChange={handleChange}
                    placeholder="Rows e.g. A,B,C"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                  />
                  <input
                    type="number"
                    min="1"
                    name="seatsPerRow"
                    value={form.seatsPerRow}
                    onChange={handleChange}
                    placeholder="Seats per row"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
