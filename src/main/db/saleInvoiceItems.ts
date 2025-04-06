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

export function getAllSaleInvoiceItems(db: DatabaseType): [SaleInvoiceItem] {
  return db
    .prepare(
      'SELECT id,itemId,saleInvoiceId,quantity,price,cost,tax FROM sale_invoice_items WHERE deleted = 0'
    )
    .all() as [SaleInvoiceItem]
}

export function getAllDeletedSaleInvoiceItems(db: DatabaseType): [SaleInvoiceItem] {
  return db
    .prepare(
      'SELECT id,itemId,saleInvoiceId,quantity,price,cost,tax FROM sale_invoice_items WHERE deleted = 1'
    )
    .all() as [SaleInvoiceItem]
}

export function getSaleInvoiceItemById(db: DatabaseType, id: number): SaleInvoiceItem {
  return db
    .prepare(
      'SELECT id,itemId,saleInvoiceId,quantity,price,cost,tax FROM sale_invoice_items WHERE id = ?'
    )
    .get(id) as SaleInvoiceItem
}

export function getSaleInvoiceItemsByInvoiceId(
  db: DatabaseType,
  invoice_id: number
): [SaleInvoiceItem] {
  return db
    .prepare(
      'SELECT id,itemId,saleInvoiceId,quantity,price,cost,tax FROM sale_invoice_items WHERE saleInvoiceId = ?'
    )
    .get(invoice_id) as [SaleInvoiceItem]
}

export function addSaleInvoiceItem(db: DatabaseType, saleInvoiceItem: SaleInvoiceItem): void {
  db.prepare(
    'INSERT INTO sale_invoice_items (itemId,saleInvoiceId,quantity,price,cost,tax) VALUES (:itemId,:saleInvoiceId,:quantity,:price,:cost,:tax)'
  ).run(saleInvoiceItem)
}

export function updateSaleInvoiceItem(
  db: DatabaseType,
  id: number,
  saleInvoiceItem: Partial<SaleInvoiceItem>
): void {
  const fields = Object.keys(saleInvoiceItem)
    .map((key) => `${key} = ?`)
    .join(', ')
  const values = Object.values(saleInvoiceItem)
  values.push(id)

  const updateSaleInvoiceItem = db.prepare(`UPDATE sale_invoice_items SET ${fields} WHERE id = ?`)
  updateSaleInvoiceItem.run(...values)
}

export function deleteSaleInvoiceItem(db: DatabaseType, id: number): void {
  db.prepare('UPDATE sale_invoice_items SET deleted = 1 WHERE id = ?;').run(id)
}
