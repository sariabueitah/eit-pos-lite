import { ipcMain } from 'electron'
import { Database as DatabaseType } from 'better-sqlite3'
import {
  getAllUsers,
  getAllDeletedUsers,
  getUserbyId,
  getUserbyUserName,
  addUser,
  updateUser,
  deleteUser
} from '../db/users'

export function userHandlers(db: DatabaseType): void {
  ipcMain.handle('getAllUsers', () => {
    return getAllUsers(db)
  })

  ipcMain.handle('getAllDeletedUsers', () => {
    return getAllDeletedUsers(db)
  })

  ipcMain.handle('getUserbyId', (_, id: number) => {
    return getUserbyId(db, id)
  })

  ipcMain.handle('getUserbyUserName', (_, userName: string) => {
    return getUserbyUserName(db, userName)
  })

  ipcMain.handle('addUser', (_, user: User) => {
    return addUser(db, user)
  })

  ipcMain.handle('updateUser', (_, id: number, user: Partial<User>) => {
    return updateUser(db, id, user)
  })

  ipcMain.handle('deleteUser', (_, id: number) => {
    return deleteUser(db, id)
  })
}
