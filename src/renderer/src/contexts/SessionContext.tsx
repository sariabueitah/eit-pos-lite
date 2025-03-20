import { createContext } from 'react'

type SessionContextType = {
  sessionContext: Session | undefined
  setSessionContext: React.Dispatch<React.SetStateAction<Session | undefined>>
}

const iSessionContext = {
  sessionContext: undefined,
  setSessionContext: (): void => {}
}

const SessionContext = createContext<SessionContextType>(iSessionContext)

export default SessionContext
