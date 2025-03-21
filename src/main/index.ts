import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { setupDB } from '../main/db/main'
import {
  getAllUsers,
  getUserbyId,
  getUserbyUserName,
  authenticateUser,
  createUser,
  updateUser,
  deleteUser
} from '../main/db/users'
import {
  getAllItems,
  getItemByBarcode,
  getItemById,
  getItemByName,
  insertItem,
  updateItem,
  deleteItem
} from './db/items'

let db
let session

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  //setup on Start db operations
  db = setupDB()
  //setup session
  session = undefined
  mainWindow.webContents.send('userSession', undefined)
  //create a session for users

  ipcMain.handle('login', (_, loginData) => {
    let success = false
    const authUser = authenticateUser(db, loginData.user_name, loginData.password)
    if (authUser !== undefined) {
      session = authUser
      mainWindow.webContents.send('userSession', authUser)
      success = true
    }
    return success
  })

  ipcMain.handle('logout', () => {
    session = undefined
    mainWindow.webContents.send('userSession', undefined)
    return true
  })

  ipcMain.handle('getSession', () => {
    return session
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('getAllUsers', () => {
  return getAllUsers(db)
})

ipcMain.handle('getUserbyId', (_, id) => {
  return getUserbyId(db, id)
})

ipcMain.handle('getUserbyUserName', (_, user_name) => {
  return getUserbyUserName(db, user_name)
})

ipcMain.handle('createUser', (_, user) => {
  return createUser(db, user)
})

ipcMain.handle('updateUser', (_, id, user) => {
  return updateUser(db, id, user)
})

ipcMain.handle('deleteUser', (_, id) => {
  return deleteUser(db, id)
})

ipcMain.handle('getAllItems', () => {
  return getAllItems(db)
})

ipcMain.handle('getItemById', (_, id) => {
  return getItemById(db, id)
})

ipcMain.handle('getItemByBarcode', (_, barcode) => {
  return getItemByBarcode(db, barcode)
})

ipcMain.handle('getItemByName', (_, name) => {
  return getItemByName(db, name)
})

ipcMain.handle('insertItem', (_, item) => {
  return insertItem(db, item)
})

ipcMain.handle('updateItem', (_, id, item) => {
  return updateItem(db, id, item)
})

ipcMain.handle('deleteItem', (_, id) => {
  return deleteItem(db, id)
})
