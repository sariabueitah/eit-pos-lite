import { Database as DatabaseType } from 'better-sqlite3'
import { categoriesHandlers } from './categories'
import { itemHandlers } from './items'
import { suppliersHandlers } from './suppliers'
import { userHandlers } from './users'
import { purchaseInvoicesHandlers } from './purchaseInvoices'
import { purchaseInvoiceItemsHandlers } from './purchaseInvoiceItems'
import { saleInvoiceHandlers } from './saleInvoices'
import { saleInvoiceItemsHandlers } from './saleInvoiceItems'

//TODO check unused icpMain handlers and db calls
//TODO check insert and update queries return types make them like user
export function defineIcpHandlers(db: DatabaseType): void {
  categoriesHandlers(db)
  itemHandlers(db)
  suppliersHandlers(db)
  userHandlers(db)
  purchaseInvoicesHandlers(db)
  purchaseInvoiceItemsHandlers(db)
  saleInvoiceHandlers(db)
  saleInvoiceItemsHandlers(db)
}
