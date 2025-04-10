import Database, { Database as DatabaseType } from 'better-sqlite3'
import { tableExists } from './index'
import { hashPasswordSync, compareHashSync } from '../bcrypt'

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
        password: hashPasswordSync('Admin#1'),
        phoneNumber: '0000000000',
        role: 'ADMIN'
      },
      {
        name: 'user1',
        userName: 'user1',
        password: hashPasswordSync('User#1'),
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

export function getUserById(db: DatabaseType, id: number | bigint): User {
  return db
    .prepare('SELECT id,name,userName,phoneNumber,role FROM users WHERE id = ?')
    .get(id) as User
}

export function getUserByUserName(db: DatabaseType, userName: string): User {
  return db
    .prepare('SELECT id,name,userName,phoneNumber,role FROM users WHERE userName = ?')
    .get(userName) as User
}

export function authenticateUser(
  db: DatabaseType,
  userName: string,
  password: string
): Session | undefined {
  const user = db
    .prepare('SELECT id,name,userName,role,password FROM users WHERE userName = ? AND deleted = 0')
    .get([userName]) as Partial<User>

  if (compareHashSync(password, user.password)) {
    delete user['password']
    return user as Session
  } else {
    return undefined
  }
}

export function addUser(db: DatabaseType, user: User): User {
  Object.keys(user).forEach(
    (k) => (user[k] = typeof user[k] == 'string' ? user[k].trim() : user[k])
  )
  const result = db
    .prepare(
      'INSERT INTO users (name, userName, password, phoneNumber, role) VALUES (:name, :userName, :password, :phoneNumber, :role)'
    )
    .run(user)

  return getUserById(db, result.lastInsertRowid)
}

export function updateUser(db: DatabaseType, id: number, user: Partial<User>): User {
  Object.keys(user).forEach(
    (k) => (user[k] = typeof user[k] == 'string' ? user[k].trim() : user[k])
  )
  const fields = Object.keys(user)
    .map((key) => `${key} = ?`)
    .join(', ')
  const values = Object.values(user)
  values.push(id)

  const result = db.prepare(`UPDATE users SET ${fields} WHERE id = ?`).run(...values)
  return getUserById(db, result.lastInsertRowid)
}

export function deleteUser(db: DatabaseType, id: number): Database.RunResult {
  return db.prepare('UPDATE users SET deleted = 1 WHERE id = ?;').run(id)
}

export function searchUsers(db: DatabaseType, search: string, status: string): [User] {
  let query = 'SELECT id,name, userName, password, phoneNumber, role FROM users'

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
    return db.prepare(query).all() as [User]
  }

  if (searchArray.length > 0 && status == 'ALL') {
    query += ' WHERE '
  }

  for (let i = 0; i < searchArray.length; i++) {
    query += `(phoneNumber LIKE @${i} OR userName LIKE @${i} OR name LIKE @${i} OR id LIKE @${i})`
    if (i < searchArray.length - 1) {
      query += ' AND '
    }
  }

  const searchObj = Object.assign({}, searchArray)

  return db.prepare(query).all(searchObj) as [User]
}
