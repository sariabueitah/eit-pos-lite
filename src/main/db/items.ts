import { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './index'

export function setupItemsTable(db: DatabaseType): void {
  if (!tableExists(db, 'items')) {
    const createTable = `CREATE TABLE IF NOT EXISTS items(
        'id' INTEGER PRIMARY KEY,
        'name' TEXT,
        'description' TEXT DEFAULT '',
        'barcode' TEXT,
        'unit' TEXT,
        'cost' REAL,
        'price' REAL,
        'tax' REAL DEFAULT 0,
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

    const inserSupplier = db.prepare(
      'INSERT INTO items (name,description,barcode,unit,cost,price,tax,categoryId,supplierId) VALUES (:name,:description,:barcode,:unit,:cost,:price,:tax,:categoryId,:supplierId);'
    )

    const defualtUsers = [
      {
        name: 'coca cola',
        description: 'coca cola',
        barcode: '1',
        unit: 'UNIT',
        cost: 0.24,
        price: 0.25,
        tax: 0,
        categoryId: 1,
        supplierId: 1
      },
      {
        name: 'choco break',
        description: 'choco break',
        barcode: '2',
        unit: 'UNIT',
        cost: 0.09,
        price: 0.1,
        tax: 0,
        categoryId: 1,
        supplierId: 1
      },
      {
        name: 'pepsi',
        description: 'pepsi',
        barcode: '3',
        unit: 'UNIT',
        cost: 0.24,
        price: 0.25,
        tax: 0,
        categoryId: 1,
        supplierId: 1
      },
      {
        name: 'ice tea',
        description: 'ice tea',
        barcode: '4',
        unit: 'UNIT',
        cost: 0.4,
        price: 0.5,
        tax: 0,
        categoryId: 1,
        supplierId: 1
      },
      {
        name: 'mr chips',
        description: 'chips',
        barcode: '5',
        unit: 'UNIT',
        cost: 0.4,
        price: 0.5,
        tax: 16,
        categoryId: 1,
        supplierId: 1
      },
      {
        name: 'nescafe',
        description: 'nescafe',
        barcode: '6',
        unit: 'UNIT',
        cost: 3.5,
        price: 3.7,
        tax: 16,
        categoryId: 1,
        supplierId: 1
      },
      {
        name: 'yogart',
        description: 'yogart',
        barcode: '7',
        unit: 'UNIT',
        cost: 0.9,
        price: 1,
        tax: 7,
        categoryId: 1,
        supplierId: 1
      }
    ]

    defualtUsers.forEach((element) => {
      inserSupplier.run(element)
    })
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
      'SELECT id,name,description,barcode,unit,cost,price,tax,categoryId,supplierId FROM items WHERE name LIKE ?'
    )
    .all('%' + name + '%') as [Item]
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

export function searchItemById(db: DatabaseType, id: number): Item {
  return db
    .prepare(
      `
      SELECT id FROM items 
      WHERE deleted  = 0 AND id = ?
      `
    )
    .get(id) as Item
}

export function searchItemByBarcode(db: DatabaseType, barcode: string): Item {
  return db
    .prepare(
      `
      SELECT id FROM items
      WHERE deleted  = 0 AND barcode = ? 
      `
    )
    .get(barcode) as Item
}

export function searchItemByName(db: DatabaseType, name: string): [Item] {
  return db
    .prepare(
      `
      SELECT id, name FROM items
      WHERE deleted  = 0 AND name LIKE ?
      `
    )
    .all('%' + name + '%') as [Item]
}

export function getItemSaleById(db: DatabaseType, id: number): Item {
  return db
    .prepare(
      `
      SELECT i.id, i.barcode, i.name, c.name as category, i.price, i.unit, i.tax, i.cost FROM items i 
      INNER JOIN categories c ON i.categoryId = c.id
      WHERE i.deleted  = 0 AND  i.id = ?
      `
    )
    .get(id) as Item
}
