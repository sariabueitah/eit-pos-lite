import { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './index'

export function setupUsersTable(db: DatabaseType): void {
  if (!tableExists(db, 'users')) {
    const createTable = `CREATE TABLE IF NOT EXISTS users(
        'id' INTEGER PRIMARY KEY,
        'name' TEXT,
        'userName' TEXT,
        'password' TEXT,
        'phoneNumber' TEXT,
        'role' TEXT,
        'deleted' INTEGER DEFAULT 0
      );`

    db.exec(createTable)

    db.exec('CREATE UNIQUE INDEX idx_users_id ON users (id);')
    db.exec('CREATE UNIQUE INDEX idx_users_userName ON users (userName);')
    db.exec('CREATE INDEX idx_users_deleted ON users (deleted);')

    const inserUsers = db.prepare(
      'INSERT INTO users (name, userName, password, phoneNumber,role) VALUES (:name,:userName,:password,:phoneNumber,:role);'
    )

    const defualtUsers = [
      {
        name: 'admin',
        userName: 'admin',
        password: 'Admin#1',
        phoneNumber: '0000000000',
        role: 'ADMIN'
      },
      {
        name: 'user1',
        userName: 'user1',
        password: 'User#1',
        phoneNumber: '0000000000',
        role: 'USER'
      }
    ]

    defualtUsers.forEach((element) => {
      inserUsers.run(element)
    })
  }
}

export function getAllUsers(db: DatabaseType): [User] {
  return db
    .prepare('SELECT id,name,userName,phoneNumber,role FROM users WHERE deleted = 0')
    .all() as [User]
}

export function getAllDeletedUsers(db: DatabaseType): [User] {
  return db
    .prepare('SELECT id,name,userName,phoneNumber,role FROM users WHERE deleted = 1')
    .all() as [User]
}

export function getUserById(db: DatabaseType, id: number): User {
  return db
    .prepare('SELECT id,name,userName,phoneNumber,role FROM users WHERE id = ?')
    .get(id) as User
}

export function getUserByUserName(db: DatabaseType, userName: string): User {
  return db
    .prepare('SELECT id,name,userName,phoneNumber,role FROM users WHERE userName = ?')
    .get(userName) as User
}

export function authenticateUser(db: DatabaseType, userName: string, password: string): Session {
  return db
    .prepare(
      'SELECT id,name,userName,role FROM users WHERE userName = ? AND password = ? AND deleted = 0'
    )
    .get([userName, password]) as Session
}

export function addUser(db: DatabaseType, user: User): void {
  const insertUser = db.prepare(
    'INSERT INTO users (name, userName, password, phoneNumber, role) VALUES (?, ?, ?, ?, ?)'
  )
  insertUser.run(user.name, user.userName, user.password, user.phoneNumber, user.role)
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
  db.prepare('UPDATE users SET deleted = 1 WHERE id = ?;').run(id)
}
