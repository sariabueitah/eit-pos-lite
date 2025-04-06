import { Database as DatabaseType } from 'better-sqlite3'
import { ipcMain } from 'electron'
import {
  getAllTempSaleInvoices,
  getAllDeletedTempSaleInvoices,
  getTempSaleInvoiceById,
  addTempSaleInvoice,
  updateTempSaleInvoice,
  deleteTempSaleInvoice
} from '../db/tempSaleInvoices'
import { addTempSaleInvoiceItem } from '../db/tempSaleInvoiceItems'

export function tempSaleInvoiceHandlers(db: DatabaseType): void {
  ipcMain.handle('getAllTempSaleInvoices', () => {
    return getAllTempSaleInvoices(db)
  })
  ipcMain.handle('getAllDeletedTempSaleInvoices', () => {
    return getAllDeletedTempSaleInvoices(db)
  })
  ipcMain.handle('getTempSaleInvoiceById', (_, id: number) => {
    return getTempSaleInvoiceById(db, id)
  })
  ipcMain.handle('addTempSaleInvoice', (_, tempSaleInvoice: SaleInvoice) => {
    return addTempSaleInvoice(db, tempSaleInvoice)
  })
  ipcMain.handle(
    'updateTempSaleInvoice',
    (_, id: number, tempSaleInvoice: Partial<SaleInvoice>) => {
      return updateTempSaleInvoice(db, id, tempSaleInvoice)
    }
  )
  ipcMain.handle('deleteTempSaleInvoice', (_, id: number) => {
    return deleteTempSaleInvoice(db, id)
  })

  ipcMain.handle('createTempSaleInvoice', (_, x, y) => {
    const invoice = addTempSaleInvoice(db, x)
    for (let i = 0; i < y.length; i++) {
      addTempSaleInvoiceItem(db, { ...y[i], saleInvoiceId: invoice.id })
    }
    return invoice
  })
}
