import { Database as DatabaseType } from 'better-sqlite3'
import path from 'path'
import { app, BrowserWindow, nativeImage } from 'electron'
import { is } from '@electron-toolkit/utils'
import { getAllConfig } from './db/config'
import { getSaleInvoiceById } from './db/saleInvoices'
import { getSaleInvoiceItemsBySaleInvoiceId } from './db/saleInvoiceItems'

type receiptItem = {
  name: string
  quantity: number
  tax: number
  price: number
  totalTax: number
  totalPrice: number
}
export function printSaleInvoice(db: DatabaseType, invoiceId): void {
  let imagePath = path.join(app.getPath('userData'), 'logo.png')
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    imagePath = './resources/logo.png'
  }
  const image = nativeImage.createFromPath(imagePath)
  const companyObj = {}
  const companyData = getAllConfig(db)
  companyData.map((item) => {
    companyObj[item['name']] = item['value']
  })

  const invoiceData = getSaleInvoiceById(db, invoiceId)
  const invoiceItemsData = getSaleInvoiceItemsBySaleInvoiceId(db, invoiceId)
  let invTotalTax = 0
  let invTotalPrice = 0
  let invTotalDiscount = 0
  const items: receiptItem[] = []
  for (let i = 0; i < invoiceItemsData.length; i++) {
    const totalTax = calTotalTax(
      invoiceItemsData[i]['price'],
      invoiceItemsData[i]['quantity'],
      invoiceItemsData[i]['discount'],
      invoiceItemsData[i]['tax']
    )
    invTotalTax += totalTax
    const totalPrice = calTotal(invoiceItemsData[i]['price'], invoiceItemsData[i]['quantity'], 0, 0)
    invTotalPrice += totalPrice
    invTotalDiscount += calTotalDiscount(
      invoiceItemsData[i]['quantity'],
      invoiceItemsData[i]['discount']
    )
    items.push({
      name: invoiceItemsData[i]['name'] ?? '',
      quantity: invoiceItemsData[i]['quantity'],
      tax: invoiceItemsData[i]['tax'],
      price: invoiceItemsData[i]['price'],
      totalTax: totalTax,
      totalPrice: totalPrice
    })
  }

  const invTotal = roundNum(invTotalPrice + invTotalTax - invTotalDiscount)

  const html = printA4Invoice(
    image.toDataURL(),
    companyObj,
    invoiceData,
    items,
    roundNum(invTotalTax),
    roundNum(invTotalPrice),
    roundNum(invTotalDiscount),
    roundNum(invTotal)
  )
  const printWindow = new BrowserWindow({ show: false })

  printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)

  printWindow.webContents.on('did-finish-load', () => {
    printWindow.webContents.print(
      {
        silent: true,
        printBackground: true,
        deviceName: ''
      },
      (success, errorType) => {
        if (!success) console.log(errorType)
        printWindow.close()
      }
    )
    // printWindow.webContents
    //   .printToPDF({
    //     printBackground: true,
    //     pageSize: 'A4'
    //   })
    //   .then((data) => {
    //     const tempDir = app.getPath('desktop')
    //     const pdfPath = path.join(tempDir, `receipt-preview-${Date.now()}.pdf`)
    //     writeFileSync(pdfPath, data)
    //   })
  })
}

export function printA4Invoice(
  logo,
  companyObj,
  invoiceData: SaleInvoice,
  invoiceItemsData: receiptItem[],
  invTotalTax,
  invTotalPrice,
  invTotalDiscount,
  invTotal
): string {
  let items = ''
  for (let i = 0; i < invoiceItemsData.length; i++) {
    items += '<tr>'
    items += `<td>${invoiceItemsData[i].name}</td>`
    items += `<td class="align-right">${invoiceItemsData[i].quantity}</td>`
    items += `<td class="align-right">${invoiceItemsData[i].tax}%</td>`
    items += `<td class="align-right">${invoiceItemsData[i].price}JD</td>`
    items += `<td class="align-right">${invoiceItemsData[i].totalTax}JD</td>`
    items += `<td class="align-right">${invoiceItemsData[i].totalPrice}JD</td>`
    items += '</tr>'
  }

  return `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title></title>
      <style>
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        width: 210mm;
        min-height: 297mm;
        padding: 15mm;
        margin: 0 auto;
        color: #333;
        font-size: 12pt;
        line-height: 1.5;
      }
      .page {
        position: relative;
      }
      .receipt-title {
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        color: #2c3e50;
        text-decoration: underline;
      }
      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        border-bottom: 2px solid #333;
        padding-bottom: 15px;
      }
      .company-info {
        width: 33%;
      }
      .company-title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 5px;
        color: #2c3e50;
      }
      .company-logo {
        width: 33%;
        text-align: right;
      }
      .company-logo img {
        width: 150px;
        height: 150px;
      }
      .receipt-info {
        margin: 30px 0;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      .receipt-info-header {
        padding: 15px;
        border-bottom: 1px solid #ddd;
        margin: 0;
      }
      .receipt-info-data {
        display: flex;
        justify-content: space-between;
      }
      .receipt-info-data > div:first-child {
        border-right: 1px solid #ddd;
      }
      .info-box {
        width: 48%;
        padding: 15px;
      }
      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      .items-table th {
        background-color: #f5f5f5;
        text-align: left;
        padding: 10px;
        border: 1px solid #ddd;
      }
      .items-table td {
        padding: 10px;
        border: 1px solid #ddd;
      }
      .items-table .align-right {
        text-align: right;
      }

      .totals {
        float: right;
        width: 300px;
        margin-top: 20px;
      }
      .total-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      .total-row.total {
        font-weight: bold;
        font-size: 14pt;
        border-top: 2px solid #333;
        padding-top: 10px;
        margin-top: 10px;
      }
      .notes {
        padding: 15px;
        background-color: #f9f9f9;
        border-left: 4px solid #2c3e50;
      }
      @page {
        size: auto; /* auto is the initial value */
        margin: 0mm; /* this affects the margin in the printer settings */
      }
      @media print {
        body {
          width: 210mm;
          height: 297mm;
          padding: 15mm;
        }
        .no-print {
          display: none !important;
        }
      }
      </style>
    </head>
    <body>
      <div class="page" id="receipt">
        <div class="receipt-title">TAX INVOICE</div>
        <div class="header">
          <div class="company-info">
            <div class="company-title">${companyObj.name}</div>
            <div>${companyObj.address}</div>
            <div>Phone: ${companyObj.phoneNumber}</div>
            <div>Email: ${companyObj.email}</div>
            <div>Tax ID: ${companyObj.taxId}</div>
          </div>
          <div class="company-logo">
            <img src="${logo}" />
          </div>
        </div>
        <div class="receipt-info">
          <h3 class="receipt-info-header">INVOICE DETAILS</h3>
          <div class="receipt-info-data">
            <div class="info-box">
              <div><strong>Client Name:</strong> ${invoiceData.customer != '' ? 'Walk in' : invoiceData.customer}</div>
              <div><strong>Date:</strong> <span id="current-date">${invoiceData.date}</span></div>
            </div>
            <div class="info-box">
              <div><strong>Invoice #:</strong> ${invoiceData.id}</div>
              <div><strong>Payment Method:</strong> ${invoiceData.paymentMethod}</div>
            </div>
          </div>
        </div>
        <table class="items-table">
          <thead>
            <tr>
              <th width="35%">Name</th>
              <th width="10%">Qty</th>
              <th width="10%">Tax</th>
              <th width="15%">Unit Price</th>
              <th width="15%">Total Tax</th>
              <th width="15%">Total Price</th>
            </tr>
          </thead>
          <tbody>
            ${items}
          </tbody>
        </table>
      </div>
      <div id="footer">
        <div class="totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${invTotalPrice}JD</span>
          </div>
          <div class="total-row">
            <span>Tax:</span>
            <span>${invTotalTax}JD</span>
          </div>
          <div class="total-row">
            <span>Discount:</span>
            <span>-${invTotalDiscount}JD</span>
          </div>
          <div class="total-row total">
            <span>TOTAL DUE:</span>
            <span>${invTotal}JD</span>
          </div>
        </div>

        <div class="notes">
          <h3>NOTES</h3>
          <p>
            Payment should be made within 30 days of invoice date. Please include the invoice number
            in your payment reference.
          </p>
          <p>
            Bank Details: Account Name: Your Company, Bank: National Bank, Account #: 12345678, Sort
            Code: 12-34-56, IBAN: GB00ABCD1234567890
          </p>
        </div>
      </div>
      <script>
        function setFooterLocation() {
          var page = document.getElementById('receipt')
          var pageHeight = page.offsetHeight
          var pageHeightMM = pageHeight * 0.2645833333

          var footer = document.getElementById('footer')
          var footerHeight = footer.offsetHeight
          var footerHeightMM = footerHeight * 0.2645833333

          var numberOfPages = Math.ceil((pageHeightMM + footerHeightMM) / 297)
          var x = 297 * numberOfPages
          var mt = x - (pageHeightMM + footerHeightMM)
          document.getElementById('footer').style.marginTop = mt + 'mm'
        }
        setFooterLocation()
      </script>
    </body>
  </html>
  `
}

function calTotalDiscount(quantity: number, discount: number): number {
  if (discount === 0) {
    return 0
  }
  const total = discount * quantity
  return roundNum(total)
}

function calTotalTax(price: number, quantity: number, discount: number, tax: number): number {
  const item = price - discount
  const itemTax = item * (tax / 100)
  const total = itemTax * quantity
  return roundNum(total)
}
function calTotal(price: number, quantity: number, discount: number, tax: number): number {
  const item = price - discount
  const itemWithTax = item * (tax / 100) + item
  const total = itemWithTax * quantity
  return roundNum(total)
}

function roundNum(number: number): number {
  return +(Math.round(Number(number + 'e+2')) + 'e-2')
}
