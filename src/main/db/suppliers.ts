import { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './index'

export function setupSuppliersTable(db: DatabaseType): void {
  if (!tableExists(db, 'suppliers')) {
    const createTable = `CREATE TABLE IF NOT EXISTS suppliers(
        'id' INTEGER PRIMARY KEY,
        'name' TEXT,
        'phoneNumber' TEXT,
        'taxNumber' TEXT,
        'deleted' INTEGER DEFAULT 0
      );`

    db.exec(createTable)

    db.exec('CREATE UNIQUE INDEX idx_suppliers_id ON suppliers (id);')
    db.exec('CREATE UNIQUE INDEX idx_suppliers_name ON suppliers (name);')
    db.exec('CREATE UNIQUE INDEX idx_suppliers_taxNumber ON suppliers (taxNumber);')
    db.exec('CREATE INDEX idx_suppliers_deleted ON suppliers (deleted);')

    const inserSupplier = db.prepare(
      'INSERT INTO suppliers (name, phoneNumber, taxNumber) VALUES (:name,:phoneNumber,:taxNumber);'
    )

    const defualtUsers = [
      {
        name: 'General Supplier',
        phoneNumber: '0000000000',
        taxNumber: '0000000000'
      }
    ]

    defualtUsers.forEach((element) => {
      inserSupplier.run(element)
    })
  }
}

export function getAllSuppliers(db: DatabaseType): [Supplier] {
  return db.prepare('SELECT * FROM suppliers WHERE deleted = 0').all() as [Supplier]
}

export function getSupplierById(db: DatabaseType, id: number | bigint): Supplier {
  return db.prepare('SELECT * FROM suppliers WHERE id = ?').get(id) as Supplier
}

export function getSupplierByName(db: DatabaseType, name: string): Supplier {
  return db.prepare('SELECT * FROM suppliers WHERE name = ?').get(name) as Supplier
}

export function getSupplierByTaxNumber(db: DatabaseType, taxNumber: string): Supplier {
  return db.prepare('SELECT * FROM suppliers WHERE taxNumber = ?').get(taxNumber) as Supplier
}

export function addSupplier(db: DatabaseType, supplier: Supplier): Supplier {
  const result = db
    .prepare(
      'INSERT INTO suppliers (name, phoneNumber,taxNumber) VALUES (:name,:phoneNumber,:taxNumber);'
    )
    .run(supplier)

  return getSupplierById(db, result.lastInsertRowid)
}

export function updateSupplier(
  db: DatabaseType,
  id: number,
  supplier: Partial<Supplier>
): Supplier {
  const fields = Object.keys(supplier)
    .map((key) => `${key} = ?`)
    .join(', ')
  const values = Object.values(supplier)
  values.push(id)

  const result = db.prepare(`UPDATE suppliers SET ${fields} WHERE id = ?`).run(...values)
  return getSupplierById(db, result.lastInsertRowid)
}

export function deleteSupplier(db: DatabaseType, id: number): void {
  db.prepare('UPDATE suppliers SET deleted = 1 WHERE id = ?;').run(id)
}

export function searchSuppliers(db: DatabaseType, search: string, status: string): [Supplier] {
  let query = 'SELECT * FROM suppliers'

  switch (status) {
    case 'ACTIVE':
      query += ' WHERE deleted = 0'
      break
    case 'INACTIVE':
      query += ' WHERE deleted = 1'
      break
  }

  let searchArray = search.split(/(\s+)/).filter(function (e) {
    return e.trim().length > 0
  })

  searchArray = searchArray.map(function (e) {
    return '%' + e + '%'
  })

  if (searchArray.length == 0) {
    return db.prepare(query).all() as [Supplier]
  }

  if (searchArray.length > 0 && status == 'ALL') {
    query += ' WHERE '
  }

  for (let i = 0; i < searchArray.length; i++) {
    query += `(name LIKE @${i} OR phoneNumber LIKE @${i} OR taxNumber LIKE @${i} OR id LIKE @${i})`
    if (i < searchArray.length - 1) {
      query += ' AND '
    }
  }

  const searchObj = Object.assign({}, searchArray)

  return db.prepare(query).all(searchObj) as [Supplier]
}
