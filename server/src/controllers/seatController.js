const Event = require("../models/Event");

// @route GET /api/seats/:eventId
const getSeatMap = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId).select("seats name");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ seats: event.seats });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSeatMap };
