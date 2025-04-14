import { useDispatch } from 'react-redux'
import { setPage, showAlert } from '../state/slices/PageSlice'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SaleInvoiceRow from './componants/SaleInvoiceRow'
import { useTranslation } from 'react-i18next'

export default function SaleInvoices(): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage(t('Sale Invoices')))
  }, [dispatch, t])

  const [invoiceData, seInvoiceData] = useState<SaleInvoice[]>([])
  const [search, setSearch] = useState('')
  const [deleted, setDeleted] = useState('ALL')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.electron.ipcRenderer
        .invoke('searchSaleInvoices', search.trim(), deleted, dateFrom, dateTo)
        .then((result) => {
          seInvoiceData(result)
        })
        .catch((e) => {
          dispatch(showAlert(`${t('Data not retrieved')}: ` + e.message))
        })
    }, 500)
    return (): void => clearTimeout(timeoutId)
  }, [search, deleted, dateFrom, dateTo, dispatch, t])

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getAllSaleInvoices')
      .then((result) => {
        seInvoiceData(result)
      })
      .catch((e) => {
        dispatch(showAlert(`${t('Data not retrieved')}: ` + e.message))
      })
  }, [dispatch, t])

  return (
    <div className="">
      <NavLink
        className="absolute bottom-4 right-4 border border-gray-300 hover:bg-gray-300 rounded-2xl"
        to="/saleInvoices/new"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-16"
        >
          <path
            fillRule="evenodd"
            d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      </NavLink>
      <div className="w-full grid grid-cols-4 gap-2 relative">
        <div className="col-span-4 flex items-center gap-2 justify-baseline">
          <input
            className="peer/all hidden"
            type="radio"
            id="radio1"
            name="radios"
            value="ALL"
            checked={deleted === 'ALL'}
            onChange={() => setDeleted('ALL')}
          />
          <label
            className="border border-gray-300 hover:bg-gray-300 py-1 px-3 cursor-pointer peer-checked/all:bg-gray-300 peer-checked/all:hover:bg-gray-400 rounded-xl"
            htmlFor="radio1"
          >
            {t('All')}
          </label>
          <input
            className="peer/active hidden"
            type="radio"
            id="radio2"
            name="radios"
            value="PAID"
            checked={deleted === 'PAID'}
            onChange={() => setDeleted('PAID')}
          />
          <label
            className="border border-gray-300 hover:bg-gray-300 py-1 px-3 cursor-pointer peer-checked/active:bg-gray-300 peer-checked/active:hover:bg-gray-400 rounded-xl"
            htmlFor="radio2"
          >
            {t('Paid')}
          </label>
          <input
            className="peer/deleted hidden"
            type="radio"
            id="radio3"
            name="radios"
            value="CANCELLED"
            checked={deleted === 'CANCELLED'}
            onChange={() => setDeleted('CANCELLED')}
          />
          <label
            className="border border-gray-300 hover:bg-gray-300 py-1 px-3 cursor-pointer peer-checked/deleted:bg-gray-300 peer-checked/deleted:hover:bg-gray-400 rounded-xl"
            htmlFor="radio3"
          >
            {t('Canceled')}
          </label>
        </div>
        <div className="col-span-2 relative my-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            name="search"
            id="search"
            placeholder={t('Search By ID or Customer')}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-gray-300 border"
          />
          <button
            type="submit"
            className="absolute z-10 top-0 end-0 p-2.5 text-sm font-medium h-full text-gray-900 bg-gray-100 rounded-e-lg border border-gray-300 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>
        <div className="col-span-2 relative my-2 flex gap-2">
          <div className="flex items-center gap-2 w-1/2">
            <label>{t('From')}:</label>
            <input
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              type="date"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-gray-300 border"
            />
          </div>
          <div className="flex items-center gap-2 w-1/2">
            <label>{t('To')}:</label>
            <input
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              type="date"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-gray-300 border"
            />
          </div>
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 overflow-scroll">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="p-2">
              {t('ID')}
            </th>
            <th scope="col" className="p-2">
              {t('Customer')}
            </th>
            <th scope="col" className="p-2">
              {t('Status')}
            </th>
            <th scope="col" className="p-2">
              {t('Payment Method')}
            </th>
            <th scope="col" className="p-2">
              {t('Issued By')}
            </th>
            <th scope="col" className="p-2">
              {t('Date')}
            </th>
            <th scope="col" className="p-2">
              {t('Actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          {invoiceData &&
            invoiceData.map((object) => <SaleInvoiceRow saleInvoice={object} key={object.id} />)}
        </tbody>
      </table>
    </div>
  )
}
