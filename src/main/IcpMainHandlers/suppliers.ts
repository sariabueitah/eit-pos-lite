import { Database as DatabaseType } from 'better-sqlite3'
import { ipcMain } from 'electron'
import {
  getAllSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier
} from '../db/suppliers'

export function suppliersHandlers(db: DatabaseType): void {
  ipcMain.handle('getAllSuppliers', () => {
    return getAllSuppliers(db)
  })

  ipcMain.handle('getSupplierById', (_, id: number) => {
    return getSupplierById(db, id)
  })

  ipcMain.handle('addSupplier', (_, supplier: Supplier) => {
    return addSupplier(db, supplier)
  })
  ipcMain.handle('updateSupplier', (_, id: number, supplier: Partial<Supplier>) => {
    return updateSupplier(db, id, supplier)
  })
  ipcMain.handle('deleteSupplier', (_, id: number) => {
    return deleteSupplier(db, id)
  })
}
