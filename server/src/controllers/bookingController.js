const { v4: uuidv4 } = require("uuid");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const generateQrCode = require("../utils/generateQr");
const { simulateCharge, simulateRefund } = require("./paymentController");

// @route POST /api/bookings/checkout
// body: { eventId, seatIds: ["A1","A2"], card: { number, expiry, cvv, name } }
const checkout = async (req, res, next) => {
  try {
    const { eventId, seatIds, card } = req.body;

    if (!eventId || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ message: "eventId and at least one seat are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Verify all requested seats exist and are AVAILABLE
    const unavailable = seatIds.filter((id) => {
      const seat = event.seats.find((s) => s.seatId === id);
      return !seat || seat.status !== "AVAILABLE";
    });
    if (unavailable.length > 0) {
      return res.status(409).json({
        message: `Seat(s) no longer available: ${unavailable.join(", ")}`,
      });
    }

    const totalAmount = Number((event.price * seatIds.length).toFixed(2));

    // Process simulated payment BEFORE locking seats
    const chargeResult = await simulateCharge({ userId: req.user._id, amount: totalAmount, card });
    if (!chargeResult.success) {
      return res.status(402).json({ message: chargeResult.message || "Payment failed" });
    }

    // Atomically lock only the seats that are still available
    const updateResult = await Event.updateOne(
      { _id: eventId, "seats.seatId": { $in: seatIds } },
      { $set: { "seats.$[elem].status": "BOOKED" } },
      { arrayFilters: [{ "elem.seatId": { $in: seatIds }, "elem.status": "AVAILABLE" }] }
    );

    // Re-fetch and confirm every seat actually got locked (race-condition guard)
    const refreshed = await Event.findById(eventId);
    const stillNotBooked = seatIds.filter((id) => {
      const seat = refreshed.seats.find((s) => s.seatId === id);
      return !seat || seat.status !== "BOOKED";
    });
    if (stillNotBooked.length > 0) {
      // Roll back: refund the simulated charge since we couldn't secure the seats
      await simulateRefund(chargeResult.payment);
      return res.status(409).json({
        message: `Seat(s) got booked by someone else: ${stillNotBooked.join(", ")}. Payment refunded.`,
      });
    }

    const bookingRef = `TKT-${uuidv4().split("-")[0].toUpperCase()}`;

    const qrPayload = {
      bookingRef,
      event: event.name,
      seats: seatIds,
      user: req.user.email,
    };
    const qrCode = await generateQrCode(qrPayload);

    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      seats: seatIds,
      totalAmount,
      status: "CONFIRMED",
      qrCode,
      bookingRef,
      payment: chargeResult.payment._id,
    });

    chargeResult.payment.booking = booking._id;
    await chargeResult.payment.save();

    const populated = await Booking.findById(booking._id).populate("event");

    res.status(201).json({ booking: populated });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/bookings/me
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/bookings/:id
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (String(booking.user) !== String(req.user._id) && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to view this booking" });
    }

    res.json({ booking });
  } catch (err) {
    next(err);
  }
};

// @route PATCH /api/bookings/:id/cancel
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("payment");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (String(booking.user) !== String(req.user._id) && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // Free up the seats
    await Event.updateOne(
      { _id: booking.event },
      { $set: { "seats.$[elem].status": "AVAILABLE" } },
      { arrayFilters: [{ "elem.seatId": { $in: booking.seats } }] }
    );

    // Simulated refund
    if (booking.payment && booking.payment.status === "SUCCESS") {
      await simulateRefund(booking.payment);
    }

    booking.status = "CANCELLED";
    await booking.save();

    const populated = await Booking.findById(booking._id).populate("event").populate("payment");
    res.json({ booking: populated, message: "Booking cancelled and payment refunded (simulated)" });
  } catch (err) {
    next(err);
  }
};

module.exports = { checkout, getMyBookings, getBookingById, cancelBooking };
