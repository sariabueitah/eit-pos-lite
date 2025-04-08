import { Database as DatabaseType } from 'better-sqlite3'
import { ipcMain } from 'electron'
import { addSaleInvoice } from '../db/saleInvoices'
import { addSaleInvoiceItem } from '../db/saleInvoiceItems'

export function saleInvoiceHandlers(db: DatabaseType): void {
  ipcMain.handle('addSaleInvoice', (_, saleInvoice: SaleInvoice) => {
    return addSaleInvoice(db, saleInvoice)
  })

  ipcMain.handle('createSaleInvoiceWithItems', (_, invoice, invoiceItems) => {
    const saleInvoice = addSaleInvoice(db, invoice)
    const saleInvoiceItems = <SaleInvoiceItem[]>[]
    for (let i = 0; i < invoiceItems.length; i++) {
      saleInvoiceItems.push(
        addSaleInvoiceItem(db, { ...invoiceItems[i], saleInvoiceId: saleInvoice.id })
      )
    }
    return { saleInvoice: saleInvoice, saleInvoiceItems: saleInvoiceItems }
  })
}
