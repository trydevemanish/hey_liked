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

## Seed demo profiles

```bash
npm run db:seed
```

This adds a demo user and 30 fictional profiles to an empty database. Four
profiles have liked the demo user and two have passed on them. Seeding is
transactional and skips a database that already contains users.

Add your photos later under `public/assets/` with these filenames:
`profile-01.jpg` through `profile-30.jpg`, plus `demo-user.jpg` for the demo
account. The profile records already refer to those paths.

## Profile API

- `GET /api/feed` returns profiles the demo user has not swiped on.
- `POST /api/swipe` accepts `{ "profileId": 2, "action": "like" }` or
  `{ "profileId": 2, "action": "pass" }`. Swipes persist in SQLite, and the
  response reports a match only when both users liked each other.

## Database

The SQLite connection and initial schema are in `src/lib/db.ts`. Tables for
users, likes, and dislikes are created automatically. The seed function is in
`src/lib/seed.ts`; the local database file is ignored by Git.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint
