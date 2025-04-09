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
        'discount' REAL DEFAULT 0,
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
      'INSERT INTO items (name,description,barcode,unit,cost,price,discount,tax,categoryId,supplierId) VALUES (:name,:description,:barcode,:unit,:cost,:price,:discount,:tax,:categoryId,:supplierId);'
    )

    const defualtUsers = [
      {
        name: 'coca cola',
        description: 'coca cola',
        barcode: '1',
        unit: 'Units',
        cost: 0.24,
        price: 0.25,
        discount: 0,
        tax: 0,
        categoryId: 1,
        supplierId: 1
      },
      {
        name: 'choco break',
        description: 'choco break',
        barcode: '2',
        unit: 'Units',
        cost: 0.09,
        price: 0.1,
        discount: 0,
        tax: 0,
        categoryId: 1,
        supplierId: 1
      },
      {
        name: 'pepsi',
        description: 'pepsi',
        barcode: '3',
        unit: 'Units',
        cost: 0.24,
        price: 0.25,
        discount: 0,
        tax: 0,
        categoryId: 1,
        supplierId: 1
      },
      {
        name: 'ice tea',
        description: 'ice tea',
        barcode: '4',
        unit: 'Units',
        cost: 0.4,
        price: 0.5,
        discount: 0,
        tax: 0,
        categoryId: 1,
        supplierId: 1
      },
      {
        name: 'mr chips',
        description: 'chips',
        barcode: '5',
        unit: 'Units',
        cost: 0.4,
        price: 0.5,
        discount: 0,
        tax: 16,
        categoryId: 1,
        supplierId: 1
      },
      {
        name: 'nescafe',
        description: 'nescafe',
        barcode: '6',
        unit: 'Units',
        cost: 3.5,
        price: 3.7,
        discount: 0,
        tax: 16,
        categoryId: 1,
        supplierId: 1
      },
      {
        name: 'yogart',
        description: 'yogart',
        barcode: '7',
        unit: 'Units',
        cost: 0.9,
        price: 1,
        discount: 0,
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
  return db.prepare('SELECT * FROM items WHERE deleted = 0').all() as [Item]
}

export function getItemById(db: DatabaseType, id: number | bigint): Item {
  return db.prepare('SELECT * FROM items WHERE deleted = 0 AND id = ?').get(id) as Item
}

export function getItemByBarcode(db: DatabaseType, barcode: string): Item {
  return db.prepare('SELECT * FROM items WHERE deleted = 0 AND barcode = ?').get(barcode) as Item
}

export function getItemByName(db: DatabaseType, name: string): [Item] {
  return db.prepare('SELECT * FROM items WHERE deleted = 0 AND name = ?').all('%' + name + '%') as [
    Item
  ]
}

export function addItem(db: DatabaseType, item: Item): Item {
  const result = db
    .prepare(
      'INSERT INTO items (name,description,barcode,unit,cost,price,discount,tax,image,categoryId,supplierId) VALUES (@name,@description,@barcode,@unit,@cost,@price,@discount,@tax,@image,@categoryId,@supplierId)'
    )
    .run(item)
  return getItemById(db, result.lastInsertRowid)
}

export function updateItem(db: DatabaseType, id: number, item: Partial<Item>): Item {
  const fields = Object.keys(item)
    .map((key) => `${key} = ?`)
    .join(', ')
  const values = Object.values(item)
  values.push(id)

  const result = db.prepare(`UPDATE items SET ${fields} WHERE id = ?`).run(...values)
  return getItemById(db, result.lastInsertRowid)
}

export function deleteItem(db: DatabaseType, id: number): void {
  db.prepare('UPDATE items SET deleted = 1 WHERE id = ?;').run(id)
}
