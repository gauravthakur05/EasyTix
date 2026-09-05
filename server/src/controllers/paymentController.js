const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/Payment");

// Simulated test-mode payment processor.
// Convention (mirrors Stripe's test cards):
//   Card number ending in 0002 -> DECLINED
//   Anything else (e.g. 4242 4242 4242 4242) -> SUCCESS
const simulateCharge = async ({ userId, amount, card }) => {
  const cardNumber = (card?.number || "").replace(/\s/g, "");

  if (!cardNumber || cardNumber.length < 12) {
    return { success: false, message: "Invalid card number" };
  }
  if (cardNumber.endsWith("0002")) {
    const payment = await Payment.create({
      user: userId,
      amount,
      status: "FAILED",
      transactionId: `txn_${uuidv4()}`,
    });
    return { success: false, message: "Payment declined by test card", payment };
  }

  const payment = await Payment.create({
    user: userId,
    amount,
    status: "SUCCESS",
    transactionId: `txn_${uuidv4()}`,
  });
  return { success: true, payment };
};

const simulateRefund = async (payment) => {
  payment.status = "REFUNDED";
  payment.refundedAt = new Date();
  await payment.save();
  return payment;
};

// @route GET /api/payments/:id
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (String(payment.user) !== String(req.user._id) && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to view this payment" });
    }
    res.json({ payment });
  } catch (err) {
    next(err);
  }
};

module.exports = { simulateCharge, simulateRefund, getPaymentById };
