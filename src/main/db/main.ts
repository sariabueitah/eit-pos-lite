import Database, { Database as DatabaseType } from 'better-sqlite3'
import { setupUsersTable } from './users'

export function setupDB(): DatabaseType {
  const dbPath = './resources/app.db'
  const db = new Database(dbPath, { verbose: console.log })
  db.pragma('journal_mode = WAL')

  setupUsersTable(db)

  return db
}

export function tableExists(db: DatabaseType, tableName: string): boolean {
  const table = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ? ")
    .get(tableName)
  if (table == undefined) {
    return false
  } else {
    return true
  }
}
