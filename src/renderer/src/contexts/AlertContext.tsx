import { createContext } from 'react'

type Alert = {
  error: boolean
  message: string
}

type AlertContextType = {
  alertContext: Alert
  setAlertContext: React.Dispatch<React.SetStateAction<Alert>>
}

const iAlertContext = {
  alertContext: { error: false, message: '' },
  setAlertContext: (): void => {}
}

const AlertContext = createContext<AlertContextType>(iAlertContext)

export default AlertContext
