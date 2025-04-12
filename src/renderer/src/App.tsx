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
import SaleInvoices from './saleInvoice/SaleInvoices'
import SaleInvoice from './saleInvoice/SaleInvoice'
import AddSaleInvoice from './saleInvoice/AddSaleInvoices'
import NotFound from './NotFound'
import Loading from './components/Loading'
import Hold from './components/Hold'
import PurchaseInvoices from './purchaseInvoice/PurchaseInvoices'
import AddPurchaseInvoice from './purchaseInvoice/AddPurchaseInvoice'
import PurchaseInvoice from './purchaseInvoice/PurchaseInvoice'
import { useTranslation } from 'react-i18next'

//TODO Supplier Balance calculation issue
//TODO Print recipt
//TODO Create a queue for the Tax API
//TODO Create a setup page
//TODO fix all styles unifiing the buttons maybe spruce up the style

function App(): JSX.Element {
  const { i18n } = useTranslation()
  document.body.dir = i18n.dir()

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
      <Hold />
      <NavBar />

      <div className="m-3">
        <Routes>
          {session === null && <Route path="*" element={<Login />} />}
          {session && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/new" element={<AddUser />} />
              <Route path="/users/edit/:id" element={<EditUser />} />
              <Route path="/items" element={<Items />} />
              <Route path="/items/new" element={<AddItems />} />
              <Route path="/items/edit/:id" element={<EditItems />} />
              <Route path="/categories" element={<Category />} />
              <Route path="/categories/new" element={<AddCategory />} />
              <Route path="/categories/edit/:id" element={<EditCategory />} />
              <Route path="/suppliers" element={<Supplier />} />
              <Route path="/suppliers/new" element={<AddSupplier />} />
              <Route path="/suppliers/edit/:id" element={<EditSupplier />} />
              <Route path="/saleInvoices" element={<SaleInvoices />} />
              <Route path="/saleInvoices/new" element={<AddSaleInvoice />} />
              <Route path="/saleInvoices/:id" element={<SaleInvoice />} />
              <Route path="/purchaseInvoices" element={<PurchaseInvoices />} />
              <Route path="/purchaseInvoices/new" element={<AddPurchaseInvoice />} />
              <Route path="/purchaseInvoices/:id" element={<PurchaseInvoice />} />
            </>
          )}
        </Routes>
      </div>
    </>
  )
}

export default App
