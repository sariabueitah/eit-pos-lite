import { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './index'

export function setupCategoriesTable(db: DatabaseType): void {
  if (!tableExists(db, 'categories')) {
    const createTable = `CREATE TABLE IF NOT EXISTS categories(
        'id' INTEGER PRIMARY KEY,
        'name' TEXT,
        'deleted' INTEGER DEFAULT 0
      );`

    db.exec(createTable)

    db.exec('CREATE UNIQUE INDEX idx_categories_id ON categories (id);')
    db.exec('CREATE UNIQUE INDEX idx_categories_name ON categories (name);')
    db.exec('CREATE INDEX idx_categories_deleted ON categories (deleted);')

    const inserCategory = db.prepare('INSERT INTO categories (name) VALUES (:name);')

    const defualtUsers = [
      {
        name: 'General'
      }
    ]

    defualtUsers.forEach((element) => {
      inserCategory.run(element)
    })
  }
}

export function getAllCategories(db: DatabaseType): [Category] {
  return db.prepare('SELECT id, name FROM categories where deleted = 0').all() as [Category]
}

export function getAllDeletedCategories(db: DatabaseType): [Category] {
  return db.prepare('SELECT id, name FROM categories where deleted = 1').all() as [Category]
}

export function getCategoryById(db: DatabaseType, id: number): Category {
  return db.prepare('SELECT id, name FROM categories WHERE id = ?').get(id) as Category
}

export function getCategoryByName(db: DatabaseType, name: string): Category {
  return db.prepare('SELECT id, name FROM categories WHERE name = ?').get(name) as Category
}

export function addCategory(db: DatabaseType, category: Category): void {
  db.prepare('INSERT INTO categories (name) VALUES (:name);').run(category)
}

export function updateCategory(db: DatabaseType, id: number, category: Partial<Category>): void {
  const fields = Object.keys(category)
    .map((key) => `${key} = ?`)
    .join(', ')
  const values = Object.values(category)
  values.push(id)

  const updateCategory = db.prepare(`UPDATE categories SET ${fields} WHERE id = ?`)
  updateCategory.run(...values)
}

export function deleteCategory(db: DatabaseType, id: number): void {
  db.prepare('UPDATE categories SET deleted = 1 WHERE id = ?;').run(id)
}
