import { Routes, Route } from 'react-router-dom'
import { AppDispatch, RootState } from './state/store'
import { useDispatch, useSelector } from 'react-redux'
import { getSession, setSession } from './state/slices/SessionSlice'
import { useEffect } from 'react'
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
import SaleInvoice from './saleInvoice/SaleInvoices'
import AddSaleInvoice from './saleInvoice/AddSaleInvoices'
import NotFound from './NotFound'
import Loading from './Loading'

//TODO fix all styles unifiing the buttons maybe spruce up the style
function App(): JSX.Element {
  const session = useSelector((state: RootState) => state.session.value)
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(getSession())
  }, [dispatch])

  useEffect(() => {
    const unsub = window.electron.ipcRenderer.on('userSession', (_, sessionData) => {
      dispatch(setSession(sessionData))
    })
    return unsub
  }, [dispatch])

  return (
    <>
      <Loading />
      <NavBar />
      <div className="m-3">
        <Routes>
          {session === null && <Route path="*" element={<Login />} />}
          {session && session.role === 'ADMIN' && (
            <>
              <Route path="/users" element={<Users />} />
              <Route path="/users/new" element={<AddUser />} />
              <Route path="/users/edit/:id" element={<EditUser />} />
            </>
          )}
          {session && (
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
              <Route path="/saleInvoices" element={<SaleInvoice />} />
              <Route path="/saleInvoices/new" element={<AddSaleInvoice />} />
            </>
          )}
        </Routes>
      </div>
    </>
  )
}

export default App
