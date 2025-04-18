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

function getTempSaleInvoiceItemById(db: DatabaseType, id: number | bigint): SaleInvoiceItem {
  return db
    .prepare(
      'SELECT s.*, i.barcode, i.name, i.unit FROM temp_sale_invoice_items s INNER JOIN items i ON s.itemId = i.id WHERE s.id = ?'
    )
    .get(id) as SaleInvoiceItem
}

export function getTempSaleInvoiceItemBySaleInvoiceId(
  db: DatabaseType,
  saleInvoiceId: number | bigint
): SaleInvoiceItem[] {
  return db
    .prepare(
      'SELECT s.itemId,s.saleInvoiceId,s.quantity,s.discount,i.price,i.cost,i.tax, i.barcode, i.name, i.unit FROM temp_sale_invoice_items s INNER JOIN items i ON s.itemId = i.id WHERE s.saleInvoiceId = ?'
    )
    .all(saleInvoiceId) as [SaleInvoiceItem]
}

export function addTempSaleInvoiceItem(
  db: DatabaseType,
  tempSaleInvoiceItem: SaleInvoiceItem
): SaleInvoiceItem {
  Object.keys(tempSaleInvoiceItem).forEach(
    (k) =>
      (tempSaleInvoiceItem[k] =
        typeof tempSaleInvoiceItem[k] == 'string'
          ? tempSaleInvoiceItem[k].trim()
          : tempSaleInvoiceItem[k])
  )
  const result = db
    .prepare(
      `INSERT INTO temp_sale_invoice_items(itemId,saleInvoiceId,quantity,discount,price,cost,tax) VALUES (:itemId,:saleInvoiceId,:quantity,:discount,:price,:cost,:tax)`
    )
    .run(tempSaleInvoiceItem)

  return getTempSaleInvoiceItemById(db, result.lastInsertRowid)
}

export function deleteTempSaleInvoiceItemBySaleInvoiceId(
  db: DatabaseType,
  saleInvoiceId: number | bigint
): void {
  db.prepare('DELETE FROM temp_sale_invoice_items WHERE saleInvoiceId = ?').run(saleInvoiceId)
}
