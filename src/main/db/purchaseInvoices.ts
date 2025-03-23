import { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './index'

export function setupPurchaseInvoicesTable(db: DatabaseType): void {
  if (!tableExists(db, 'purchase_invoices')) {
    const createTable = `CREATE TABLE IF NOT EXISTS purchase_invoices(
        'id' INTEGER PRIMARY KEY,
        'supplierId' INTEGER,
        'date' TEXT,
        'status' TEXT,
        'paid' REAL,
        'deleted' INTEGER,
        FOREIGN KEY('supplierId') REFERENCES 'supplier'('id')
    );`

    db.exec(createTable)

    db.exec('CREATE UNIQUE INDEX idx_purchase_invoices_id ON purchase_invoices (id);')
    db.exec('CREATE INDEX idx_purchase_invoices_date ON purchase_invoices (date);')
    db.exec('CREATE INDEX idx_purchase_invoices_status ON purchase_invoices (status);')
    db.exec('CREATE INDEX idx_purchase_invoices_supplierId ON purchase_invoices (supplierId);')
    db.exec('CREATE INDEX idx_purchase_invoices_deleted ON purchase_invoices (deleted);')
  }
}

export function getAllPurchaseInvoices(db: DatabaseType): [PurchaseInvoice] {
  return db
    .prepare('SELECT id, supplierId, date, status, paid FROM purchase_invoices WHERE deleted = 0')
    .all() as [PurchaseInvoice]
}

export function getAllDeletedPurchaseInvoices(db: DatabaseType): [PurchaseInvoice] {
  return db
    .prepare('SELECT id, supplierId, date, status, paid FROM purchase_invoices WHERE deleted = 1')
    .all() as [PurchaseInvoice]
}

export function getPurchaseInvoiceById(db: DatabaseType, id: number): PurchaseInvoice {
  return db
    .prepare('SELECT id, supplierId, date, status, paid FROM purchase_invoices WHERE id = ?')
    .get(id) as PurchaseInvoice
}

export function addPurchaseInvoice(db: DatabaseType, purchaseInvoice: PurchaseInvoice): void {
  db.prepare(
    'INSERT INTO purchase_invoices (id, supplierId, date, status, paid) VALUES (:id, :supplierId, :date, :status, :paid);'
  ).run(purchaseInvoice)
}

export function updatePurchaseInvoice(
  db: DatabaseType,
  id: number,
  purchaseInvoice: Partial<PurchaseInvoice>
): void {
  const fields = Object.keys(purchaseInvoice)
    .map((key) => `${key} = ?`)
    .join(', ')
  const values = Object.values(purchaseInvoice)
  values.push(id)

  const updatePurchaseInvoice = db.prepare(`UPDATE purchase_invoices SET ${fields} WHERE id = ?`)
  updatePurchaseInvoice.run(...values)
}

export function deletePurchaseInvoice(db: DatabaseType, id: number): void {
  db.prepare('UPDATE purchase_invoices SET deleted = 1 WHERE id = ?;').run(id)
}
