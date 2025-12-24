import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { House, Menu, ShoppingCart } from "lucide-react";
import logo from "./logo.jpg";
import HomeHtml from "./pages/HomeHtml";
import AddPicture from "./pages/AddPicture";

import PlaceOrder from "./pages/PlaceOrder";
import Cart from "./pages/Cart";



function App() {
  const [open, setOpen] = useState(false);
  const [medications, setMedications] = useState([
    { id: 1, name: "Aspirin 500mg", price: 4.99, quantity: 0 },
    { id: 2, name: "Ibuprofen 200mg", price: 6.49, quantity: 0 },
    { id: 3, name: "Paracetamol 500mg", price: 5.99, quantity: 0 },
    { id: 4, name: "Vitamin C 1000mg", price: 7.99, quantity: 0 },
    { id: 5, name: "Cough Syrup", price: 8.49, quantity: 0 },
    { id: 6, name: "Antihistamine 10mg", price: 9.99, quantity: 0 }
  ]);

  const cartCount = medications.reduce((sum, med) => sum + med.quantity, 0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen text-white">
      <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-24">
        <div className="absolute left-0 right-0 top-6 flex items-center justify-between px-2 sm:px-0">
          <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-500/30 bg-brand-600/90 text-white shadow-lg shadow-brand-900/20 transition hover:-translate-y-0.5 hover:border-brand-400/60 hover:bg-brand-500/90"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
            <span className="sr-only">Open menu</span>
          </button>

            <img
              src={logo}
              alt="GoMed logo"
              className="h-12 w-12 rounded-full border border-white/10 bg-white/5 object-cover shadow-lg shadow-brand-500/10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-600/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:-translate-y-0.5 hover:border-brand-400/60 hover:bg-brand-500/90"
            >
              <House className="h-5 w-5" strokeWidth={1.75} />
              <span>Home</span>
            </Link>
            <Link
              to="/cart"
              aria-label="Shopping cart"
              className="relative flex items-center justify-center rounded-full border border-brand-500/30 bg-brand-600/90 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:-translate-y-0.5 hover:border-brand-400/60 hover:bg-brand-500/90"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Route content */}
        <div className="min-h-[60vh]">
          <Routes>
            <Route path="/" element={<HomeHtml />} />
            <Route path="/add-picture" element={<AddPicture />} />
            <Route path="/place-order" element={<PlaceOrder medications={medications} setMedications={setMedications} />} />
            <Route path="/cart" element={<Cart medications={medications} setMedications={setMedications} />} />
          </Routes>
        </div>

        
      

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
            "shadow-2xl shadow-brand-500/10 transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full"
          ].join(" ")}
        >
          <div className="flex items-center justify-between px-4 py-4">
            <span className="text-sm font-semibold tracking-wider text-brand-300">Menu</span>
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
