export const formatDate = (dateString) => {
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
};

export const formatTime = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${m} ${period}`;
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

export const categoryColors = {
  Music: "bg-pink-100 text-pink-700",
  Sports: "bg-emerald-100 text-emerald-700",
  Theatre: "bg-purple-100 text-purple-700",
  Comedy: "bg-amber-100 text-amber-700",
  Conference: "bg-blue-100 text-blue-700",
  Workshop: "bg-teal-100 text-teal-700",
  Other: "bg-slate-100 text-slate-700",
};
