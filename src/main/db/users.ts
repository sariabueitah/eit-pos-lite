import { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './main'

export function setupUsersTable(db: DatabaseType): void {
  if (!tableExists(db, 'users')) {
    const createTable = `CREATE TABLE IF NOT EXISTS users(
        'id' INTEGER PRIMARY KEY,
        'name' TEXT,
        'user_name' TEXT,
        'password' TEXT,
        'phone_number' TEXT,
        'role' TEXT
      );`

    db.exec(createTable)

    db.exec('CREATE UNIQUE INDEX idx_users_id ON users (id);')
    db.exec('CREATE UNIQUE INDEX idx_users_user_name ON users (user_name);')

    const inserUsers = db.prepare(
      'INSERT INTO users (name, user_name, password, phone_number,role) VALUES (:name,:user_name,:password,:phone_number,:role);'
    )

    const defualtUsers = [
      {
        name: 'admin',
        user_name: 'admin',
        password: 'Admin#1',
        phone_number: '000000000',
        role: 'ADMIN'
      },
      {
        name: 'user1',
        user_name: 'user1',
        password: 'User#1',
        phone_number: '000000000',
        role: 'USER'
      }
    ]

    defualtUsers.forEach((element) => {
      inserUsers.run(element)
    })
  }
}

export function getAllUsers(db: DatabaseType): [User] {
  return db.prepare('SELECT id,name,user_name,phone_number,role FROM users').all() as [User]
}

export function getUserbyId(db: DatabaseType, id: number): unknown {
  return db.prepare('SELECT id,name,user_name,phone_number,role FROM users WHERE id = ?').get(id)
}

export function getUserbyUserName(db: DatabaseType, user_name: string): unknown {
  return db
    .prepare('SELECT id,name,user_name,phone_number,role FROM users WHERE user_name = ?')
    .get(user_name)
}

export function authenticateUser(db: DatabaseType, user_name: string, password: string): unknown {
  //return true or false instead
  return db
    .prepare('SELECT * FROM users WHERE user_name = ? AND password = ?')
    .get([user_name, password])
}

export function createUser(db: DatabaseType, user: User): void {
  const insertUser = db.prepare(
    'INSERT INTO users (name, user_name, password, phone_number, role) VALUES (?, ?, ?, ?, ?)'
  )
  insertUser.run(user.name, user.user_name, user.password, user.phone_number, user.role)
}

export function updateUser(db: DatabaseType, id: number, user: Partial<User>): void {
  const fields = Object.keys(user)
    .map((key) => `${key} = ?`)
    .join(', ')
  const values = Object.values(user)
  values.push(id)

  const updateUser = db.prepare(`UPDATE users SET ${fields} WHERE id = ?`)
  updateUser.run(...values)
}

export function deleteUser(db: DatabaseType, id: number): void {
  const deleteUser = db.prepare('DELETE FROM users WHERE id = ?')
  deleteUser.run(id)
}
