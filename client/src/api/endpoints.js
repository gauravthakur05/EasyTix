import api from "./axios";

// Auth
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const fetchMe = () => api.get("/auth/me");

// Events
export const fetchEvents = (params) => api.get("/events", { params });
export const fetchEventFilters = () => api.get("/events/meta/filters");
export const fetchEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post("/events", data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Seats
export const fetchSeatMap = (eventId) => api.get(`/seats/${eventId}`);

// Bookings
export const checkoutBooking = (data) => api.post("/bookings/checkout", data);
export const fetchMyBookings = () => api.get("/bookings/me");
export const fetchBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`);

// Admin
export const fetchAdminStats = () => api.get("/admin/stats");
export const fetchAdminBookings = () => api.get("/admin/bookings");
