import { ipcMain } from 'electron'
import { Database as DatabaseType } from 'better-sqlite3'
import {
  getAllItems,
  getItemByBarcode,
  getItemById,
  addItem,
  updateItem,
  deleteItem
} from '../db/items'

export function itemHandlers(db: DatabaseType): void {
  ipcMain.handle('getAllItems', () => {
    return getAllItems(db)
  })

  ipcMain.handle('getItemById', (_, id: number) => {
    return getItemById(db, id)
  })

  ipcMain.handle('getItemByBarcode', (_, barcode: string) => {
    return getItemByBarcode(db, barcode)
  })

  ipcMain.handle('addItem', (_, item: Item) => {
    return addItem(db, item)
  })

  ipcMain.handle('updateItem', (_, id: number, item: Partial<Item>) => {
    return updateItem(db, id, item)
  })

  ipcMain.handle('deleteItem', (_, id: number) => {
    return deleteItem(db, id)
  })
}
