import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-brand-700">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">🎟️</span>
          EasyTix
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link to="/events" className="hover:text-brand-600">
            Browse Events
          </Link>
          {user && (
            <Link to="/my-bookings" className="hover:text-brand-600">
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="hover:text-brand-600">
              Admin Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-slate-500">
                Hi, <span className="font-semibold text-slate-800">{user.name.split(" ")[0]}</span>
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-slate-700">
            <Link to="/events" onClick={() => setMenuOpen(false)}>
              Browse Events
            </Link>
            {user && (
              <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>
                My Bookings
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMenuOpen(false)}>
                Admin Dashboard
              </Link>
            )}
            {user ? (
              <button onClick={handleLogout} className="text-left text-red-600">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
