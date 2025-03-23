import { Database as DatabaseType } from 'better-sqlite3'
import { ipcMain } from 'electron'
import {
  getAllSaleInvoiceItems,
  getAllDeletedSaleInvoiceItems,
  getSaleInvoiceItemById,
  getSaleInvoiceItemsByInvoiceId,
  addSaleInvoiceItem,
  updateSaleInvoiceItem,
  deleteSaleInvoiceItem
} from '../db/saleInvoiceItems'

export function saleInvoiceItemsHandlers(db: DatabaseType): void {
  ipcMain.handle('getAllSaleInvoiceItems', () => {
    return getAllSaleInvoiceItems(db)
  })
  ipcMain.handle('getAllDeletedSaleInvoiceItems', () => {
    return getAllDeletedSaleInvoiceItems(db)
  })
  ipcMain.handle('getSaleInvoiceItemById', (_, id: number) => {
    return getSaleInvoiceItemById(db, id)
  })
  ipcMain.handle('getSaleInvoiceItemsByInvoiceId', (_, invoiceId: number) => {
    return getSaleInvoiceItemsByInvoiceId(db, invoiceId)
  })
  ipcMain.handle('addSaleInvoiceItem', (_, saleInvoiceItem: SaleInvoiceItem) => {
    return addSaleInvoiceItem(db, saleInvoiceItem)
  })
  ipcMain.handle('updateSaleInvoiceItem', (_, id, saleInvoiceItem: Partial<SaleInvoiceItem>) => {
    return updateSaleInvoiceItem(db, id, saleInvoiceItem)
  })
  ipcMain.handle('deleteSaleInvoiceItem', (_, id: number) => {
    return deleteSaleInvoiceItem(db, id)
  })
}
