require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Event = require("../models/Event");
const User = require("../models/User");

const sampleEvents = [
  {
    name: "Indie Music Night",
    description: "An evening of live indie music from up-and-coming local bands.",
    category: "Music",
    city: "Austin",
    venue: "The Sound Garage",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: "19:00",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    price: 25,
  },
  {
    name: "City Marathon 2026",
    description: "Annual city marathon with 5K, 10K, and full marathon categories.",
    category: "Sports",
    city: "Boston",
    venue: "Downtown Circuit",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    time: "06:30",
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800",
    price: 40,
  },
  {
    name: "Stand-Up Comedy Live",
    description: "A night of laughs with three touring stand-up comedians.",
    category: "Comedy",
    city: "Chicago",
    venue: "The Laugh Track Club",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    time: "20:00",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800",
    price: 30,
  },
  {
    name: "React Developers Conference",
    description: "A one-day conference covering the latest in React and frontend engineering.",
    category: "Conference",
    city: "San Francisco",
    venue: "Bay View Convention Center",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    time: "09:00",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    price: 99,
  },
  {
    name: "Shakespeare in the Park",
    description: "An open-air performance of 'A Midsummer Night's Dream'.",
    category: "Theatre",
    city: "New York",
    venue: "Central Green Amphitheatre",
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    time: "18:00",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800",
    price: 20,
  },
  {
    name: "Intro to UX Design Workshop",
    description: "A hands-on workshop covering the fundamentals of UX design and prototyping.",
    category: "Workshop",
    city: "Austin",
    venue: "Creative Hub Coworking",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: "10:00",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
    price: 15,
  },
];

const run = async () => {
  await connectDB();

  const admin = await User.findOne({ role: "ADMIN" });
  const count = await Event.countDocuments();

  if (count > 0) {
    console.log(`Database already has ${count} events. Skipping seed.`);
  } else {
    const eventsWithSeats = sampleEvents.map((e) => ({
      ...e,
      seats: Event.generateSeats(["A", "B", "C"], 5),
      createdBy: admin ? admin._id : undefined,
    }));
    await Event.insertMany(eventsWithSeats);
    console.log(`Seeded ${eventsWithSeats.length} sample events.`);
  }

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
