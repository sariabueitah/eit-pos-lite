import { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './index'

export function setupSaleInvoicesTable(db: DatabaseType): void {
  if (!tableExists(db, 'sale_invoices')) {
    const createTable = `CREATE TABLE IF NOT EXISTS sale_invoices(
        'id' INTEGER PRIMARY KEY,
        'userId' INTEGER,
        'date' TEXT,
        'customer' TEXT,
        'status' TEXT,
        'paymentMethod' TEXT,
        'deleted' INTEGER DEFAULT 0,
        FOREIGN KEY('userId') REFERENCES 'users'('id')
    );`

    db.exec(createTable)

    db.exec('CREATE UNIQUE INDEX idx_sale_invoices_id ON sale_invoices (id);')
    db.exec('CREATE INDEX idx_sale_invoices_customer ON sale_invoices (customer);')
    db.exec('CREATE INDEX idx_sale_invoices_date ON sale_invoices (date);')
    db.exec('CREATE INDEX idx_sale_invoices_status ON sale_invoices (status);')
    db.exec('CREATE INDEX idx_sale_invoices_userId ON sale_invoices (userId);')
    db.exec('CREATE INDEX idx_sale_invoices_deleted ON sale_invoices (deleted);')
  }
}

export function getAllSaleInvoices(db: DatabaseType): [SaleInvoice] {
  return db
    .prepare(
      'SELECT id,userId,date,customer,status,paymentMethod FROM sale_invoices WHERE deleted = 0'
    )
    .all() as [SaleInvoice]
}

export function getAllDeletedSaleInvoices(db: DatabaseType): [SaleInvoice] {
  return db
    .prepare(
      'SELECT id,userId,date,customer,status,paymentMethod FROM sale_invoices WHERE deleted = 1'
    )
    .all() as [SaleInvoice]
}

export function getSaleInvoiceById(db: DatabaseType, id: number): SaleInvoice {
  return db
    .prepare('SELECT id,userId,date,customer,status,paymentMethod FROM sale_invoices WHERE id = ?')
    .get(id) as SaleInvoice
}

export function addSaleInvoice(db: DatabaseType, saleInvoice: SaleInvoice): number | bigint {
  const result = db
    .prepare(
      'INSERT INTO sale_invoices (userId,date,customer,status,paymentMethod) VALUES (:userId,:date,:customer,:status,:paymentMethod);'
    )
    .run(saleInvoice)
  return result.lastInsertRowid
}

export function updateSaleInvoice(
  db: DatabaseType,
  id: number,
  saleInvoice: Partial<SaleInvoice>
): void {
  const fields = Object.keys(saleInvoice)
    .map((key) => `${key} = ?`)
    .join(', ')
  const values = Object.values(saleInvoice)
  values.push(id)

  const updateSaleInvoice = db.prepare(`UPDATE sale_invoices SET ${fields} WHERE id = ?`)
  updateSaleInvoice.run(...values)
}

export function deleteSaleInvoice(db: DatabaseType, id: number): void {
  db.prepare('UPDATE sale_invoice SET deleted = 1 WHERE id = ?;').run(id)
}
