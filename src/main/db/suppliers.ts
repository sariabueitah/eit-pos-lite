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
  return db
    .prepare('SELECT id,name,phoneNumber,taxNumber FROM suppliers WHERE deleted = 0')
    .all() as [Supplier]
}

export function getAllDeletedSuppliers(db: DatabaseType): [Supplier] {
  return db
    .prepare('SELECT id,name,phoneNumber,taxNumber FROM suppliers WHERE deleted = 1')
    .all() as [Supplier]
}

export function getSupplierById(db: DatabaseType, id: number): Supplier {
  return db
    .prepare('SELECT id,name,phoneNumber,taxNumber FROM suppliers WHERE id = ?')
    .get(id) as Supplier
}

export function getSupplierByName(db: DatabaseType, name: string): Supplier {
  return db
    .prepare('SELECT id,name,phoneNumber,taxNumber FROM suppliers WHERE name = ?')
    .get(name) as Supplier
}

export function addSupplier(db: DatabaseType, supplier: Supplier): void {
  db.prepare(
    'INSERT INTO suppliers (name, phoneNumber,taxNumber) VALUES (:name,:phoneNumber,:taxNumber);'
  ).run(supplier)
}

export function updateSupplier(db: DatabaseType, id: number, supplier: Partial<Supplier>): void {
  const fields = Object.keys(supplier)
    .map((key) => `${key} = ?`)
    .join(', ')
  const values = Object.values(supplier)
  values.push(id)

  const updateSupplier = db.prepare(`UPDATE suppliers SET ${fields} WHERE id = ?`)
  updateSupplier.run(...values)
}

export function deleteSupplier(db: DatabaseType, id: number): void {
  db.prepare('UPDATE suppliers SET deleted = 1 WHERE id = ?;').run(id)
}
