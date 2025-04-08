import { ipcMain } from 'electron'
import { Database as DatabaseType } from 'better-sqlite3'
import {
  getAllUsers,
  getUserById,
  getUserByUserName,
  addUser,
  updateUser,
  deleteUser
} from '../db/users'
import { hashPasswordSync } from '../bcrypt'

export function userHandlers(db: DatabaseType): void {
  ipcMain.handle('getAllUsers', () => {
    return getAllUsers(db)
  })

  ipcMain.handle('getUserById', (_, id: number) => {
    return getUserById(db, id)
  })

  ipcMain.handle('getUserByUserName', (_, userName: string) => {
    return getUserByUserName(db, userName)
  })

  ipcMain.handle('addUser', (_, user: User) => {
    if (user.password) {
      user.password = hashPasswordSync(user.password)
    }
    return addUser(db, user)
  })

  ipcMain.handle('updateUser', (_, id: number, user: Partial<User>) => {
    if (user.password) {
      user.password = hashPasswordSync(user.password)
    }
    return updateUser(db, id, user)
  })

  ipcMain.handle('deleteUser', (_, id: number) => {
    return deleteUser(db, id)
  })
}
