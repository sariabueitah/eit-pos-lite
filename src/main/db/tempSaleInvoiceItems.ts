import { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './index'

export function setupTempSaleInvoiceItemsTable(db: DatabaseType): void {
  if (!tableExists(db, 'temp_sale_invoice_items')) {
    const createTable = `CREATE TABLE IF NOT EXISTS temp_sale_invoice_items(
        'id' INTEGER PRIMARY KEY,
        'itemId' INTEGER,
        'saleInvoiceId' INTEGER,
        'quantity' INTEGER,
        'discount' REAL,
        'price' REAL,
        'cost' REAL,
        'tax' REAL,
        FOREIGN KEY('itemId') REFERENCES 'items'('id'),
        FOREIGN KEY('saleInvoiceId') REFERENCES 'temp_sale_invoices'('id')
    );`

    db.exec(createTable)

    db.exec('CREATE UNIQUE INDEX idx_temp_sale_invoice_items_id ON temp_sale_invoice_items (id);')
    db.exec(
      'CREATE INDEX idx_temp_sale_invoice_items_saleInvoiceId ON temp_sale_invoice_items (saleInvoiceId);'
    )
  }
}

export function getAllTempSaleInvoiceItems(db: DatabaseType): [SaleInvoiceItem] {
  return db.prepare('SELECT * FROM temp_sale_invoice_items WHERE deleted = 0').all() as [
    SaleInvoiceItem
  ]
}

export function getTempSaleInvoiceItemById(db: DatabaseType, id: number | bigint): SaleInvoiceItem {
  return db.prepare('SELECT * FROM temp_sale_invoice_items WHERE id = ?').get(id) as SaleInvoiceItem
}

export function getTempSaleInvoiceItemsByInvoiceId(
  db: DatabaseType,
  invoice_id: number
): [SaleInvoiceItem] {
  return db
    .prepare('SELECT * FROM temp_sale_invoice_items WHERE saleInvoiceId = ?')
    .get(invoice_id) as [SaleInvoiceItem]
}

export function addTempSaleInvoiceItem(
  db: DatabaseType,
  tempSaleInvoiceItem: SaleInvoiceItem
): SaleInvoiceItem {
  const result = db
    .prepare(
      `INSERT INTO temp_sale_invoice_items(itemId,saleInvoiceId,quantity,discount,price,cost,tax) VALUES (:itemId,:saleInvoiceId,:quantity,:discount,:price,:cost,:tax)`
    )
    .run(tempSaleInvoiceItem)

  return getTempSaleInvoiceItemById(db, result.lastInsertRowid)
}

export function updateTempSaleInvoiceItem(
  db: DatabaseType,
  id: number,
  tempSaleInvoiceItem: Partial<SaleInvoiceItem>
): SaleInvoiceItem {
  const fields = Object.keys(tempSaleInvoiceItem)
    .map((key) => `${key} = ?`)
    .join(', ')
  const values = Object.values(tempSaleInvoiceItem)
  values.push(id)

  const updateTempSaleInvoiceItem = db.prepare(
    `UPDATE temp_sale_invoice_items SET ${fields} WHERE id = ?`
  )
  const resultId = updateTempSaleInvoiceItem.run(...values).lastInsertRowid
  return getTempSaleInvoiceItemById(db, resultId)
}

export function deleteTempSaleInvoiceItem(db: DatabaseType, id: number): void {
  db.prepare('DELETE FROM temp_sale_invoice_items WHERE id = ?;').run(id)
}
