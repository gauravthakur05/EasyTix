const Event = require("../models/Event");
const Booking = require("../models/Booking");

// @route GET /api/events
// Supports: ?search=&category=&city=&sort=date_asc|date_desc|price_asc|price_desc
const getEvents = async (req, res, next) => {
  try {
    const { search, category, city, sort } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { venue: { $regex: search, $options: "i" } },
      ];
    }
    if (category && category !== "All") query.category = category;
    if (city && city !== "All") query.city = city;

    let sortOption = { date: 1 };
    if (sort === "date_desc") sortOption = { date: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };

    const events = await Event.find(query).sort(sortOption);
    res.json({ events });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/events/meta/filters
const getFilterOptions = async (req, res, next) => {
  try {
    const cities = await Event.distinct("city");
    const categories = await Event.distinct("category");
    res.json({ cities, categories });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/events/:id
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ event });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/events (ADMIN)
const createEvent = async (req, res, next) => {
  try {
    const { name, description, category, city, venue, date, time, image, price, rows, seatsPerRow } =
      req.body;

    const seats = Event.generateSeats(
      rows && rows.length ? rows : ["A", "B", "C"],
      seatsPerRow || 5
    );

    const event = await Event.create({
      name,
      description,
      category,
      city,
      venue,
      date,
      time,
      image,
      price,
      seats,
      createdBy: req.user._id,
    });

    res.status(201).json({ event });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/events/:id (ADMIN)
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const editable = ["name", "description", "category", "city", "venue", "date", "time", "image", "price"];
    editable.forEach((field) => {
      if (req.body[field] !== undefined) event[field] = req.body[field];
    });

    await event.save();
    res.json({ event });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/events/:id (ADMIN)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await Booking.deleteMany({ event: event._id });
    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEvents,
  getFilterOptions,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
