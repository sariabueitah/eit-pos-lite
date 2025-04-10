import { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './index'

export function setupSaleInvoicesTable(db: DatabaseType): void {
  if (!tableExists(db, 'sale_invoices')) {
    const createTable = `CREATE TABLE IF NOT EXISTS sale_invoices(
        'id' INTEGER PRIMARY KEY,
        'userId' INTEGER,
        'date' INTEGER,
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

function getSaleInvoiceById(db: DatabaseType, id: number | bigint): SaleInvoice {
  return db
    .prepare('SELECT * FROM sale_invoices WHERE id = ? AND deleted = 0')
    .get(id) as SaleInvoice
}

export function addSaleInvoice(db: DatabaseType, saleInvoice: SaleInvoice): SaleInvoice {
  Object.keys(saleInvoice).forEach(
    (k) =>
      (saleInvoice[k] = typeof saleInvoice[k] == 'string' ? saleInvoice[k].trim() : saleInvoice[k])
  )
  const result = db
    .prepare(
      'INSERT INTO sale_invoices (userId,date,customer,status,paymentMethod) VALUES (:userId,:date,:customer,:status,:paymentMethod);'
    )
    .run(saleInvoice)
  return getSaleInvoiceById(db, result.lastInsertRowid)
}
