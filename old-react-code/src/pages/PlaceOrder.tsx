import { Plus, Minus, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

interface Medication {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  quantity: number;
}

interface PlaceOrderProps {
  medications: Medication[];
  setMedications: (meds: Medication[]) => void;
}

export default function PlaceOrder({ medications, setMedications }: PlaceOrderProps) {
  const medicationDetails: Record<number, { description: string; image: string }> = {
    1: {
      description: "Pain reliever and fever reducer",
      image: "/meds/aspirin.svg"
    },
    2: {
      description: "Anti-inflammatory pain reliever",
      image: "/meds/ibuprofen.svg"
    },
    3: {
      description: "Acetaminophen for pain and fever",
      image: "/meds/paracetamol.svg"
    },
    4: {
      description: "Immune support supplement",
      image: "/meds/vitamin-c.svg"
    },
    5: {
      description: "Effective cough suppressant",
      image: "/meds/cough-syrup.svg"
    },
    6: {
      description: "Allergy relief medication",
      image: "/meds/antihistamine.svg"
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setMedications(
      medications.map((med) =>
        med.id === id
          ? { ...med, quantity: Math.max(0, med.quantity + delta) }
          : med
      )
    );
  };

  const cartTotal = medications.reduce(
    (sum, med) => sum + med.price * med.quantity,
    0
  );
  const cartItems = medications.reduce((sum, med) => sum + med.quantity, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Order Medications</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {medications.map((med) => {
          const details = medicationDetails[med.id];
          return (
            <div
              key={med.id}
              className="overflow-hidden rounded-2xl border border-brand-500/30 bg-brand-600/90 shadow-lg shadow-brand-900/20"
            >
              <div className="aspect-square overflow-hidden bg-slate-700">
                <img
                  src={details.image}
                  alt={med.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/meds/generic.svg";
                  }}
                  loading="lazy"
                />
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {med.name}
                  </h3>
                  <p className="text-sm text-slate-300">{details.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-brand-200">
                    ${med.price.toFixed(2)}
                  </span>
                  <span className="rounded-full bg-brand-700/50 px-3 py-1 text-sm font-medium text-white">
                    {med.quantity}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateQuantity(med.id, -1)}
                    disabled={med.quantity === 0}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-brand-400/30 bg-brand-700/50 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => updateQuantity(med.id, 1)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-brand-400/30 bg-brand-500/80 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      {cartItems > 0 && (
        <div className="sticky bottom-6 rounded-2xl border border-brand-500/30 bg-brand-600/90 p-6 shadow-lg shadow-brand-900/20">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-white">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-semibold">{cartItems} items</span>
              </div>
              <p className="text-3xl font-bold text-brand-200">
                ${cartTotal.toFixed(2)}
              </p>
            </div>
            <Link
              to="/cart"
              className="rounded-xl border border-brand-400/30 bg-brand-500/80 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:-translate-y-0.5 hover:bg-brand-500"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}


