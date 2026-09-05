const express = require("express");
const { body } = require("express-validator");
const {
  getEvents,
  getFilterOptions,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect, adminOnly } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

const eventValidation = [
  body("name").trim().notEmpty().withMessage("Event name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("venue").trim().notEmpty().withMessage("Venue is required"),
  body("date").notEmpty().withMessage("Date is required"),
  body("time").notEmpty().withMessage("Time is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
];

router.get("/", getEvents);
router.get("/meta/filters", getFilterOptions);
router.get("/:id", getEventById);

router.post("/", protect, adminOnly, eventValidation, validate, createEvent);
router.put("/:id", protect, adminOnly, updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);

module.exports = router;
