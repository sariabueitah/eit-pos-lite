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
        'totalPrice' REAL,
        'invoiceNumber' TEXT,
        'deleted' INTEGER DEFAULT 0,
        FOREIGN KEY('supplierId') REFERENCES 'suppliers'('id')
    );`

    db.exec(createTable)

    db.exec('CREATE UNIQUE INDEX idx_purchase_invoices_id ON purchase_invoices (id);')
    db.exec('CREATE INDEX idx_purchase_invoices_date ON purchase_invoices (date);')
    db.exec('CREATE INDEX idx_purchase_invoices_status ON purchase_invoices (status);')
    db.exec('CREATE INDEX idx_purchase_invoices_supplierId ON purchase_invoices (supplierId);')
    db.exec('CREATE INDEX idx_purchase_invoices_deleted ON purchase_invoices (deleted);')
  }
}

export function getAllPurchaseInvoices(db: DatabaseType): PurchaseInvoice[] {
  return db
    .prepare(
      'SELECT p.*, s.name FROM purchase_invoices p INNER JOIN suppliers s ON s.id = p.supplierId ORDER BY p.date DESC'
    )
    .all() as PurchaseInvoice[]
}

export function getPurchaseInvoiceById(db: DatabaseType, id: number | bigint): PurchaseInvoice {
  return db
    .prepare(
      'SELECT p.*, s.name FROM purchase_invoices p INNER JOIN suppliers s ON s.id = p.supplierId WHERE p.id = ?'
    )
    .get(id) as PurchaseInvoice
}

export function addPurchaseInvoice(
  db: DatabaseType,
  purchaseInvoice: PurchaseInvoice
): PurchaseInvoice {
  Object.keys(purchaseInvoice).forEach(
    (k) =>
      (purchaseInvoice[k] =
        typeof purchaseInvoice[k] == 'string' ? purchaseInvoice[k].trim() : purchaseInvoice[k])
  )
  const result = db
    .prepare(
      'INSERT INTO purchase_invoices (supplierId,date,status,paid,totalPrice,invoiceNumber) VALUES (:supplierId,:date,:status,:paid,:totalPrice,:invoiceNumber);'
    )
    .run(purchaseInvoice)
  return getPurchaseInvoiceById(db, result.lastInsertRowid)
}

export function searchPurchaseInvoices(
  db: DatabaseType,
  search: string,
  status: string,
  dateFrom: string,
  dateTo: string
): PurchaseInvoice[] {
  const query =
    'SELECT p.*, s.name FROM purchase_invoices p INNER JOIN suppliers s ON s.id = p.supplierId'
  let whereClause = ' WHERE 1 = 1 '

  switch (status) {
    case 'PAID':
      whereClause += " AND p.status = 'PAID' "
      break
    case 'UNPAID':
      whereClause += " AND p.status = 'UNPAID' "
      break
  }

  if (dateFrom) {
    whereClause += ` AND p.date >= ${new Date(dateFrom).getTime()} `
  }

  if (dateTo) {
    const dateToFix = new Date(dateTo).getTime() + 86340000
    whereClause += ` AND p.date <= ${dateToFix} `
  }

  let searchArray = search.split(/(\s+)/).filter(function (e) {
    return e.trim().length > 0
  })

  if (searchArray.length == 0) {
    return db.prepare(query + whereClause + ' ORDER BY p.date DESC').all() as [PurchaseInvoice]
  } else {
    searchArray = searchArray.map(function (e) {
      return '%' + e + '%'
    })

    whereClause += ' AND '

    for (let i = 0; i < searchArray.length; i++) {
      whereClause += `(p.id LIKE @${i} OR s.name LIKE @${i})`
      if (i < searchArray.length - 1) {
        whereClause += ' AND '
      }
    }
    const searchObj = Object.assign({}, searchArray)
    return db.prepare(query + whereClause + ' ORDER BY p.date DESC').all(searchObj) as [
      PurchaseInvoice
    ]
  }
}
