import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        <Link
          to="/add-picture"
          className="h-12 rounded-xl border border-white/10 bg-white/5 text-center text-sm font-semibold leading-[3rem] text-white shadow-md shadow-emerald-500/10 transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10"
        >
          ADD PICTURE
        </Link>
        <Link
          to="/survey"
          className="h-12 rounded-xl border border-white/10 bg-white/5 text-center text-sm font-semibold leading-[3rem] text-white shadow-md shadow-emerald-500/10 transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10"
        >
          SURVEY
        </Link>
        <Link
          to="/place-order"
          className="h-12 rounded-xl border border-white/10 bg-white/5 text-center text-sm font-semibold leading-[3rem] text-white shadow-md shadow-emerald-500/10 transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/10"
        >
          PLACE ORDER
        </Link>
      </div>
    </div>
  );
}
