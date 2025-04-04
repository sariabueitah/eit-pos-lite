import { useDispatch, useSelector } from 'react-redux'
import { setPage } from '../state/slices/PageSlice'
import { useEffect, useState } from 'react'
import KeyPad from '../components/KeyPad'
import AddSaleInvoiceHeader from './componants/AddSaleInvoiceHeader'
import AddSaleInvoiceItems from './componants/AddSaleInvoiceItems'
import { roundNum } from '../components/Math'
import Payment from './componants/Payment'
import { RootState } from '../state/store'

export type TempItem = {
  itemId: number
  barcode: string
  name: string
  category: string
  price: number
  unit: string
  quantity: number
  tax: number
  cost: number
}

//TODO handle hold maybe use redux
export default function AddSaleInvoices(): JSX.Element {
  const session = useSelector((state: RootState) => state.session.value)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPage('Add Sale Invoice'))
  }, [dispatch])

  const [invoice, setInvoice] = useState<Partial<SaleInvoice>>({
    status: 'WAITING',
    customer: ''
  })
  const [invoiceItems, setInvoiceItems] = useState<TempItem[]>([])
  const [keypadInfo, setKeypadInfo] = useState<undefined | { itemId: number; name: string }>(
    undefined
  )
  const [paymentDetails, setPaymentDetails] = useState<
    undefined | { paymentMethod: 'CASH' | 'CREDIT'; total: number }
  >(undefined)
  const updateCustomer = (name: string): void => {
    setInvoice((prev) => ({
      ...prev,
      customer: name
    }))
  }
  const handleAddItem = (itemId: number): void => {
    window.electron.ipcRenderer.invoke('getItemSaleById', itemId).then((result) => {
      setInvoiceItems((prev) => {
        const newItem = {
          itemId: result.id,
          barcode: result.barcode,
          name: result.name,
          category: result.category,
          price: result.price,
          unit: result.unit,
          quantity: 1,
          tax: result.tax,
          cost: result.cost
        }
        const existingItemIndex = prev.findIndex((item) => result.id === item.itemId)
        if (existingItemIndex === -1) {
          return [newItem, ...prev]
        } else {
          prev[existingItemIndex].quantity++
          return [...prev]
        }
      })
    })
  }
  const calculateTotalPrice = (): number =>
    roundNum(invoiceItems.reduce((total, item) => total + item.price * item.quantity, 0))
  const calculateTotalTax = (): number =>
    roundNum(
      invoiceItems.reduce((total, item) => total + item.price * item.quantity * (item.tax / 100), 0)
    )
  const handleFinalizePayment = (paymentMethod: 'CASH' | 'CREDIT'): void => {
    const totalAmount = roundNum(calculateTotalPrice() + calculateTotalTax())
    if (totalAmount > 0 && invoiceItems.length > 0) {
      setPaymentDetails({
        total: totalAmount,
        paymentMethod: paymentMethod
      })
      setInvoice({
        userId: session?.id,
        customer: invoice.customer,
        date: new Date().toISOString(),
        paymentMethod: paymentMethod,
        status: 'UNPAID'
      })
    } else {
      alert('No items')
    }
  }

  const completePayment = (invoiceType: string): void => {
    window.electron.ipcRenderer
      .invoke(
        'createSaleInvoice',
        {
          userId: session?.id,
          customer: invoice.customer,
          date: new Date().toISOString(),
          paymentMethod: invoice.paymentMethod,
          status: 'PAID'
        },
        invoiceItems
      )
      .then((result) => alert(result))
      .catch((error) => alert(error))
    alert(`Invoice: ${invoiceType}`)
    resetForm()
  }

  const handleKeypadInput = (quantity: number): void => {
    if (keypadInfo) {
      setInvoiceItems((prev) => {
        const itemIndex = prev.findIndex((item) => keypadInfo.itemId === item.itemId)
        if (quantity === 0) {
          return prev.filter((item) => item.itemId !== keypadInfo.itemId)
        } else if (prev[itemIndex].unit === 'UNIT' && !Number.isInteger(quantity)) {
          alert('Item sold by unit')
        } else {
          prev[itemIndex].quantity = quantity
        }
        return [...prev]
      })
    }
    setKeypadInfo(undefined)
  }

  const resetForm = (): void => {
    setInvoice({
      status: 'WAITING',
      customer: ''
    })
    setInvoiceItems([])
    setKeypadInfo(undefined)
    setPaymentDetails(undefined)
  }

  return (
    <div>
      {paymentDetails && (
        <Payment
          payment={paymentDetails}
          handleCancel={() => setPaymentDetails(undefined)}
          paymentComplete={completePayment}
        />
      )}
      {keypadInfo && (
        <KeyPad
          handleCancel={() => setKeypadInfo(undefined)}
          handleSubmit={handleKeypadInput}
          title={keypadInfo?.name ?? ''}
        />
      )}
      <AddSaleInvoiceHeader
        addItemHandler={handleAddItem}
        setCustomer={updateCustomer}
        customer={invoice.customer || ''}
      />
      <AddSaleInvoiceItems items={invoiceItems} setKeyPad={setKeypadInfo} />
      <div className="flex justify-end">
        <div className="text-xl p-2">
          Sub Total: <span className="p-2">{calculateTotalPrice()}</span>
        </div>
        <div className="text-xl p-2">
          Tax: <span className="p-2">{calculateTotalTax()}</span>
        </div>
        <div className="text-xl p-2 bg-gray-200">
          Total:{' '}
          <span className="p-2">{roundNum(calculateTotalPrice() + calculateTotalTax())}</span>
        </div>
      </div>
      <div className="flex m-4 justify-center">
        <div
          onClick={() => handleFinalizePayment('CASH')}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-28 text-center mx-4 text-xl py-3"
        >
          Cash
        </div>
        <div
          onClick={() => handleFinalizePayment('CREDIT')}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-28 text-center mx-4 text-xl py-3"
        >
          Credit
        </div>
        <div
          onClick={() => {}}
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
    </div>
  )
}
