import { Database as DatabaseType } from 'better-sqlite3'
import { ipcMain } from 'electron'
import {
  getAllSaleInvoices,
  getAllDeletedSaleInvoices,
  getSaleInvoiceById,
  addSaleInvoice,
  updateSaleInvoice,
  deleteSaleInvoice
} from '../db/saleInvoices'
import { addSaleInvoiceItem } from '../db/saleInvoiceItems'

export function saleInvoiceHandlers(db: DatabaseType): void {
  ipcMain.handle('getAllSaleInvoices', () => {
    return getAllSaleInvoices(db)
  })
  ipcMain.handle('getAllDeletedSaleInvoices', () => {
    return getAllDeletedSaleInvoices(db)
  })
  ipcMain.handle('getSaleInvoiceById', (_, id: number) => {
    return getSaleInvoiceById(db, id)
  })
  ipcMain.handle('addSaleInvoice', (_, saleInvoice: SaleInvoice) => {
    return addSaleInvoice(db, saleInvoice)
  })
  ipcMain.handle('updateSaleInvoice', (_, id: number, saleInvoice: Partial<SaleInvoice>) => {
    return updateSaleInvoice(db, id, saleInvoice)
  })
  ipcMain.handle('deleteSaleInvoice', (_, id: number) => {
    return deleteSaleInvoice(db, id)
  })

  ipcMain.handle('createSaleInvoice', (_, x, y) => {
    const invoiceId = addSaleInvoice(db, x)
    for (let i = 0; i < y.length; i++) {
      addSaleInvoiceItem(db, { ...y[i], saleInvoiceId: invoiceId })
    }
    return 'success'
  })
}
