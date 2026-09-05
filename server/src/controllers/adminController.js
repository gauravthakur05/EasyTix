const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");

// @route GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalEvents, totalBookings, revenueAgg] = await Promise.all([
      User.countDocuments({ role: "USER" }),
      Event.countDocuments(),
      Booking.countDocuments({ status: "CONFIRMED" }),
      Booking.aggregate([
        { $match: { status: "CONFIRMED" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    res.json({
      totalUsers,
      totalEvents,
      totalBookings,
      totalRevenue: Number(totalRevenue.toFixed(2)),
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/admin/bookings
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("event")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats, getAllBookings };
