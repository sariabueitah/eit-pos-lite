import { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './index'

export function setupConfigTable(db: DatabaseType): void {
  if (!tableExists(db, 'config')) {
    const createTable = `CREATE TABLE IF NOT EXISTS config(
            'id' INTEGER PRIMARY KEY,
            'name' TEXT,
            'value' TEXT
          );`

    db.exec(createTable)

    db.exec('CREATE UNIQUE INDEX idx_config_id ON config (id);')
    db.exec('CREATE UNIQUE INDEX idx_config_name ON config (name);')

    const inserConfig = db.prepare('INSERT INTO config (name, value) VALUES (:name, :value);')

    const defualtUsers = [
      {
        name: 'name',
        value: 'Company Name'
      },
      {
        name: 'email',
        value: 'info@companyname.com'
      },
      {
        name: 'address',
        value: '123 Business Avenue'
      },
      {
        name: 'phoneNumber',
        value: '(123) 456-7890'
      },
      {
        name: 'taxId',
        value: '123123'
      },
      {
        name: 'printer',
        value: ''
      },
      {
        name: 'printSize',
        value: 'A4'
      }
    ]

    defualtUsers.forEach((element) => {
      inserConfig.run(element)
    })
  }
}

export function getAllConfig(db: DatabaseType): Config[] {
  return db.prepare('SELECT * FROM config').all() as Config[]
}
export function getConfigByName(db: DatabaseType, name: string): Config {
  return db.prepare('SELECT * FROM config WHERE name = ?').get(name) as Config
}

export function updateConfigByName(db: DatabaseType, name: string, value: string): Config {
  db.prepare(`UPDATE config SET value = :value WHERE name = :name`).run({
    value: value,
    name: name
  })
  return getConfigByName(db, name)
}
