const express = require("express");
const { getSeatMap } = require("../controllers/seatController");

const router = express.Router();

router.get("/:eventId", getSeatMap);

module.exports = router;
