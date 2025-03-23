import { Database as DatabaseType } from 'better-sqlite3'
import { ipcMain } from 'electron'
import {
  getAllPurchaseInvoiceItems,
  getAllDeletedPurchaseInvoiceItems,
  getPurchaseInvoiceItemById,
  getPurchaseInvoiceItemsByInvoiceId,
  addPurchaseInvoiceItem,
  updatePurchaseInvoiceItem,
  deletePurchaseInvoiceItem
} from '../db/purchaseInvoiceItems'

export function purchaseInvoiceItemsHandlers(db: DatabaseType): void {
  ipcMain.handle('getAllPurchaseInvoiceItems', () => {
    return getAllPurchaseInvoiceItems(db)
  })
  ipcMain.handle('getAllDeletedPurchaseInvoiceItems', () => {
    return getAllDeletedPurchaseInvoiceItems(db)
  })
  ipcMain.handle('getPurchaseInvoiceItemById', (_, id: number) => {
    return getPurchaseInvoiceItemById(db, id)
  })
  ipcMain.handle('getPurchaseInvoiceItemsByInvoiceId', (_, invoiceId: number) => {
    return getPurchaseInvoiceItemsByInvoiceId(db, invoiceId)
  })
  ipcMain.handle('addPurchaseInvoiceItem', (_, purchaseInvoiceItem: PurchaseInvoiceItem) => {
    return addPurchaseInvoiceItem(db, purchaseInvoiceItem)
  })
  ipcMain.handle(
    'updatePurchaseInvoiceItem',
    (_, id, purchaseInvoiceItem: Partial<PurchaseInvoiceItem>) => {
      return updatePurchaseInvoiceItem(db, id, purchaseInvoiceItem)
    }
  )
  ipcMain.handle('deletePurchaseInvoiceItem', (_, id: number) => {
    return deletePurchaseInvoiceItem(db, id)
  })
}
