import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  type User = {
    id: number
    name: string
    userName: string
    password?: string
    phoneNumber: string
    role: 'ADMIN' | 'USER'
  }

  type Item = {
    id: number
    name: string
    description: string
    barcode: string
    unit: 'Grams' | 'Kilograms' | 'Liters' | 'Milliliters' | 'Units'
    cost: number
    discount: number
    price: number
    tax: number
    image: string
    categoryId: number
    supplierId: number
    category: string
  }

  type Supplier = {
    id: number
    name: string
    phoneNumber: string
    taxNumber: string
  }

  type Category = {
    id: number
    name: string
  }

  type PurchaseInvoice = {
    id: number
    supplierId: number
    date: number
    status: 'PAID' | 'UNPAID' | 'PARTIAL'
    paid: number
  }

  type PurchaseInvoiceItem = {
    id: number
    itemId: number
    purchaseInvoiceId: number
    quantity: number
    price: number
    tax: number
  }

  type SaleInvoice = {
    id: number
    userId: number
    date: number
    customer: string
    status: 'PAID' | 'UNPAID' | 'HOLD' | 'CANCELED' | 'WAITING'
    paymentMethod: 'CASH' | 'CREDIT'
  }

  type SaleInvoiceItem = {
    id: number
    itemId: number
    saleInvoiceId: number
    quantity: number
    price: number
    cost: number
    tax: number
    discount: number
  }

  type Session = {
    id: number
    name: string
    userName: string
    role: 'ADMIN' | 'USER'
  }

  type EventPayloadMapping = {
    getAllUserData: User
  }

  interface Window {
    electron: ElectronAPI
    api: unknown
  }
}
