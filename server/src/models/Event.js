const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    seatId: { type: String, required: true }, // e.g. "A1"
    row: { type: String, required: true }, // e.g. "A"
    number: { type: Number, required: true }, // e.g. 1
    status: { type: String, enum: ["AVAILABLE", "BOOKED"], default: "AVAILABLE" },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Music", "Sports", "Theatre", "Comedy", "Conference", "Workshop", "Other"],
    },
    city: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // "18:30"
    image: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    seats: { type: [seatSchema], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

eventSchema.virtual("totalSeats").get(function () {
  return this.seats.length;
});

eventSchema.virtual("availableSeats").get(function () {
  return this.seats.filter((s) => s.status === "AVAILABLE").length;
});

eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

// Helper to generate a default rows x cols seat grid
eventSchema.statics.generateSeats = function (rows = ["A", "B", "C"], seatsPerRow = 5) {
  const seats = [];
  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({ seatId: `${row}${i}`, row, number: i, status: "AVAILABLE" });
    }
  });
  return seats;
};

module.exports = mongoose.model("Event", eventSchema);
