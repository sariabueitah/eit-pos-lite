import { Database as DatabaseType } from 'better-sqlite3'
import { ipcMain } from 'electron'
import {
  addPurchaseInvoiceItem,
  getPurchaseInvoiceItemsByPurchaseInvoiceId
} from '../db/purchaseInvoiceItems'

export function purchaseInvoiceItemsHandlers(db: DatabaseType): void {
  ipcMain.handle('addPurchaseInvoiceItem', (_, purchaseInvoiceItem: PurchaseInvoiceItem) => {
    return addPurchaseInvoiceItem(db, purchaseInvoiceItem)
  })
  ipcMain.handle(
    'getPurchaseInvoiceItemsByPurchaseInvoiceId',
    (_, purchaseInvoiceId: number | bigint) => {
      return getPurchaseInvoiceItemsByPurchaseInvoiceId(db, purchaseInvoiceId)
    }
  )
}
