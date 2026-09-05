# 🎟️ EasyTix — Easy Event Ticket Booking Platform

A full-stack event ticket booking web app built with the MERN stack. Users can browse events, pick seats
from a live seat map, pay with a simulated test-mode payment, and receive an instant QR-code ticket.
Admins get a dashboard to manage events, view all bookings, and see platform statistics.

Built as a portfolio project — clean code, simple architecture, no unnecessary infrastructure.

---

## Tech Stack

| Layer      | Technology                                   |
|------------|-----------------------------------------------|
| Frontend   | React (Vite), Tailwind CSS, React Router, Axios |
| Backend    | Node.js, Express.js                          |
| Database   | MongoDB + Mongoose                           |
| Auth       | JWT + bcrypt password hashing                |
| Payments   | Simulated test-mode payment (Stripe-style test cards) |
| Tickets    | QR code generation (`qrcode` npm package)    |

No Docker, no AWS, no Kubernetes, no microservices — just a simple client/server app you can run locally.

---

## Project Structure

```
event-ticket-booking/
├── client/                 # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── api/            # Axios instance + API call functions
│   │   ├── components/     # Navbar, EventCard, SeatMap, ProtectedRoute, Footer
│   │   ├── context/        # AuthContext (JWT session state)
│   │   ├── pages/          # Route-level pages (Home, Events, Checkout, etc.)
│   │   │   └── admin/      # Admin dashboard pages
│   │   └── utils/          # Formatting helpers
│   └── .env.example
├── server/                 # Express + MongoDB backend
│   ├── src/
│   │   ├── config/         # MongoDB connection
│   │   ├── controllers/    # Route handler logic
│   │   ├── middleware/     # JWT auth, admin guard, validation, error handler
│   │   ├── models/         # User, Event, Booking, Payment (Mongoose schemas)
│   │   ├── routes/         # Express routers
│   │   ├── utils/          # QR generation, admin/event seed scripts
│   │   └── app.js / server.js
│   └── .env.example
├── .gitignore
├── .env.example
└── README.md
```

---

## Features

### User
- Register / Login / Logout (JWT-based auth)
- Browse, search, and filter events (category, city, sort by date/price)
- View full event details
- Interactive seat map (AVAILABLE / BOOKED states, click to select)
- Checkout with a simulated test payment form
- Instant booking confirmation + QR-code ticket
- View booking history ("My Bookings")
- Cancel a booking → seats are released and a simulated refund is issued

### Admin
- Admin login (same login form, role-based redirect)
- Dashboard with platform statistics: total users, total events, total bookings, simulated revenue
- Create / edit / delete events (with configurable seat rows & seats-per-row)
- View all bookings across all users

### Security
- Passwords hashed with **bcrypt**
- **JWT** authentication with protected routes
- Role-based access control (`USER` vs `ADMIN`)
- Users can only access their own bookings; admins can access everything
- Input validation via `express-validator`
- CORS configured to only allow the frontend origin
- Environment variables via `.env` (excluded from git via `.gitignore`)
- Race-condition-safe seat locking (`findOneAndUpdate` with array filters) so two users can't book the same seat

---

## 1. Install Dependencies

```bash
# from the project root
cd server && npm install
cd ../client && npm install
```

## 2. Configure Environment Variables

**Backend** — copy the example file and edit as needed:
```bash
cd server
cp .env.example .env
```
Edit `server/.env`:
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb://127.0.0.1:27017/event_ticket_booking

JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d

STRIPE_SECRET_KEY=sk_test_your_stripe_test_key

ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```
> Generate a strong `JWT_SECRET` with: `openssl rand -hex 32`
> `STRIPE_SECRET_KEY` is optional — this project uses a **built-in simulated payment processor**
> (see "Test the Booking Flow" below), so you do not need a real Stripe account to run it.

**Frontend** — copy the example file:
```bash
cd client
cp .env.example .env
```
Edit `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

## 3. Connect MongoDB

You need a running MongoDB instance. Two easy options:

**Option A — Local MongoDB**
Install MongoDB Community Edition, then start it:
```bash
mongod --dbpath /path/to/data/db
```
Keep the default `MONGO_URI` in `server/.env` (`mongodb://127.0.0.1:27017/event_ticket_booking`).

**Option B — MongoDB Atlas (free cloud cluster)**
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string and paste it into `MONGO_URI` in `server/.env`, e.g.
   `mongodb+srv://<user>:<password>@cluster0.mongodb.net/event_ticket_booking`

## 4. Start the Backend

```bash
cd server
npm run dev      # nodemon, auto-restarts on changes
# or: npm start
```
The API runs at `http://localhost:5000`. Health check: `GET http://localhost:5000/api/health`.

## 5. Start the Frontend

```bash
cd client
npm run dev
```
The app runs at `http://localhost:5173`.

## 6. Create / Use an Admin Account

Run the seed script once your backend `.env` is configured and MongoDB is reachable:
```bash
cd server
npm run seed:admin
```
This creates (or promotes) the admin user defined by `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`
(default: `admin@example.com` / `Admin@123`).

Then log in from the app's **Login** page with those credentials — you'll be redirected to
`/admin` automatically because the account has the `ADMIN` role.

Optional: seed a few demo events so the site isn't empty:
```bash
npm run seed:events
```

## 7. Test the Complete Booking Flow

1. Register a normal user account (or log in as one).
2. Go to **Browse Events**, open an event, click **Select Seats**.
3. Click on a few available (green) seats, then **Continue to Checkout**.
4. On the checkout page, a test card is pre-filled: `4242 4242 4242 4242` — this always **succeeds**.
   - To test a **declined payment**, use any card number ending in `0002` (e.g. `4000 0000 0000 0002`).
5. Submit payment → you land on the **Booking Confirmed** page.
6. Click **View QR Ticket** to see your generated QR code.
7. Go to **My Bookings** to see your booking history, and try **Cancel** on a confirmed booking —
   the seats become available again and the payment is marked as refunded (simulated).
8. Log in as the admin account and open **Admin Dashboard** to see stats, manage events
   (create/edit/delete), and view all bookings platform-wide.

---

## Important Features Implemented

- Full JWT auth flow with bcrypt password hashing and role-based route protection
- Search, filter, and sort on the events list
- Interactive, race-condition-safe seat selection and booking
- Simulated end-to-end payment flow (success/decline test cards) with a `Payment` record per transaction
- QR-code ticket generation embedded directly in the booking record
- Booking cancellation with automatic seat release and simulated refund
- Admin CRUD for events and a stats dashboard (users, events, bookings, revenue)
- Clean REST API with proper separation of controllers/routes/models/middleware
- Responsive, modern Tailwind CSS UI (mobile-friendly navbar, seat grid, forms)

## Known Limitations / Possible Future Improvements

- Payments are **simulated only** — no real Stripe/Razorpay SDK integration is wired up (by design,
  to keep the project runnable without external accounts). Swapping in real Stripe Test Mode would mean
  replacing `simulateCharge` in `paymentController.js` with a real `stripe.paymentIntents.create()` call.
- No email notifications (booking confirmation emails, etc.) — everything is shown in-app only.
- No pagination on events/bookings lists (fine for portfolio-scale data; would need pagination for
  production scale).
- No password-reset / "forgot password" flow.
- Event images are provided as external URLs rather than file uploads.
- Seat layout is a simple fixed rows × columns grid (no per-seat pricing tiers).

---

## Why this is a good interview talk-track

- **Auth & security**: JWT + bcrypt + role-based middleware, explainable in under a minute.
- **Data modeling**: seats are embedded inside the `Event` document for atomic, race-safe updates —
  a good example of thoughtful MongoDB schema design (embedding vs. referencing trade-off).
- **Concurrency handling**: seat booking uses `findOneAndUpdate` with array filters plus a re-fetch
  verification step, demonstrating an understanding of race conditions in booking systems.
- **Clean REST API**: consistent controller/route/model/middleware separation, easy to walk through.
- **End-to-end feature**: a real user journey (browse → seats → pay → QR ticket → history → cancel)
  that's easy to demo live.
