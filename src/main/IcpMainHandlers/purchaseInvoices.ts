import { Database as DatabaseType } from 'better-sqlite3'
import { ipcMain } from 'electron'
import {
  getAllPurchaseInvoices,
  getAllDeletedPurchaseInvoices,
  getPurchaseInvoiceById,
  addPurchaseInvoice,
  updatePurchaseInvoice,
  deletePurchaseInvoice
} from '../db/purchaseInvoices'

export function purchaseInvoicesHandlers(db: DatabaseType): void {
  ipcMain.handle('getAllPurchaseInvoices', () => {
    return getAllPurchaseInvoices(db)
  })
  ipcMain.handle('getAllDeletedPurchaseInvoices', () => {
    return getAllDeletedPurchaseInvoices(db)
  })
  ipcMain.handle('getPurchaseInvoiceById', (_, id: number) => {
    return getPurchaseInvoiceById(db, id)
  })
  ipcMain.handle('addPurchaseInvoice', (_, purchaseInvoice: PurchaseInvoice) => {
    return addPurchaseInvoice(db, purchaseInvoice)
  })
  ipcMain.handle(
    'updatePurchaseInvoice',
    (_, id: number, purchaseInvoice: Partial<PurchaseInvoice>) => {
      return updatePurchaseInvoice(db, id, purchaseInvoice)
    }
  )
  ipcMain.handle('deletePurchaseInvoice', (_, id: number) => {
    return deletePurchaseInvoice(db, id)
  })
}
