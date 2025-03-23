import { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './index'

export function setupItemsTable(db: DatabaseType): void {
  if (!tableExists(db, 'items')) {
    const createTable = `CREATE TABLE IF NOT EXISTS items(
        'id' INTEGER PRIMARY KEY,
        'name' TEXT,
        'description' TEXT,
        'barcode' TEXT,
        'unit' TEXT,
        'cost' REAL,
        'price' REAL,
        'tax' REAL,
        'image' TEXT DEFAULT '',
        'categoryId' INTEGER,
        'supplierId' INTEGER,
        'deleted' INTEGER DEFAULT 0,
        FOREIGN KEY('categoryId') REFERENCES 'categories'('id'),
        FOREIGN KEY('supplierId') REFERENCES 'suppliers'('id')
        
    );`

    db.exec(createTable)

    db.exec('CREATE UNIQUE INDEX idx_items_id ON items (id);')
    db.exec('CREATE UNIQUE INDEX idx_items_barcode ON items (barcode);')
    db.exec('CREATE INDEX idx_items_name ON items (name);')
    db.exec('CREATE INDEX idx_items_deleted ON items (deleted);')
  }
}

export function getAllItems(db: DatabaseType): [Item] {
  return db
    .prepare(
      'SELECT id,name,description,barcode,unit,cost,price,tax,image,categoryId,supplierId FROM items WHERE deleted = 0'
    )
    .all() as [Item]
}

export function getAllDeletedItems(db: DatabaseType): [Item] {
  return db
    .prepare(
      'SELECT id,name,description,barcode,unit,cost,price,tax,image,categoryId,supplierId FROM items WHERE deleted = 1'
    )
    .all() as [Item]
}

export function getItemById(db: DatabaseType, id: number): Item {
  return db
    .prepare(
      'SELECT id,name,description,barcode,unit,cost,price,tax,image,categoryId,supplierId FROM items WHERE id = ?'
    )
    .get(id) as Item
}

export function getItemByBarcode(db: DatabaseType, barcode: string): Item {
  return db
    .prepare(
      'SELECT id,name,description,barcode,unit,cost,price,tax,image,categoryId,supplierId FROM items WHERE barcode = ?'
    )
    .get(barcode) as Item
}

export function getItemsByName(db: DatabaseType, name: string): [Item] {
  return db
    .prepare(
      'SELECT id,name,description,barcode,unit,cost,price,tax,image,categoryId,supplierId FROM items WHERE name = ?'
    )
    .get(name) as [Item]
}

export function addItem(db: DatabaseType, item: Item): void {
  db.prepare(
    'INSERT INTO items (name,description,barcode,unit,cost,price,tax,image,categoryId,supplierId) VALUES (@name,@description,@barcode,@unit,@cost,@price,@tax,@image,@categoryId,@supplierId)'
  ).run(item)
}

export function updateItem(db: DatabaseType, id: number, item: Partial<Item>): void {
  const fields = Object.keys(item)
    .map((key) => `${key} = ?`)
    .join(', ')
  const values = Object.values(item)
  values.push(id)

  const updateItem = db.prepare(`UPDATE items SET ${fields} WHERE id = ?`)
  updateItem.run(...values)
}

export function deleteItem(db: DatabaseType, id: number): void {
  db.prepare('UPDATE items SET deleted = 1 WHERE id = ?;').run(id)
}
