import { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './index'

export function setupPurchaseInvoicesTable(db: DatabaseType): void {
  if (!tableExists(db, 'purchase_invoices')) {
    const createTable = `CREATE TABLE IF NOT EXISTS purchase_invoices(
        'id' INTEGER PRIMARY KEY,
        'supplierId' INTEGER,
        'date' INTEGER,
        'status' TEXT,
        'paid' REAL,
        'deleted' INTEGER DEFAULT 0,
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
