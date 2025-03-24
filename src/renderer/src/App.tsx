import { Routes, Route } from 'react-router-dom'
import Login from './users/Login'
import Users from './users/Users'
import AddUser from './users/AddUser'
import EditUser from './users/EditUser'
import NavBar from './components/NavBar'
import Home from './home/Home'
import NotFound from './NotFound'
import SessionContext from './contexts/SessionContext'
import PageContext from './contexts/PageContext'
import { useState, useEffect } from 'react'

import Items from './items/Items'
import AddItems from './items/AddItems'
import EditItems from './items/EditItems'

function App(): JSX.Element {
  const [sessionContext, setSessionContext] = useState<Session | undefined>(undefined)
  const [pageContext, setPageContext] = useState({ pageTitle: '' })

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
      <PageContext.Provider value={{ pageContext, setPageContext }}>
        <NavBar />
        <div className="m-2.5">
          <Routes>
            {sessionContext === undefined && <Route path="*" element={<Login />} />}
            {sessionContext && sessionContext.role === 'ADMIN' && (
              <>
                <Route path="/users" element={<Users />} />
                <Route path="/users/new" element={<AddUser />} />
                <Route path="/users/edit/:id" element={<EditUser />} />
              </>
            )}
            {sessionContext && (
              <>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/items" element={<Items />} />
                <Route path="/items/new" element={<AddItems />} />
                <Route path="/items/edit/:id" element={<EditItems />} />
              </>
            )}
          </Routes>
        </div>
      </PageContext.Provider>
    </SessionContext.Provider>
  )
}

export default App
