import { is } from '@electron-toolkit/utils'
import Database, { Database as DatabaseType } from 'better-sqlite3'
import { setupUsersTable } from './users'
import { setupItemsTable } from './items'
import path from 'path'
import { app } from 'electron'

export function setupDB(): DatabaseType {
  let dbPath = path.join(app.getPath('userData'), 'app.db')
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    dbPath = './resources/app.db'
  }
  const db = new Database(dbPath, { verbose: console.log })
  db.pragma('journal_mode = WAL')

  setupUsersTable(db)
  setupItemsTable(db)

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
