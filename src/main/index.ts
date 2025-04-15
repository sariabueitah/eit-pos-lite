import { app, shell, BrowserWindow, ipcMain, screen, dialog, nativeImage } from 'electron'
import { Database as DataBaseType } from 'better-sqlite3'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { setupDB } from './db'
import { authenticateUser } from './db/users'
import { defineIcpHandlers } from './IcpMainHandlers/index'
import fs from 'fs'

let db: DataBaseType
let session: Session | null

function createWindow(): void {
  // Create the browser window.
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
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
  session = null
  mainWindow.webContents.send('userSession', null)

  ipcMain.handle('login', (_, { userName, password }) => {
    const user = authenticateUser(db, userName, password)
    if (user === undefined) return false
    session = user
    mainWindow.webContents.send('userSession', user)
    return true
  })

  ipcMain.handle('logout', () => {
    session = null
    mainWindow.webContents.send('userSession', null)
    return true
  })

  ipcMain.handle('getSession', () => session)

  defineIcpHandlers(db)
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
  app.quit()
})

ipcMain.on('changeLogo', (event) => {
  const result = dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }]
  })

  result.then(({ canceled, filePaths }) => {
    if (canceled) return
    let imagePath = path.join(app.getPath('userData'), 'logo.png')
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      imagePath = './resources/logo.png'
    }

    const image = nativeImage.createFromPath(filePaths[0])
    const imageResized = image.resize({ width: 256, height: 256 })
    fs.writeFileSync(imagePath, imageResized.toPNG())

    event.reply('changeLogo', imageResized.toDataURL())
  })
})

ipcMain.handle('loadLogo', () => {
  let imagePath = path.join(app.getPath('userData'), 'logo.png')
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    imagePath = './resources/logo.png'
  }
  const image = nativeImage.createFromPath(imagePath)
  return image.toDataURL()
})
