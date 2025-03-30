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

export function getAllPurchaseInvoiceItems(db: DatabaseType): [PurchaseInvoiceItem] {
  return db
    .prepare(
      'SELECT id,itemId,purchaseInvoiceId,quantity,price,tax FROM purchase_invoice_items WHERE deleted = 0'
    )
    .all() as [PurchaseInvoiceItem]
}

export function getAllDeletedPurchaseInvoiceItems(db: DatabaseType): [PurchaseInvoiceItem] {
  return db
    .prepare(
      'SELECT id,itemId,purchaseInvoiceId,quantity,price,tax FROM purchase_invoice_items WHERE deleted = 1'
    )
    .all() as [PurchaseInvoiceItem]
}

export function getPurchaseInvoiceItemById(db: DatabaseType, id: number): PurchaseInvoiceItem {
  return db
    .prepare(
      'SELECT id,itemId,purchaseInvoiceId,quantity,price,tax FROM purchase_invoice_items WHERE id = ?'
    )
    .get(id) as PurchaseInvoiceItem
}

export function getPurchaseInvoiceItemsByInvoiceId(
  db: DatabaseType,
  invoiceId: number
): [PurchaseInvoiceItem] {
  return db
    .prepare(
      'SELECT id,itemId,purchaseInvoiceId,quantity,price,tax FROM purchase_invoice_items WHERE purchaseInvoiceId = ?'
    )
    .get(invoiceId) as [PurchaseInvoiceItem]
}

export function addPurchaseInvoiceItem(
  db: DatabaseType,
  purchaseInvoiceItem: PurchaseInvoiceItem
): void {
  db.prepare(
    'INSERT INTO purchase_invoice_items (:itemId,:purchaseInvoiceId,:quantity,:price,:tax)'
  ).run(purchaseInvoiceItem)
}

export function updatePurchaseInvoiceItem(
  db: DatabaseType,
  id: number,
  purchaseInvoiceItem: Partial<PurchaseInvoiceItem>
): void {
  const fields = Object.keys(purchaseInvoiceItem)
    .map((key) => `${key} = ?`)
    .join(', ')
  const values = Object.values(purchaseInvoiceItem)
  values.push(id)

  const updatePurchaseInvoiceItem = db.prepare(
    `UPDATE purchase_invoice_items SET ${fields} WHERE id = ?`
  )
  updatePurchaseInvoiceItem.run(...values)
}

export function deletePurchaseInvoiceItem(db: DatabaseType, id: number): void {
  db.prepare('UPDATE purchase_invoice_items SET deleted = 1 WHERE id = ?;').run(id)
}
