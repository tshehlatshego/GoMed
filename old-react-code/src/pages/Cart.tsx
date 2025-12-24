import { Plus, Minus, Trash2 } from "lucide-react";

interface Medication {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  medications: Medication[];
  setMedications: (meds: Medication[]) => void;
}

export default function Cart({ medications, setMedications }: CartProps) {
  const cartItems = medications.filter((med) => med.quantity > 0);
  const cartTotal = cartItems.reduce(
    (sum, med) => sum + med.price * med.quantity,
    0
  );

  const updateQuantity = (id: number, delta: number) => {
    setMedications(
      medications.map((med) =>
        med.id === id
          ? { ...med, quantity: Math.max(0, med.quantity + delta) }
          : med
      )
    );
  };

  const removeItem = (id: number) => {
    setMedications(
      medications.map((med) => (med.id === id ? { ...med, quantity: 0 } : med))
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="flex min-h-[50vh] items-center justify-center rounded-2xl border border-brand-500/30 bg-brand-600/90 p-8 shadow-lg shadow-brand-900/20">
          <div className="text-center">
            <p className="text-2xl font-semibold text-slate-300">
              Your cart is empty
            </p>
            <p className="mt-2 text-slate-400">
              Add medications from the Place Order page
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((med) => (
              <div
                key={med.id}
                className="flex items-center gap-4 rounded-xl border border-brand-500/30 bg-brand-600/90 p-4 shadow-lg shadow-brand-900/20"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {med.name}
                  </h3>
                  <p className="text-sm text-slate-300">
                    ${med.price.toFixed(2)} each
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(med.id, -1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-400/30 bg-brand-700/50 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={med.quantity === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold text-white">
                    {med.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(med.id, 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-400/30 bg-brand-500/80 text-white transition hover:bg-brand-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="w-24 text-right">
                  <p className="text-lg font-bold text-brand-200">
                    ${(med.price * med.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(med.id)}
                  className="rounded-lg border border-red-500/30 bg-red-500/20 p-2 text-red-300 transition hover:bg-red-500/30"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-brand-500/30 bg-brand-600/90 p-6 shadow-lg shadow-brand-900/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-300">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Items:</span>
                <span>
                  {cartItems.reduce((sum, med) => sum + med.quantity, 0)}
                </span>
              </div>
              <div className="border-t border-brand-500/30 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-brand-200">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <button className="mt-6 w-full rounded-xl border border-brand-400/30 bg-brand-500/80 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:-translate-y-0.5 hover:bg-brand-500">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
