import { Routes, Route } from 'react-router-dom'
import Login from './Users/Login'
import Users from './Users/Users'
import AddUser from './Users/AddUser'
import EditUser from './Users/EditUser'
import NavBar from './components/NavBar'
import { SessionContext } from './components/SessionContext'
import { useState, useEffect } from 'react'

function App(): JSX.Element {
  const [session, setSession] = useState(undefined)

  window.electron.ipcRenderer.invoke('getSession').then((sessionData) => {
    setSession(sessionData)
  })

  useEffect(() => {
    const unsub = window.electron.ipcRenderer.on('userSession', (_, sessionData) => {
      setSession(sessionData)
    })

    return unsub
  }, [])

  return (
    <SessionContext.Provider value={session}>
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
