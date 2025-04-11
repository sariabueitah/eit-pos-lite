import { Database as DatabaseType } from 'better-sqlite3'
import { ipcMain } from 'electron'
import {
  addTempSaleInvoiceItem,
  getTempSaleInvoiceItemBySaleInvoiceId,
  deleteTempSaleInvoiceItemBySaleInvoiceId
} from '../db/tempSaleInvoiceItems'

export function tempSaleInvoiceItemsHandlers(db: DatabaseType): void {
  ipcMain.handle('getTempSaleInvoiceItemBySaleInvoiceId', (_, saleInvoiceId: number | bigint) => {
    return getTempSaleInvoiceItemBySaleInvoiceId(db, saleInvoiceId)
  })
  ipcMain.handle('addTempSaleInvoiceItem', (_, saleInvoiceItem: SaleInvoiceItem) => {
    return addTempSaleInvoiceItem(db, saleInvoiceItem)
  })
  ipcMain.handle(
    'deleteTempSaleInvoiceItemBySaleInvoiceId',
    (_, saleInvoiceId: number | bigint) => {
      return deleteTempSaleInvoiceItemBySaleInvoiceId(db, saleInvoiceId)
    }
  )
}
