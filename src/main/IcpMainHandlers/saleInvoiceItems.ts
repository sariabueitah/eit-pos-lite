import { Database as DatabaseType } from 'better-sqlite3'
import { ipcMain } from 'electron'
import { addSaleInvoiceItem } from '../db/saleInvoiceItems'

export function saleInvoiceItemsHandlers(db: DatabaseType): void {
  ipcMain.handle('addSaleInvoiceItem', (_, saleInvoiceItem: SaleInvoiceItem) => {
    return addSaleInvoiceItem(db, saleInvoiceItem)
  })
}
