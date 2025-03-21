import { Routes, Route } from 'react-router-dom'
import Login from './Users/Login'
import Users from './Users/Users'
import AddUser from './Users/AddUser'
import EditUser from './Users/EditUser'
import NavBar from './components/NavBar'
import SessionContext from './contexts/SessionContext'
import { useState, useEffect } from 'react'

function App(): JSX.Element {
  const [sessionContext, setSessionContext] = useState<Session | undefined>(undefined)

  window.electron.ipcRenderer.invoke('getSession').then((sessionData) => {
    setSessionContext(sessionData)
  })

  useEffect(() => {
    const unsub = window.electron.ipcRenderer.on('userSession', (_, sessionData) => {
      setSessionContext(sessionData)
    })

    return unsub
  }, [])

  return (
    <SessionContext.Provider value={{ sessionContext, setSessionContext }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/new" element={<AddUser />} />
        <Route path="/users/edit/:id" element={<EditUser />} />
      </Routes>
    </SessionContext.Provider>
  )
}

export default App
