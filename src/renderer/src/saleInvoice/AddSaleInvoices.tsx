import { useDispatch, useSelector } from 'react-redux'
import { setPage, addHold } from '../state/slices/PageSlice'
import { useEffect, useState } from 'react'
import AddSaleInvoiceItems from './componants/AddSaleInvoiceItems'
import { RootState } from '../state/store'
import { calTotal, calTotalDiscount, calTotalTax, roundNum } from '../components/Math'
import Payment from './componants/Payment'

export type TempItem = {
  itemId: number
  barcode: string
  name: string
  price: number
  unit: string
  quantity: number
  tax: number
  cost: number
  discount: number
}

export default function AddSaleInvoices(): JSX.Element {
  const session = useSelector((state: RootState) => state.session.value)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage('Add Sale Invoice'))
  }, [dispatch])

  const [invoiceData, setInvoiceData] = useState<Partial<SaleInvoice>>({
    status: 'WAITING',
    customer: '',
    userId: session?.id,
    date: new Date().getTime()
  })

  const [invoiceItemsData, setInvoiceItemsData] = useState<TempItem[]>([])

  const [paymentDetails, setPaymentDetails] = useState<
    undefined | { paymentMethod: 'CASH' | 'CREDIT'; total: number }
  >(undefined)

  const handleInvoiceItemsData = (items): void => {
    setInvoiceItemsData(items)
  }

  const itemsTotal = (): number => {
    let total = 0
    invoiceItemsData.forEach((item) => {
      total += item.price * item.quantity
    })
    return roundNum(total)
  }

  const itemsTotalDiscount = (): number => {
    let total = 0
    invoiceItemsData.forEach((item) => {
      total += calTotalDiscount(item.quantity, item.discount)
    })
    return roundNum(total)
  }

  const itemsTotalTax = (): number => {
    let total = 0
    invoiceItemsData.forEach((item) => {
      total += calTotalTax(item.price, item.quantity, item.discount, item.tax)
    })
    return roundNum(total)
  }

  const itemsFinalTotal = (): number => {
    let total = 0
    invoiceItemsData.forEach((item) => {
      total += calTotal(item.price, item.quantity, item.discount, item.tax)
    })
    return roundNum(total)
  }

  const handleFinalizePayment = (paymentMethod: 'CASH' | 'CREDIT'): void => {
    const totalAmount = itemsFinalTotal()
    if (totalAmount > 0 && invoiceItemsData.length > 0) {
      setPaymentDetails({
        total: totalAmount,
        paymentMethod: paymentMethod
      })
      setInvoiceData({
        userId: session?.id,
        customer: invoiceData.customer,
        date: new Date().getTime(),
        paymentMethod: paymentMethod,
        status: 'WAITING'
      })
    } else {
      alert('Please add items first')
    }
  }

  const completePayment = (invoiceType: string): void => {
    window.electron.ipcRenderer
      .invoke(
        'createSaleInvoiceWithItems',
        {
          userId: session?.id,
          customer: invoiceData.customer,
          date: new Date().getTime(),
          paymentMethod: invoiceData.paymentMethod,
          status: 'PAID'
        },
        invoiceItemsData
      )
      .then((result) => alert(result))
      .catch((error) => alert(error))
    alert(`Invoice: ${invoiceType}`)
    resetForm()
  }

  const holdInvoice = (): void => {
    if (invoiceItemsData.length > 0) {
      window.electron.ipcRenderer
        .invoke(
          'createTempSaleInvoiceWithItems',
          {
            userId: session?.id,
            customer: invoiceData.customer,
            date: new Date().getTime(),
            paymentMethod: invoiceData.paymentMethod,
            status: 'HOLD'
          },
          invoiceItemsData
        )
        .then((result) => {
          alert('Invoice on Hold with number ' + result.id)
          resetForm()
          dispatch(addHold())
        })
        .catch((error) => alert(error))
    } else {
      alert('Please add items first')
    }
  }

  const resetForm = (): void => {
    setInvoiceData({
      status: 'WAITING',
      customer: ''
    })
    setInvoiceItemsData([])
    setPaymentDetails(undefined)
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2 flex items-center">
          <div className="w-full flex relative">
            <label className="w-26 shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              Invoice ID:
            </label>
            <div className="relative w-full">
              <p className="p-2.5 w-full min-h-10.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 cursor-not-allowed">
                {invoiceData.id}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-2 flex items-center">
          <div className="w-full flex relative">
            <label className="w-26 shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              Status:
            </label>
            <div className="relative w-full">
              <p className="p-2.5 w-full min-h-10.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 cursor-not-allowed">
                {invoiceData.status}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-4 flex items-center">
          <div className="w-full flex relative">
            <label className="w-26 shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              Customer:
            </label>
            <input
              onChange={(e) => setInvoiceData({ ...invoiceData, customer: e.target.value })}
              onBlur={(e) => setInvoiceData({ ...invoiceData, customer: e.target.value })}
              value={invoiceData.customer}
              type="text"
              name="customer"
              id="customer"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300"
            />
          </div>
        </div>
        <AddSaleInvoiceItems items={invoiceItemsData} setItems={handleInvoiceItemsData} />
      </div>
      <div className="flex justify-end">
        <div className="text-xl p-2">
          Sub Total: <span className="p-2">{itemsTotal()}</span>
        </div>
        <div className="text-xl p-2">
          Discount: <span className="p-2">{itemsTotalDiscount()}</span>
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
          onClick={() => {
            handleFinalizePayment('CASH')
          }}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-28 text-center mx-4 text-xl py-3"
        >
          Cash
        </div>
        <div
          onClick={() => {
            handleFinalizePayment('CREDIT')
          }}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-28 text-center mx-4 text-xl py-3"
        >
          Credit
        </div>
        <div
          onClick={() => {
            holdInvoice()
          }}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-28 text-center mx-4 text-xl py-3"
        >
          Hold
        </div>
        <div
          onClick={resetForm}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-28 text-center mx-4 text-xl py-3"
        >
          Reset
        </div>
      </div>
      {paymentDetails && (
        <Payment
          payment={paymentDetails}
          handleCancel={() => setPaymentDetails(undefined)}
          paymentComplete={completePayment}
        />
      )}
    </>
  )
}
