import { app, BrowserWindow } from 'electron'
import { writeFileSync } from 'fs'
import path from 'path'

interface PrintResult {
  success: boolean
  error?: string
}

export const printHtml = async (
  html: string,
  size: Electron.WebContentsPrintOptions['pageSize'],
  printer: string
): Promise<PrintResult> => {
  const printWindow = new BrowserWindow({
    show: true
  })

  try {
    const loadPromise = new Promise<void>((resolve, reject) => {
      printWindow.webContents.once('did-finish-load', () => resolve())
      printWindow.webContents.once('did-fail-load', (_, errorCode, errorDesc) => {
        //TODO needs translation
        reject(new Error(`Failed to load print content: ${errorDesc} (code ${errorCode})`))
      })
    })

    // Load HTML content
    await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
    await loadPromise

    // Get printers
    if (printer !== 'PDF') {
      const printers = await printWindow.webContents.getPrintersAsync()
      if (!printers || printers.length === 0) {
        throw new Error('No printers detected')
      }

      // Select printer
      if (printer === '') {
        printer = printers.find((p) => p.isDefault)?.name || ''
      } else {
        const printerIndex = printers.findIndex((p) => p.name === printer)
        if (printerIndex === -1) {
          //TODO needs translation
          throw new Error(`Printer "${printer}" not found`)
        }
      }

      //Print with options
      const success = await new Promise<boolean>((resolve) => {
        printWindow.webContents.print(
          {
            silent: true,
            printBackground: true,
            deviceName: printer,
            pageSize: size
          },
          (success: boolean) => {
            resolve(success)
          }
        )
      })
      return { success }
    } else {
      const success = await new Promise<boolean>((resolve) => {
        printWindow.webContents
          .printToPDF({
            printBackground: true,
            pageSize: 'A4'
          })
          .then((data) => {
            const tempDir = app.getPath('desktop')
            const pdfPath = path.join(tempDir, `receipt-preview-${Date.now()}.pdf`)
            writeFileSync(pdfPath, data)
            resolve(true)
          })
          .catch((e) => {
            throw new Error(e)
          })
      })
      return { success }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      error: errorMessage
    }
  } finally {
    if (!printWindow.isDestroyed()) {
      printWindow.destroy()
    }
  }
}
