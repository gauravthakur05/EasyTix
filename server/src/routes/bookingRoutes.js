const express = require("express");
const { checkout, getMyBookings, getBookingById, cancelBooking } = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/checkout", checkout);
router.get("/me", getMyBookings);
router.get("/:id", getBookingById);
router.patch("/:id/cancel", cancelBooking);

module.exports = router;
