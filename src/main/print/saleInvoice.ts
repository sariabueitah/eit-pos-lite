import { Database as DatabaseType } from 'better-sqlite3'
import path from 'path'
import { app, nativeImage } from 'electron'
import { is } from '@electron-toolkit/utils'
import { printHtml } from '../print'
import { getAllConfig } from '../db/config'
import { getSaleInvoiceWithDetailsById } from '../db/saleInvoices'
import { getSaleInvoiceItemsBySaleInvoiceId } from '../db/saleInvoiceItems'

type receiptItem = {
  name: string
  quantity: number
  tax: number
  price: number
  totalTax: number
  totalPrice: number
}

export function printSaleInvoice(
  db: DatabaseType,
  invoiceId
): Promise<{ success: boolean; error?: string }> {
  // get logo image base64
  let imagePath = path.join(app.getPath('userData'), 'logo.png')
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    imagePath = './resources/logo.png'
  }
  const image = nativeImage.createFromPath(imagePath).toDataURL()

  // get config Data
  const companyObj = {}
  const companyData = getAllConfig(db)
  companyData.map((item) => {
    companyObj[item['name']] = item['value']
  })

  //get invoice data
  const invoiceData = getSaleInvoiceWithDetailsById(db, invoiceId)

  //get invoice items
  const invoiceItemsData = getSaleInvoiceItemsBySaleInvoiceId(db, invoiceId)

  //prepare items for html
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

  //prepare html
  let html = ''
  if (companyObj['printSize'] == 'A4') {
    html = printA4Invoice(
      image,
      companyObj,
      invoiceData,
      items,
      roundNum(invTotalTax),
      roundNum(invTotalPrice),
      roundNum(invTotalDiscount),
      roundNum(invTotal)
    )
  } else {
    html = printInvoice(
      companyObj['printSize'],
      companyObj,
      invoiceData,
      items,
      roundNum(invTotalTax),
      roundNum(invTotalPrice),
      roundNum(invTotalDiscount),
      roundNum(invTotal)
    )
  }

  //set printing size
  let printSize: Electron.Size | 'A4' | undefined = undefined
  switch (companyObj['printSize']) {
    case '80':
      printSize = { width: 80000, height: 100000 }
      break
    case '58':
      printSize = { width: 58000, height: 100000 }
      break
    default:
      printSize = 'A4'
  }

  return printHtml(html, printSize, companyObj['printer'])
}

function printA4Invoice(
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
    items += `<td>${invoiceItemsData[i].quantity}</td>`
    items += `<td>${invoiceItemsData[i].tax}%</td>`
    items += `<td>${invoiceItemsData[i].price}JD</td>`
    items += `<td>${invoiceItemsData[i].totalTax}JD</td>`
    items += `<td>${invoiceItemsData[i].totalPrice}JD</td>`
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
          text-align: left;
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
          border-left: 1px solid #ddd;
        }
        .receipt-info-id {
          font-size: 10px;
        }
        .info-box {
          flex-grow: 1;
          display: flex;
        }
        .info-box > div {
          width: 48%;
          padding: 15px;
        }
        .info-box > div:first-child {
          border-left: 1px solid #ddd;
        }
        .info-box > div > div > strong {
          width:50px;
        }
        .qr-box {
          min-width:150px;
          width:150px;
        }
        .qr-box img{
          max-width:150px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .items-table th {
          background-color: #f5f5f5;
          text-align: right;
          padding: 10px;
          border: 1px solid #ddd;
        }
        .items-table td {
          padding: 10px;
          border: 1px solid #ddd;
        }
        #footer {
          display:flex;
          padding: 15px;
          background-color: #f9f9f9;
          border-right: 4px solid #2c3e50;
        }
        .notes {
          flex-grow:1;
        }
        .notes h4 {
          margin:0
        }
        .totals {
          min-width: 300px;
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
        <div dir="rtl" class="page" id="receipt">
          <div class="receipt-title">فاتورة</div>
          <div class="header">
            <div class="company-info">
              <div class="company-title">${companyObj.name}</div>
              <div>${companyObj.address}</div>
              <div>هاتف: ${companyObj.phoneNumber}</div>
              <div>بريد إلكتروني: ${companyObj.email}</div>
              <div>الرقم الضريبي: ${companyObj.taxId}</div>
            </div>
            <div class="company-logo">
              <img src="${logo}" />
            </div>
          </div>
          <div class="receipt-info">
            <h3 class="receipt-info-header">تفاصيل الفاتورة</h3>
            <div class="receipt-info-data">
              <div class="info-box">
                <div>
                  <div><strong>رقم الفاتورة:</strong> ${invoiceData.id}</div>
                  <div><strong>اسم العميل:</strong> ${invoiceData.customer == '' ? 'عميل نقدي' : invoiceData.customer}</div>
                  <div><strong>التاريخ:</strong> <span dir="ltr">${new Date(invoiceData.date).toLocaleString()}</span></div>
                </div>
                <div>
                  <div><strong>رقم البائع:</strong> ${invoiceData.userId}</div>
                  <div><strong>اسم البائع:</strong> ${invoiceData.userName}</div>
                  <div><strong>طريقة الدفع:</strong> ${invoiceData.paymentMethod == 'CASH' ? 'نقدا' : 'بطاقة'}</div>
                </div>
              </div>
              <div class="qr-box">
                <img src="${logo}" />
              </div>
            </div>
          </div>
          <table class="items-table">
            <thead>
              <tr>
                <th width="50%">السلعة</th>
                <th width="5%">الكمية</th>
                <th width="5%">الضريبة</th>
                <th width="13%">سعر الوحدة</th>
                <th width="14%">إجمالي الضريبة</th>
                <th width="13%">إجمالي السعر</th>
              </tr>
            </thead>
            <tbody>
              ${items}
            </tbody>
          </table>
        </div>
        <div dir="rtl" id="footer">
          <div class="notes">
            <h4>ملاحظات</h4>
          </div>
          <div class="totals">
            <div class="total-row">
              <span>المجموع الفرعي:</span>
              <span>${invTotalPrice}JD</span>
            </div>
            <div class="total-row">
              <span>الضريبة:</span>
              <span>${invTotalTax}JD</span>
            </div>
            <div class="total-row">
              <span>الخصومات:</span>
              <span>-${invTotalDiscount}JD</span>
            </div>
            <div class="total-row total">
              <span>الإجمالي المستحق:</span>
              <span>${invTotal}JD</span>
            </div>
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

function printInvoice(
  receiptWidth: number,
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
    items += `<tr>`
    items += `<td>${invoiceItemsData[i].name}</td>`
    items += `<td class="align-left">${invoiceItemsData[i].quantity}</td>`
    items += `<td class="align-left">${invoiceItemsData[i].price}JD</td>`
    items += `<td class="align-left">${invoiceItemsData[i].totalPrice}JD</td>`
    items += `</tr>`
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
            font-family: Arial, sans-serif;
            max-width: ${receiptWidth}mm;
            margin: 0 auto;
            padding: 15px;
          }
          .receipt-header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
          }
          .receipt-title {
            font-size: 20px;
            font-weight: bold;
            margin: 5px 0;
          }
          .receipt-info {
            font-size: 12px;
            margin: 5px 0;
          }
          .receipt-details {
            margin: 15px 0;
          }
          .receipt-items {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          .receipt-items th {
            text-align: right;
            border-bottom: 1px solid #000;
            padding: 5px 0;
          }
          .receipt-items td {
            padding: 3px 0;
          }
          .receipt-items .align-left {
            text-align: left;
          }
          .receipt-total {
            margin-top: 10px;
            border-top: 1px dashed #000;
            padding-top: 10px;
            font-weight: bold;
          }
          .receipt-footer {
            margin-top: 20px;
            font-size: 11px;
            text-align: center;
            border-top: 1px dashed #000;
            padding-top: 10px;
          }
          @media print {
            body {
              max-width: 100%;
              padding: 0;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div dir="rtl" class="page">
          <div class="receipt-header">
            <div class="receipt-title">${companyObj.name}</div>
            <div class="receipt-info">${companyObj.address}</div>
            <div class="receipt-info">هاتف: ${companyObj.phoneNumber}</div>
            <div class="receipt-info">بريد إلكتروني: ${companyObj.email}</div>
            <div class="receipt-info">الرقم الضريبي: ${companyObj.taxId}</div>
          </div>
  
          <div class="receipt-details">
            <div><strong>رقم الفاتورة:</strong> ${invoiceData.id}</div>
            <div>
              <strong>التاريخ:</strong>
              <span>${new Date(invoiceData.date).toLocaleString()}</span>
            </div>
            <div>
              <strong>اسم العميل:</strong> ${
                invoiceData.customer == '' ? 'عميل نقدي' : invoiceData.customer
              }
            </div>
            <div>
              <strong>طريقة الدفع:</strong> ${invoiceData.paymentMethod == 'CASH' ? 'نقدا' : 'بطاقة'}
            </div>
          </div>
  
          <table class="receipt-items">
            <thead>
              <tr>
                <th>السلعة</th>
                <th class="align-left">الكمية</th>
                <th class="align-left">سعر الوحدة</th>
                <th class="align-left">إجمالي السعر</th>
              </tr>
            </thead>
            <tbody>
              ${items}
            </tbody>
          </table>
  
          <div class="receipt-total">
            <div style="float: right">إجمالي السعر:</div>
            <div style="float: left">${invTotalPrice}JD</div>
            <div style="clear: both"></div>
            <div style="float: right">الضريبة:</div>
            <div style="float: left">${invTotalTax}JD</div>
            <div style="clear: both"></div>
            <div style="float: right">الخصومات:</div>
            <div style="float: left">-${invTotalDiscount}JD</div>
            <div style="clear: both"></div>
            <div style="float: right">الإجمالي المستحق:</div>
            <div style="float: left">${invTotal}JD</div>
            <div style="clear: both"></div>
          </div>
        </div>
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
