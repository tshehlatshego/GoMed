import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { House, Menu, MessageCircle } from "lucide-react";
import Home from "./pages/Home";
import AddPicture from "./pages/AddPicture";
import Survey from "./pages/Survey";
import PlaceOrder from "./pages/PlaceOrder";
import Chatbot from "./pages/Chatbot";

function App() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-24">
        <div className="absolute left-0 right-0 top-6 flex items-center justify-between px-2 sm:px-0">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-lg shadow-emerald-500/10 transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
            <span className="sr-only">Open menu</span>
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100 shadow-lg shadow-emerald-500/10 transition hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-emerald-400/20"
          >
            <House className="h-5 w-5" strokeWidth={1.75} />
            <span>Home</span>
          </Link>
        </div>

        {/* Route area */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-picture" element={<AddPicture />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>

        {/* Floating Chatbot Button */}
        <Link
          to="/chatbot"
          aria-label="Open chatbot"
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100 shadow-lg shadow-emerald-500/10 backdrop-blur transition hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-emerald-400/20"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
          <span>chatbot</span>
        </Link>

        {/* Overlay */}
        <div
          onClick={() => setOpen(false)}
          className={[
            "fixed inset-0 z-40 bg-black/50 transition-opacity",
            open ? "opacity-100" : "pointer-events-none opacity-0"
          ].join(" ")}
          aria-hidden="true"
        />

        {/* Sliding Drawer */}
        <aside
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className={[
            "fixed left-0 top-0 z-50 h-full w-72 max-w-[85vw]",
            "transform rounded-r-2xl border-r border-white/10 bg-slate-900/95 backdrop-blur",
            "shadow-2xl shadow-emerald-500/10 transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full"
          ].join(" ")}
        >
          <div className="flex items-center justify-between px-4 py-4">
            <span className="text-sm font-semibold tracking-wider text-emerald-300">Menu</span>
            <button
              type="button"
              className="rounded-md px-3 py-1 text-sm text-slate-200 hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <nav className="px-2 pb-6">
            <Link
              to="/"
              className="block rounded-md px-3 py-2 text-slate-200 hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
          </nav>
        </aside>
      </div>
    </div>
  );
}

export default App;
