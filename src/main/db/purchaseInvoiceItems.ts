import { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './index'

export function setupPurchaseInvoiceItemsTable(db: DatabaseType): void {
  if (!tableExists(db, 'purchase_invoice_items')) {
    const createTable = `CREATE TABLE IF NOT EXISTS purchase_invoice_items(
        'id' INTEGER PRIMARY KEY,
        'itemId' INTEGER,
        'purchaseInvoiceId' INTEGER,
        'quantity' INTEGER,
        'price' REAL,
        'tax' REAL,
        'deleted' INTEGER DEFAULT 0,
        FOREIGN KEY('itemId') REFERENCES 'items'('id'),
        FOREIGN KEY('purchaseInvoiceId') REFERENCES 'sale_invoices'('id')
    );`

    db.exec(createTable)

    db.exec('CREATE UNIQUE INDEX idx_purchase_invoice_items_id ON purchase_invoice_items (id);')
    db.exec(
      'CREATE INDEX idx_purchase_invoice_items_purchaseInvoiceId ON purchase_invoice_items (purchaseInvoiceId);'
    )
    db.exec('CREATE INDEX idx_purchase_invoice_items_deleted ON purchase_invoice_items (deleted);')
  }
}
