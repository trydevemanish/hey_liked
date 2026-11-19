import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const databasePath = join(process.cwd(), "data", "discover.sqlite");
mkdirSync(dirname(databasePath), { recursive: true });

type DatabaseGlobal = typeof globalThis & {
  discoverDatabase?: Database.Database;
};

const globalForDatabase = globalThis as DatabaseGlobal;
const database =
  globalForDatabase.discoverDatabase ?? new Database(databasePath);

globalForDatabase.discoverDatabase = database;

database.pragma("foreign_keys = ON");
database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18),
    photo TEXT NOT NULL,
    short_bio TEXT NOT NULL,
    city TEXT NOT NULL,
    interests TEXT NOT NULL DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS liked (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    liked_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    liked_to INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (liked_by, liked_to),
    CHECK (liked_by <> liked_to)
  );

  CREATE TABLE IF NOT EXISTS disliked (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    disliked_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    disliked_to INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (disliked_by, disliked_to),
    CHECK (disliked_by <> disliked_to)
  );

  CREATE INDEX IF NOT EXISTS liked_liked_to_idx ON liked(liked_to);
  CREATE INDEX IF NOT EXISTS disliked_disliked_to_idx ON disliked(disliked_to);
`);

export default database;
