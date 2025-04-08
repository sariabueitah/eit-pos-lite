import { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './index'

export function setupSaleInvoiceItemsTable(db: DatabaseType): void {
  if (!tableExists(db, 'sale_invoice_items')) {
    const createTable = `CREATE TABLE IF NOT EXISTS sale_invoice_items(
        'id' INTEGER PRIMARY KEY,
        'itemId' INTEGER,
        'saleInvoiceId' INTEGER,
        'quantity' INTEGER,
        'discount' REAL,
        'price' REAL,
        'cost' REAL,
        'tax' REAL,
        'deleted' INTEGER DEFAULT 0,
        FOREIGN KEY('itemId') REFERENCES 'items'('id'),
        FOREIGN KEY('saleInvoiceId') REFERENCES 'sale_invoices'('id')
    );`

    db.exec(createTable)

    db.exec('CREATE UNIQUE INDEX idx_sale_invoice_items_id ON sale_invoice_items (id);')
    db.exec(
      'CREATE INDEX idx_sale_invoice_items_saleInvoiceId ON sale_invoice_items (saleInvoiceId);'
    )
    db.exec('CREATE INDEX idx_sale_invoice_items_deleted ON sale_invoice_items (deleted);')
  }
}

function getSaleInvoiceItemById(db: DatabaseType, id: number | bigint): SaleInvoiceItem {
  return db
    .prepare('SELECT * FROM sale_invoice_items WHERE id = ? AND deleted = 0')
    .get(id) as SaleInvoiceItem
}

export function addSaleInvoiceItem(
  db: DatabaseType,
  saleInvoiceItem: SaleInvoiceItem
): SaleInvoiceItem {
  const result = db
    .prepare(
      'INSERT INTO sale_invoice_items (itemId,saleInvoiceId,quantity,price,cost,tax) VALUES (:itemId,:saleInvoiceId,:quantity,:price,:cost,:tax)'
    )
    .run(saleInvoiceItem)

  return getSaleInvoiceItemById(db, result.lastInsertRowid)
}
