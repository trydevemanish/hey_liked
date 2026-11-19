# Coy Discover

A mobile-first profile discovery app built with Next.js, TypeScript, Tailwind
CSS, and SQLite.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The SQLite database is
created automatically at `data/discover.sqlite` when the health endpoint or
database module is first used.

Check the app and SQLite connection at [http://localhost:3000/api/health](http://localhost:3000/api/health).

## Database

The SQLite connection and initial schema are in `src/lib/db.ts`. Tables for
users, likes, and dislikes are created automatically. The local database file
is ignored by Git.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint
