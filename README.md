# GoMed Frontend

React + Vite + Tailwind starter configured with TypeScript and ESLint.

## Scripts
- `npm install` – install dependencies
- `npm run dev` – start Vite dev server
- `npm run build` – type-check and build for production
- `npm run preview` – preview the production build
- `npm run lint` – lint TypeScript/React sources

## Tailwind
Classes are available globally via `src/index.css` using `@tailwind base`, `components`, and `utilities`. Content scanning is set to `index.html` and everything in `src/**/*.{ts,tsx}`.

## Project structure
- `index.html` – Vite entry
- `src/main.tsx` – app bootstrap
- `src/App.tsx` – sample UI
- `tailwind.config.cjs` / `postcss.config.cjs` – Tailwind & PostCSS setup
- `vite.config.ts` – Vite configuration

## Notes
- Node 18+ recommended for Vite 5.
- Remove `package-lock.json` is ignored in `.gitignore`; switch to your preferred lockfile and adjust `.gitignore` if needed.
