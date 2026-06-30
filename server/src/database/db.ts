import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const DB_PATH = process.env.DB_PATH ?? 'chatis.db'

mkdirSync(dirname(DB_PATH), { recursive: true })

export const db = new Database(DB_PATH)

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender TEXT NOT NULL,
    receiver TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`)
