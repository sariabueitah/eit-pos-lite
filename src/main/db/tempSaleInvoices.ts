import { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './index'

export function setupTempSaleInvoicesTable(db: DatabaseType): void {
  if (!tableExists(db, 'temp_sale_invoices')) {
    const createTable = `CREATE TABLE IF NOT EXISTS temp_sale_invoices(
        'id' INTEGER PRIMARY KEY,
        'userId' INTEGER,
        'date' INTEGER,
        'customer' TEXT,
        'status' TEXT,
        'paymentMethod' TEXT,
        FOREIGN KEY('userId') REFERENCES 'users'('id')
    );`

    db.exec(createTable)

    db.exec('CREATE UNIQUE INDEX idx_temp_sale_invoices_id ON temp_sale_invoices (id);')
    db.exec('CREATE INDEX idx_temp_sale_invoices_customer ON temp_sale_invoices (customer);')
    db.exec('CREATE INDEX idx_temp_sale_invoices_date ON temp_sale_invoices (date);')
    db.exec('CREATE INDEX idx_temp_sale_invoices_status ON temp_sale_invoices (status);')
    db.exec('CREATE INDEX idx_temp_sale_invoices_userId ON temp_sale_invoices (userId);')
  }
}

export function getAllTempSaleInvoices(db: DatabaseType): [SaleInvoice] {
  return db.prepare('SELECT * FROM temp_sale_invoices').all() as [SaleInvoice]
}

export function getTempSaleInvoiceById(db: DatabaseType, id: number | bigint): SaleInvoice {
  return db.prepare('SELECT * FROM temp_sale_invoices WHERE id = ?').get(id) as SaleInvoice
}

export function addTempSaleInvoice(
  db: DatabaseType,
  tempSaleInvoice: Partial<SaleInvoice>
): SaleInvoice {
  Object.keys(tempSaleInvoice).forEach(
    (k) =>
      (tempSaleInvoice[k] =
        typeof tempSaleInvoice[k] == 'string' ? tempSaleInvoice[k].trim() : tempSaleInvoice[k])
  )
  const result = db
    .prepare(
      `INSERT INTO temp_sale_invoices(userId,date,customer,status,paymentMethod) VALUES (:userId,:date,:customer,:status,:paymentMethod)`
    )
    .run(tempSaleInvoice)

  return getTempSaleInvoiceById(db, result.lastInsertRowid)
}

export function deleteTempSaleInvoiceById(db: DatabaseType, id: number | bigint): void {
  db.prepare('DELETE FROM temp_sale_invoices WHERE id = ?').run(id)
}
