import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// A tiny embedded "database" backed by a single JSON file. There's no
// separate database server to install (no MongoDB, no Postgres) — the file
// is created automatically on first run at server/data/db.json.
//
// This is intentionally simple and fine for a personal project / portfolio
// app. All reads/writes are synchronous, which keeps things race-free since
// Node runs each request handler to completion before starting the next
// synchronous section.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

const EMPTY_DB = {
  users: [],
  categories: [],
  accounts: [],
  transactions: [],
  reminders: [],
};

function ensureDB() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(EMPTY_DB, null, 2));
  }
}

export function readDB() {
  ensureDB();
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  try {
    const data = JSON.parse(raw);
    // Make sure every expected collection exists even if the file predates it.
    return { ...EMPTY_DB, ...data };
  } catch {
    return { ...EMPTY_DB };
  }
}

export function writeDB(data) {
  ensureDB();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

let counter = 0;
export function uid(prefix) {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}
