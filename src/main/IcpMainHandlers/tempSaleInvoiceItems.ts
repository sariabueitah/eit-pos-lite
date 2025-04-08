import { Database as DatabaseType } from 'better-sqlite3'
import { ipcMain } from 'electron'
import { addTempSaleInvoiceItem } from '../db/tempSaleInvoiceItems'

export function tempSaleInvoiceItemsHandlers(db: DatabaseType): void {
  ipcMain.handle('addTempSaleInvoiceItem', (_, saleInvoiceItem: SaleInvoiceItem) => {
    return addTempSaleInvoiceItem(db, saleInvoiceItem)
  })
}
