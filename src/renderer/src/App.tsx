import { Routes, Route, useLocation } from 'react-router-dom'
import Login from './Users/Login'
import Users from './Users/Users'
import AddUser from './Users/AddUser'
import EditUser from './Users/EditUser'
import NavBar from './components/NavBar'
import SessionContext from './contexts/SessionContext'
import AlertContext from './contexts/AlertContext'
import { useState, useEffect } from 'react'
import AlertMessage from './components/AlertMessage'

function App(): JSX.Element {
  const location = useLocation()
  const [sessionContext, setSessionContext] = useState<Session | undefined>(undefined)
  const [alertContext, setAlertContext] = useState({ error: false, message: '' })

  window.electron.ipcRenderer.invoke('getSession').then((sessionData) => {
    setSessionContext(sessionData)
  })

  useEffect(() => {
    const unsub = window.electron.ipcRenderer.on('userSession', (_, sessionData) => {
      setSessionContext(sessionData)
    })

    return unsub
  }, [])

  useEffect(() => {
    setAlertContext({ error: false, message: '' })
  }, [location])

  return (
    <SessionContext.Provider value={{ sessionContext, setSessionContext }}>
      <AlertContext.Provider value={{ alertContext, setAlertContext }}>
        <NavBar />
        <AlertMessage />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/new" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
        </Routes>
      </AlertContext.Provider>
    </SessionContext.Provider>
  )
}

export default App
