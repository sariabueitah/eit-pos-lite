import { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './index'

export function setupPurchaseInvoiceItemsTable(db: DatabaseType): void {
  if (!tableExists(db, 'purchase_invoice_items')) {
    const createTable = `CREATE TABLE IF NOT EXISTS purchase_invoice_items(
        'id' INTEGER PRIMARY KEY,
        'itemId' INTEGER,
        'purchaseInvoiceId' INTEGER,
        'quantity' INTEGER,
        'cost' REAL,
        'tax' REAL,
        'deleted' INTEGER DEFAULT 0,
        FOREIGN KEY('itemId') REFERENCES 'items'('id'),
        FOREIGN KEY('purchaseInvoiceId') REFERENCES 'purchase_invoices'('id')
    );`

    db.exec(createTable)

    db.exec('CREATE UNIQUE INDEX idx_purchase_invoice_items_id ON purchase_invoice_items (id);')
    db.exec(
      'CREATE INDEX idx_purchase_invoice_items_purchaseInvoiceId ON purchase_invoice_items (purchaseInvoiceId);'
    )
    db.exec('CREATE INDEX idx_purchase_invoice_items_deleted ON purchase_invoice_items (deleted);')
  }
}

function getPurchaseInvoiceItemById(db: DatabaseType, id: number | bigint): PurchaseInvoiceItem {
  return db
    .prepare('SELECT * FROM purchase_invoice_items WHERE id = ?')
    .get(id) as PurchaseInvoiceItem
}

export function getPurchaseInvoiceItemsByPurchaseInvoiceId(
  db: DatabaseType,
  purchaseInvoiceId: number | bigint
): PurchaseInvoiceItem[] {
  return db
    .prepare(
      'SELECT p.*, i.barcode, i.name, i.unit FROM purchase_invoice_items p INNER JOIN items i ON p.itemId = i.id WHERE p.purchaseInvoiceId = ?'
    )
    .all(purchaseInvoiceId) as [PurchaseInvoiceItem]
}

export function addPurchaseInvoiceItem(
  db: DatabaseType,
  purchaseInvoiceItem: PurchaseInvoiceItem
): PurchaseInvoiceItem {
  Object.keys(purchaseInvoiceItem).forEach(
    (k) =>
      (purchaseInvoiceItem[k] =
        typeof purchaseInvoiceItem[k] == 'string'
          ? purchaseInvoiceItem[k].trim()
          : purchaseInvoiceItem[k])
  )
  const result = db
    .prepare(
      'INSERT INTO purchase_invoice_items (itemId,purchaseInvoiceId,quantity,cost,tax) VALUES (:itemId,:purchaseInvoiceId,:quantity,:cost,:tax)'
    )
    .run(purchaseInvoiceItem)

  return getPurchaseInvoiceItemById(db, result.lastInsertRowid)
}
