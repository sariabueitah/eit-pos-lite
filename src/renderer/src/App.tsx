import { Routes, Route } from 'react-router-dom'
import SessionContext from './contexts/SessionContext'
import PageContext from './contexts/PageContext'
import { useState, useEffect } from 'react'

import NavBar from './components/NavBar'
import Home from './home/Home'
import Login from './users/Login'
import Users from './users/Users'
import AddUser from './users/AddUser'
import EditUser from './users/EditUser'
import Items from './items/Items'
import AddItems from './items/AddItems'
import EditItems from './items/EditItems'
import Category from './categories/Categories'
import AddCategory from './categories/AddCategory'
import EditCategory from './categories/EditCategory'
import Supplier from './suppliers/Suppliers'
import AddSupplier from './suppliers/AddSupplier'
import EditSupplier from './suppliers/EditSupplier'
import NotFound from './NotFound'

function App(): JSX.Element {
  const [sessionContext, setSessionContext] = useState<Session | undefined>()
  const [pageContext, setPageContext] = useState({ pageTitle: '' })

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getSession').then((sessionData) => {
      setSessionContext(sessionData)
    })
  }, [])

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
        <div className="m-3">
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
                <Route path="/categories" element={<Category />} />
                <Route path="/categories/new" element={<AddCategory />} />
                <Route path="/categories/edit/:id" element={<EditCategory />} />
                <Route path="/suppliers" element={<Supplier />} />
                <Route path="/suppliers/new" element={<AddSupplier />} />
                <Route path="/suppliers/edit/:id" element={<EditSupplier />} />
              </>
            )}
          </Routes>
        </div>
      </PageContext.Provider>
    </SessionContext.Provider>
  )
}

export default App
