import { calTotal, calTotalTax, roundNum } from '../components/Math'
import AddPurchaseInvoiceItems from './componants/AddPurchaseInvoiceItems'
import { setPage } from '@renderer/state/slices/PageSlice'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

export default function AddPurchaseInvoice(): JSX.Element {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage('Add Purchase Invoice'))
  }, [dispatch])

  const [invoiceData, setInvoiceData] = useState<Partial<PurchaseInvoice>>({
    supplierId: 1,
    totalPrice: 0,
    invoiceNumber: '',
    paid: 0
  })
  const [invoiceItemsData, setInvoiceItemsData] = useState<PurchaseInvoiceItem[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  const handlePaidChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const re = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/
    if (e.target.value === '' || re.test(e.target.value)) {
      //@ts-ignore TODO check later
      setInvoiceData({ ...invoiceData, paid: e.target.value })
    }
  }

  const handleTotalPriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const re = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/
    if (e.target.value === '' || re.test(e.target.value)) {
      //@ts-ignore TODO check later
      setInvoiceData({ ...invoiceData, totalPrice: e.target.value })
    }
  }

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getAllSuppliers')
      .then((results) => {
        setSuppliers(results)
      })
      .catch()
  }, [])

  const handleInvoiceItemsData = (items): void => {
    setInvoiceItemsData(items)
    let total = 0
    items.forEach((item) => {
      total += calTotal(item.cost, item.quantity, 0, item.tax)
    })
    setInvoiceData({ ...invoiceData, totalPrice: roundNum(total) })
  }

  const itemsTotal = (): number => {
    let total = 0
    invoiceItemsData.forEach((item) => {
      total += item.cost * item.quantity
    })
    return roundNum(total)
  }

  const itemsTotalTax = (): number => {
    let total = 0
    invoiceItemsData.forEach((item) => {
      total += calTotalTax(item.cost, item.quantity, 0, item.tax)
    })
    return roundNum(total)
  }

  const itemsFinalTotal = (): number => {
    let total = 0
    invoiceItemsData.forEach((item) => {
      total += calTotal(item.cost, item.quantity, 0, item.tax)
    })
    return roundNum(total)
  }

  const save = (): void => {
    if (invoiceData.invoiceNumber === '' && invoiceItemsData.length === 0) {
      alert('Please add items or an Invoice Number to save')
      return
    }
    let status = 'UNPAID'
    if ((invoiceData.paid ?? 0) >= itemsFinalTotal()) status = 'PAID'
    window.electron.ipcRenderer
      .invoke(
        'createPurchaseInvoiceWithItems',
        {
          supplierId: invoiceData.supplierId,
          date: new Date().getTime(),
          status: status,
          paid: invoiceData.paid,
          invoiceNumber: invoiceData.invoiceNumber,
          totalPrice: itemsFinalTotal()
        },
        invoiceItemsData
      )
      .then((result) => alert(result))
      .catch((error) => alert(error))
    resetForm()
  }

  const resetForm = (): void => {
    setInvoiceData({
      supplierId: 1,
      totalPrice: 0,
      invoiceNumber: '',
      paid: 0
    })
    setInvoiceItemsData([])
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2 flex items-center">
          <div className="w-full flex relative">
            <label className="w-36 shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              Supplier:
            </label>
            <select
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, supplierId: Number(e.target.value) })
              }
              value={invoiceData.supplierId}
              name="supplier"
              id="supplier"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300"
            >
              {suppliers.map((value) => (
                <option key={value.id} value={value.id}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-span-2 flex items-center">
          <div className="w-full flex relative">
            <label className="w-36 shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              Invoice Number:
            </label>
            <input
              onBlur={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
              onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
              value={invoiceData.invoiceNumber}
              type="text"
              name="invoiceNumber"
              id="invoiceNumber"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300"
            />
          </div>
        </div>
        <div className="col-span-2 flex items-center">
          <div className="w-full flex relative">
            <label className="w-36 shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              Paid Amount:
            </label>
            <input
              onBlur={handlePaidChange}
              onChange={handlePaidChange}
              value={invoiceData.paid}
              type="text"
              name="paid"
              id="paid"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300"
            />
          </div>
        </div>
        <div className="col-span-2 flex items-center">
          <div className="w-full flex relative">
            <label className="w-36 shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              Total Price:
            </label>
            <input
              onBlur={handleTotalPriceChange}
              onChange={handleTotalPriceChange}
              value={invoiceData.totalPrice}
              type="text"
              name="totalPrice"
              id="totalPrice"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300"
              disabled={invoiceItemsData.length > 0}
            />
          </div>
        </div>
        <AddPurchaseInvoiceItems items={invoiceItemsData} setItems={handleInvoiceItemsData} />
      </div>
      <div className="flex justify-end">
        <div className="text-xl p-2">
          Sub Total: <span className="p-2">{itemsTotal()}</span>
        </div>
        <div className="text-xl p-2">
          Tax: <span className="p-2">{itemsTotalTax()}</span>
        </div>
        <div className="text-xl p-2 bg-gray-200">
          Total:
          <span className="p-2">{itemsFinalTotal()}</span>
        </div>
      </div>
      <div className="flex m-4 justify-center">
        <div
          onClick={save}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-28 text-center mx-4 text-xl py-3"
        >
          Save
        </div>
        <div
          onClick={resetForm}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-28 text-center mx-4 text-xl py-3"
        >
          Reset
        </div>
      </div>
    </>
  )
}
