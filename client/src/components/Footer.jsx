export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
      <p>
        Built with React, Tailwind CSS, Node.js &amp; MongoDB — <span className="font-semibold text-slate-700">EasyTix</span> demo project.
      </p>
      <p className="mt-1 text-xs text-slate-400">Payments run in test/sandbox mode. No real charges are made.</p>
    </footer>
  );
}
