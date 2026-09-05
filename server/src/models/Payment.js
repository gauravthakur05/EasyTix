const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    method: { type: String, enum: ["TEST_CARD"], default: "TEST_CARD" },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "REFUNDED"],
      default: "SUCCESS",
    },
    transactionId: { type: String, required: true, unique: true },
    refundedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
