import { Database as DataBaseType } from 'better-sqlite3'
import { ipcMain } from 'electron'
import {
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  addCategory,
  updateCategory,
  deleteCategory,
  searchCategories
} from '../db/categories'

export function categoriesHandlers(db: DataBaseType): void {
  ipcMain.handle('getAllCategories', () => {
    return getAllCategories(db)
  })
  ipcMain.handle('getCategoryById', (_, id: number) => {
    return getCategoryById(db, id)
  })
  ipcMain.handle('getCategoryByName', (_, name: string) => {
    return getCategoryByName(db, name)
  })
  ipcMain.handle('addCategory', (_, category: Category) => {
    return addCategory(db, category)
  })
  ipcMain.handle('updateCategory', (_, id: number, category: Partial<Category>) => {
    return updateCategory(db, id, category)
  })
  ipcMain.handle('deleteCategory', (_, id: number) => {
    return deleteCategory(db, id)
  })
  ipcMain.handle('searchCategories', (_, search: string, status: string) => {
    return searchCategories(db, search, status)
  })
}
