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
