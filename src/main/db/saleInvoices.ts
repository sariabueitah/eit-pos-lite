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
        FOREIGN KEY('userId') REFERENCES 'users'('id')
    );`

    db.exec(createTable)

    db.exec('CREATE UNIQUE INDEX idx_sale_invoices_id ON sale_invoices (id);')
    db.exec('CREATE INDEX idx_sale_invoices_customer ON sale_invoices (customer);')
    db.exec('CREATE INDEX idx_sale_invoices_date ON sale_invoices (date);')
    db.exec('CREATE INDEX idx_sale_invoices_status ON sale_invoices (status);')
    db.exec('CREATE INDEX idx_sale_invoices_userId ON sale_invoices (userId);')
  }
}

export function getAllSaleInvoices(db: DatabaseType): SaleInvoice[] {
  return db
    .prepare(
      'SELECT s.*, u.userName FROM sale_invoices s INNER JOIN users u ON s.userId = u.id ORDER BY s.date DESC'
    )
    .all() as SaleInvoice[]
}

export function getSaleInvoiceById(db: DatabaseType, id: number | bigint): SaleInvoice {
  return db.prepare('SELECT * FROM sale_invoices WHERE id = ?').get(id) as SaleInvoice
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

export function searchSaleInvoices(
  db: DatabaseType,
  search: string,
  status: string,
  dateFrom: string,
  dateTo: string
): SaleInvoice[] {
  const query = 'SELECT s.*, u.userName FROM sale_invoices s INNER JOIN users u ON s.userId = u.id'
  let whereClause = ' WHERE 1 = 1 '

  switch (status) {
    case 'PAID':
      whereClause += " AND s.status = 'PAID' "
      break
    case 'CANCELLED':
      whereClause += " AND s.status = 'CANCELLED' "
      break
  }

  if (dateFrom) {
    whereClause += ` AND s.date >= ${new Date(dateFrom).getTime()} `
  }

  if (dateTo) {
    const dateToFix = new Date(dateTo).getTime() + 86340000
    whereClause += ` AND s.date <= ${dateToFix} `
  }

  let searchArray = search.split(/(\s+)/).filter(function (e) {
    return e.trim().length > 0
  })

  if (searchArray.length == 0) {
    return db.prepare(query + whereClause + ' ORDER BY s.date DESC').all() as [SaleInvoice]
  } else {
    searchArray = searchArray.map(function (e) {
      return '%' + e + '%'
    })

    whereClause += ' AND '

    for (let i = 0; i < searchArray.length; i++) {
      whereClause += `(s.id LIKE @${i} OR s.customer LIKE @${i})`
      if (i < searchArray.length - 1) {
        whereClause += ' AND '
      }
    }
    const searchObj = Object.assign({}, searchArray)
    return db.prepare(query + whereClause + ' ORDER BY s.date DESC').all(searchObj) as [SaleInvoice]
  }
}
