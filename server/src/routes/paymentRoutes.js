const express = require("express");
const { getPaymentById } = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/:id", protect, getPaymentById);

module.exports = router;
