import PageContext from '../contexts/PageContext'
import SessionContext from '../contexts/SessionContext'
import { useContext, useEffect, useState } from 'react'
import KeyPad from '../components/KeyPad'
import AddSaleInvoiceHeader from './componants/AddSaleInvoiceHeader'
import AddSaleInvoiceItems from './componants/AddSaleInvoiceItems'
import { roundNum } from '../components/Math'
import Payment from './componants/Payment'

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
  const { sessionContext } = useContext(SessionContext)
  const { setPageContext } = useContext(PageContext)
  useEffect(() => {
    setPageContext({ pageTitle: 'Add Sale Invoice' })
  }, [setPageContext])

  const [saleInvoice, setSaleInvoice] = useState<Partial<SaleInvoice>>({
    status: 'WAITING',
    customer: ''
  })
  const [saleInvoiceItems, setSaleInvoiceItems] = useState<TempItem[]>([])

  const [keyPad, setKeyPad] = useState<undefined | { itemId: number; name: string }>(undefined)
  const [payment, setPayment] = useState<
    undefined | { paymentMethod: 'CASH' | 'CREDIT'; total: number }
  >(undefined)

  const setCustomer = (name: string): void => {
    setSaleInvoice((prev) => ({
      ...prev,
      customer: name
    }))
  }

  const addItemHandler = (itemId): void => {
    window.electron.ipcRenderer.invoke('getItemSaleById', itemId).then((result) => {
      setSaleInvoiceItems((prev) => {
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
        const foundIndex = prev.findIndex((o) => result.id === o.itemId)

        if (prev.length === 0 || foundIndex === -1) {
          return [newItem, ...prev]
        } else {
          prev[foundIndex].quantity++
          return [...prev]
        }
      })
    })
  }

  const totalPriceCalc = (): number => {
    let total = 0
    for (let i = 0; i < saleInvoiceItems.length; i++) {
      total += saleInvoiceItems[i].price * saleInvoiceItems[i].quantity
    }
    return roundNum(total)
  }

  const totalTaxCalc = (): number => {
    let total = 0
    for (let i = 0; i < saleInvoiceItems.length; i++) {
      total +=
        saleInvoiceItems[i].price * saleInvoiceItems[i].quantity * (saleInvoiceItems[i].tax / 100)
    }
    return roundNum(total)
  }

  const finalizePayment = (paymentMethod: 'CASH' | 'CREDIT'): void => {
    const total = roundNum(totalPriceCalc() + totalTaxCalc())
    if (total > 0 && saleInvoiceItems.length > 0) {
      setPayment({
        total: total,
        paymentMethod: paymentMethod
      })
      setSaleInvoice({
        userId: sessionContext?.id,
        customer: saleInvoice.customer,
        date: Date(),
        paymentMethod: paymentMethod,
        status: 'UNPAID'
      })
    } else {
      alert('No items')
    }
  }

  const paymentComplete = (invoiceType): void => {
    window.electron.ipcRenderer
      .invoke(
        'createSaleInvoice',
        {
          userId: sessionContext?.id,
          customer: saleInvoice.customer,
          date: Date(),
          paymentMethod: saleInvoice.paymentMethod,
          status: 'PAID'
        },
        saleInvoiceItems
      )
      .then((result) => {
        alert(result)
      })
      .catch((e) => {
        alert(e)
      })
    alert('Invoice :' + invoiceType)
    reset()
  }

  const handleKeyPad = (quantity): void => {
    if (keyPad && quantity == 0) {
      setSaleInvoiceItems((prev) => {
        return prev.filter((prev) => prev.itemId !== keyPad.itemId)
      })
    } else if (keyPad && quantity > 0) {
      setSaleInvoiceItems((prev) => {
        const foundIndex = prev.findIndex((o) => keyPad.itemId === o.itemId)
        if (prev[foundIndex].unit == 'UNIT' && !Number.isInteger(quantity)) {
          alert('Item sold By unit')
        } else {
          prev[foundIndex].quantity = quantity
        }
        return [...prev]
      })
    }
    setKeyPad(undefined)
  }

  const reset = (): void => {
    setSaleInvoice({
      status: 'WAITING',
      customer: ''
    })
    setSaleInvoiceItems([])
    setKeyPad(undefined)
    setPayment(undefined)
  }

  return (
    <div>
      {payment && (
        <Payment
          payment={payment}
          handleCancel={() => {
            setPayment(undefined)
          }}
          paymentComplete={paymentComplete}
        />
      )}
      {keyPad && (
        <KeyPad
          handleCancel={() => setKeyPad(undefined)}
          handleSubmit={handleKeyPad}
          title={keyPad?.name ?? ''}
        />
      )}
      <AddSaleInvoiceHeader
        addItemHandler={addItemHandler}
        setCustomer={setCustomer}
        customer={saleInvoice.customer || ''}
      />
      <AddSaleInvoiceItems items={saleInvoiceItems} setKeyPad={setKeyPad} />
      <div className="flex justify-end">
        <div className="text-xl p-2">
          Sub Total :<span className="p-2">{totalPriceCalc()}</span>
        </div>
        <div className="text-xl p-2">
          Tax :<span className="p-2">{totalTaxCalc()}</span>
        </div>
        <div className="text-xl p-2 bg-gray-200">
          Total :<span className="p-2">{roundNum(totalPriceCalc() + totalTaxCalc())}</span>
        </div>
      </div>
      <div className="flex m-4 justify-center">
        <div
          onClick={() => finalizePayment('CASH')}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-28 text-center mx-4 text-xl py-3"
        >
          Cash
        </div>
        <div
          onClick={() => finalizePayment('CREDIT')}
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
          onClick={reset}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-28 text-center mx-4 text-xl py-3"
        >
          Reset
        </div>
      </div>
    </div>
  )
}
