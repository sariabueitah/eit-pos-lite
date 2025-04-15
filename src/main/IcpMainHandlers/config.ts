import { Database as DataBaseType } from 'better-sqlite3'
import { ipcMain } from 'electron'
import { getAllConfig, getConfigByName, updateConfigByName } from '../db/config'

export function configHandlers(db: DataBaseType): void {
  ipcMain.handle('getAllConfig', () => {
    return getAllConfig(db)
  })
  ipcMain.handle('getConfigByName', (_, name: string) => {
    return getConfigByName(db, name)
  })
  ipcMain.handle('updateConfigByName', (_, data: [{ name: string; value: string }]) => {
    for (let i = 0; i < data.length; i++) {
      updateConfigByName(db, data[i].name, data[i].value)
    }
    return getAllConfig(db)
  })
}
