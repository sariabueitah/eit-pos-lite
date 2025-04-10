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
        FOREIGN KEY('itemId') REFERENCES 'items'('id'),
        FOREIGN KEY('saleInvoiceId') REFERENCES 'sale_invoices'('id')
    );`

    db.exec(createTable)

    db.exec('CREATE UNIQUE INDEX idx_sale_invoice_items_id ON sale_invoice_items (id);')
    db.exec(
      'CREATE INDEX idx_sale_invoice_items_saleInvoiceId ON sale_invoice_items (saleInvoiceId);'
    )
  }
}

function getSaleInvoiceItemById(db: DatabaseType, id: number | bigint): SaleInvoiceItem {
  return db.prepare('SELECT * FROM sale_invoice_items WHERE id = ?').get(id) as SaleInvoiceItem
}

export function getSaleInvoiceItemsBySaleInvoiceId(
  db: DatabaseType,
  saleInvoiceId: number | bigint
): SaleInvoiceItem[] {
  return db
    .prepare(
      'SELECT s.*, i.barcode, i.name, i.unit FROM sale_invoice_items s INNER JOIN items i ON s.itemId = i.id WHERE saleInvoiceId = ?'
    )
    .all(saleInvoiceId) as [SaleInvoiceItem]
}

export function addSaleInvoiceItem(
  db: DatabaseType,
  saleInvoiceItem: SaleInvoiceItem
): SaleInvoiceItem {
  Object.keys(saleInvoiceItem).forEach(
    (k) =>
      (saleInvoiceItem[k] =
        typeof saleInvoiceItem[k] == 'string' ? saleInvoiceItem[k].trim() : saleInvoiceItem[k])
  )
  const result = db
    .prepare(
      'INSERT INTO sale_invoice_items (itemId,saleInvoiceId,quantity,price,cost,tax) VALUES (:itemId,:saleInvoiceId,:quantity,:price,:cost,:tax)'
    )
    .run(saleInvoiceItem)

  return getSaleInvoiceItemById(db, result.lastInsertRowid)
}
