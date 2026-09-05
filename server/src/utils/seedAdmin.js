require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const run = async () => {
  await connectDB();

  const name = process.env.ADMIN_NAME || "Admin User";
  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@123";

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== "ADMIN") {
      existing.role = "ADMIN";
      await existing.save();
      console.log(`Existing user ${email} promoted to ADMIN.`);
    } else {
      console.log(`Admin user ${email} already exists.`);
    }
  } else {
    await User.create({ name, email, password, role: "ADMIN" });
    console.log(`Admin user created: ${email} / ${password}`);
  }

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
