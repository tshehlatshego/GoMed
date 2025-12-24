import { Link } from "react-router-dom";
import { Upload, ShoppingCart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        <Link
          to="/add-picture"
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-brand-500/30 bg-brand-600/90 text-sm font-semibold text-white shadow-md shadow-brand-900/20 transition hover:-translate-y-0.5 hover:border-brand-400/60 hover:bg-brand-500/90"
        >
          <Upload className="h-5 w-5" strokeWidth={1.75} />
          Upload File 
        </Link>
        <Link
          to="/place-order"
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-brand-500/30 bg-brand-600/90 text-sm font-semibold text-white shadow-md shadow-brand-900/20 transition hover:-translate-y-0.5 hover:border-brand-400/60 hover:bg-brand-500/90"
        >
          <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
          Place Order
        </Link>
      </div>
    </div>
  );
}
