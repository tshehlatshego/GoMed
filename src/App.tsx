import { House, Menu } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-24">
        <div className="absolute left-0 right-0 top-6 flex items-center justify-between px-2 sm:px-0">
          <button
            type="button"
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-lg shadow-emerald-500/10 transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10"
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
            <span className="sr-only">Open menu</span>
          </button>

          <a
            href="#"
            className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100 shadow-lg shadow-emerald-500/10 transition hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-emerald-400/20"
          >
            <House className="h-5 w-5" strokeWidth={1.75} />
            <span>Home</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
