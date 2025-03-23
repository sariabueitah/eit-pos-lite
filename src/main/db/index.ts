import { is } from '@electron-toolkit/utils'
import Database, { Database as DatabaseType } from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'
import { setupUsersTable } from './users'
import { setupItemsTable } from './items'
import { setupCategoriesTable } from './categories'
import { setupSuppliersTable } from './suppliers'
import { setupPurchaseInvoicesTable } from './purchaseInvoices'
import { setupPurchaseInvoiceItemsTable } from './purchaseInvoiceItems'
import { setupSaleInvoicesTable } from './saleInvoices'
import { setupSaleInvoiceItemsTable } from './saleInvoiceItems'

export function setupDB(): DatabaseType {
  let dbPath = path.join(app.getPath('userData'), 'app.db')
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    dbPath = './resources/app.db'
  }
  const db = new Database(dbPath, { verbose: console.log })
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  setupUsersTable(db)
  setupCategoriesTable(db)
  setupSuppliersTable(db)
  setupItemsTable(db)
  setupPurchaseInvoicesTable(db)
  setupPurchaseInvoiceItemsTable(db)
  setupSaleInvoicesTable(db)
  setupSaleInvoiceItemsTable(db)

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
