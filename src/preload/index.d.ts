import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  type User = {
    id: number
    name: string
    user_name: string
    password?: string
    phone_number: string
    role: 'ADMIN' | 'USER'
  }

  type Item = {
    id: number
    name: string
    description: string
    barcode: string
    unit: 'Grams' | 'Kilograms' | 'Liters' | 'Milliliters' | 'Units'
    cost: number
    price: number
    tax: number
    image: string
    category: string
    supplier: string
  }

  type Session = {
    id: number
    name: string
    user_name: string
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
