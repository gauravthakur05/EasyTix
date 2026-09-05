import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <p className="text-6xl">🎫</p>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Page not found</h1>
        <p className="mt-1 text-slate-500">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
