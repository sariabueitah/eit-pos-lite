import { Database as DatabaseType } from 'better-sqlite3'
import { ipcMain } from 'electron'
import {
  getAllTempSaleInvoices,
  getTempSaleInvoiceById,
  addTempSaleInvoice
} from '../db/tempSaleInvoices'
import { addTempSaleInvoiceItem } from '../db/tempSaleInvoiceItems'

export function tempSaleInvoiceHandlers(db: DatabaseType): void {
  ipcMain.handle('getAllTempSaleInvoices', () => {
    return getAllTempSaleInvoices(db)
  })

  ipcMain.handle('getTempSaleInvoiceById', (_, id: number) => {
    return getTempSaleInvoiceById(db, id)
  })
  ipcMain.handle('addTempSaleInvoice', (_, tempSaleInvoice: SaleInvoice) => {
    return addTempSaleInvoice(db, tempSaleInvoice)
  })

  ipcMain.handle('createTempSaleInvoiceWithItems', (_, invoice, invoiceItems) => {
    const tempSaleInvoice = addTempSaleInvoice(db, invoice)
    const tempSaleInvoiceItems = <SaleInvoiceItem[]>[]
    for (let i = 0; i < invoiceItems.length; i++) {
      tempSaleInvoiceItems.push(
        addTempSaleInvoiceItem(db, { ...invoiceItems[i], saleInvoiceId: tempSaleInvoice.id })
      )
    }
    return { tempSaleInvoice: tempSaleInvoice, tempSaleInvoiceItems: tempSaleInvoiceItems }
  })
}
