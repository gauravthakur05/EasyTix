const express = require("express");
const { getStats, getAllBookings } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/bookings", getAllBookings);

module.exports = router;
