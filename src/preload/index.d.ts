import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  type User = {
    id: number
    name: string
    user_name: string
    password: string
    phone_number: string
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
