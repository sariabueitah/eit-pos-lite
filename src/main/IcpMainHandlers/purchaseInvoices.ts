import { Database as DatabaseType } from 'better-sqlite3'
import { ipcMain } from 'electron'
import {
  getAllPurchaseInvoices,
  getPurchaseInvoiceById,
  addPurchaseInvoice,
  searchPurchaseInvoices
} from '../db/purchaseInvoices'
import { addPurchaseInvoiceItem } from '../db/purchaseInvoiceItems'
import { getSupplierById, updateSupplier } from '../db/suppliers'

export function purchaseInvoicesHandlers(db: DatabaseType): void {
  ipcMain.handle('getAllPurchaseInvoices', () => {
    return getAllPurchaseInvoices(db)
  })
  ipcMain.handle('getPurchaseInvoiceById', (_, id) => {
    return getPurchaseInvoiceById(db, id)
  })
  ipcMain.handle('addPurchaseInvoice', (_, purchaseInvoice: PurchaseInvoice) => {
    return addPurchaseInvoice(db, purchaseInvoice)
  })

  ipcMain.handle('createPurchaseInvoiceWithItems', (_, invoice, invoiceItems) => {
    const purchaseInvoice = addPurchaseInvoice(db, invoice)
    const purchaseInvoiceItems = <PurchaseInvoiceItem[]>[]
    for (let i = 0; i < invoiceItems.length; i++) {
      purchaseInvoiceItems.push(
        addPurchaseInvoiceItem(db, { ...invoiceItems[i], purchaseInvoiceId: purchaseInvoice.id })
      )
    }
    const supplier = getSupplierById(db, purchaseInvoice.supplierId)
    supplier.balance += roundNum(Number(purchaseInvoice.totalPrice) - Number(purchaseInvoice.paid))
    updateSupplier(db, purchaseInvoice.supplierId, supplier)
    return { purchaseInvoice: purchaseInvoice, purchaseInvoiceItems: purchaseInvoiceItems }
  })

  ipcMain.handle(
    'searchPurchaseInvoices',
    (_, search: string, status: string, dateFrom: string, dateTo: string) => {
      return searchPurchaseInvoices(db, search, status, dateFrom, dateTo)
    }
  )
}

function roundNum(number: number): number {
  return +(Math.round(Number(number + 'e+2')) + 'e-2')
}
