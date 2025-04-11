import { AppDispatch, RootState } from '../state/store'
import { useDispatch, useSelector } from 'react-redux'
import { showHold, getHoldCount } from '../state/slices/PageSlice'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Hold(): JSX.Element {
  const navigate = useNavigate()
  const show = useSelector((state: RootState) => state.page.hold.show)
  const count = useSelector((state: RootState) => state.page.hold.count)
  const dispatch = useDispatch<AppDispatch>()
  const [invoices, setInvoices] = useState<SaleInvoice[]>([])

  useEffect(() => {
    dispatch(getHoldCount())
  }, [dispatch])

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getAllTempSaleInvoices').then((result) => {
      setInvoices(result)
    })
  }, [count])

  const handleHoldClick = (id): void => {
    navigate(`/saleInvoices/new?holdId=${id}`, { replace: false })
    dispatch(showHold(!show))
  }

  return (
    <>
      <div
        className={
          'absolute top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform bg-white ' +
          (show ? 'translate-x-0' : '-translate-x-full')
        }
      >
        <h5 className="text-base font-semibold text-gray-500 uppercase">Invoices On Hold</h5>
        <button
          onClick={() => dispatch(showHold(!show))}
          type="button"
          data-drawer-hide="drawer-navigation"
          aria-controls="drawer-navigation"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2">
            {invoices.map((invoice) => (
              <li key={invoice.id}>
                <button
                  onClick={() => handleHoldClick(invoice.id)}
                  className="w-full flex p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 group"
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 01-8 8H2z"></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">{invoice.id}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {show && (
        <div
          onClick={() => dispatch(showHold(!show))}
          className="bg-gray-900/50 fixed inset-0 z-30"
        ></div>
      )}
    </>
  )
}
