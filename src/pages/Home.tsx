import { Link } from "react-router-dom";
import { Upload, ClipboardList, ShoppingCart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        <Link
          to="/add-picture"
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white shadow-md shadow-emerald-500/10 transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10"
        >
          <Upload className="h-5 w-5" strokeWidth={1.75} />
          ADD PICTURE
        </Link>
        <Link
          to="/survey"
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white shadow-md shadow-emerald-500/10 transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10"
        >
          <ClipboardList className="h-5 w-5" strokeWidth={1.75} />
          SURVEY
        </Link>
        <Link
          to="/place-order"
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white shadow-md shadow-emerald-500/10 transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10"
        >
          <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
          PLACE ORDER
        </Link>
      </div>
    </div>
  );
}
