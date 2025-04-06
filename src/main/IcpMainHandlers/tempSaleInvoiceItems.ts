import { Database as DatabaseType } from 'better-sqlite3'
import { ipcMain } from 'electron'
import {
  getAllTempSaleInvoiceItems,
  getTempSaleInvoiceItemById,
  getTempSaleInvoiceItemsByInvoiceId,
  addTempSaleInvoiceItem,
  updateTempSaleInvoiceItem,
  deleteTempSaleInvoiceItem
} from '../db/tempSaleInvoiceItems'

export function tempSaleInvoiceItemsHandlers(db: DatabaseType): void {
  ipcMain.handle('getAllTempSaleInvoiceItems', () => {
    return getAllTempSaleInvoiceItems(db)
  })
  ipcMain.handle('getTempSaleInvoiceItemById', (_, id: number) => {
    return getTempSaleInvoiceItemById(db, id)
  })
  ipcMain.handle('getTempSaleInvoiceItemsByInvoiceId', (_, invoiceId: number) => {
    return getTempSaleInvoiceItemsByInvoiceId(db, invoiceId)
  })
  ipcMain.handle('addTempSaleInvoiceItem', (_, saleInvoiceItem: SaleInvoiceItem) => {
    return addTempSaleInvoiceItem(db, saleInvoiceItem)
  })
  ipcMain.handle(
    'updateTempSaleInvoiceItem',
    (_, id, saleInvoiceItem: Partial<SaleInvoiceItem>) => {
      return updateTempSaleInvoiceItem(db, id, saleInvoiceItem)
    }
  )
  ipcMain.handle('deleteTempSaleInvoiceItem', (_, id: number) => {
    return deleteTempSaleInvoiceItem(db, id)
  })
}
