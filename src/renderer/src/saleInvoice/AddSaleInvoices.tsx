import { useDispatch, useSelector } from 'react-redux'
import { setPage, addHold, removeHold, showAlert, setLoading } from '../state/slices/PageSlice'
import { useEffect, useState } from 'react'
import AddSaleInvoiceItems from './componants/AddSaleInvoiceItems'
import { RootState } from '../state/store'
import { calTotal, calTotalDiscount, calTotalTax, roundNum } from '../components/Math'
import Payment from './componants/Payment'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function AddSaleInvoices(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const session = useSelector((state: RootState) => state.session.value)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage(t('Issue Sale Invoice')))
  }, [dispatch, t])

  const [invoiceData, setInvoiceData] = useState<Partial<SaleInvoice>>({
    status: 'WAITING',
    customer: '',
    userId: session?.id,
    date: new Date().getTime()
  })

  const [invoiceItemsData, setInvoiceItemsData] = useState<SaleInvoiceItem[]>([])

  const [paymentDetails, setPaymentDetails] = useState<
    undefined | { paymentMethod: 'CASH' | 'CREDIT'; total: number }
  >(undefined)

  const [searchParams] = useSearchParams()
  const holdId = searchParams.get('holdId')
  useEffect(() => {
    if (!holdId) return
    window.electron.ipcRenderer
      .invoke('getTempSaleInvoiceItemBySaleInvoiceId', holdId)
      .then((results) => {
        setInvoiceItemsData(results)
      })
      .catch((e) => {
        dispatch(showAlert(`${t('Data not retrieved')}: ` + e.message))
      })
    window.electron.ipcRenderer
      .invoke('getTempSaleInvoiceById', holdId)
      .then((result) => {
        if (result === undefined) navigate('/saleInvoices/new', { replace: true })
        setInvoiceData(result)
        window.electron.ipcRenderer.invoke('deleteTempSaleInvoiceItemBySaleInvoiceId', holdId)
        window.electron.ipcRenderer.invoke('deleteTempSaleInvoiceById', holdId).then(() => {
          dispatch(removeHold())
        })
      })
      .catch((e) => {
        dispatch(showAlert(`${t('Data not retrieved')}: ` + e.message))
      })
  }, [dispatch, holdId, navigate, t])

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
      dispatch(showAlert(t('Please add items first')))
    }
  }

  const completePayment = (print: boolean): void => {
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
      .then((result) => {
        if (print) {
          dispatch(setLoading(true))
          window.electron.ipcRenderer
            .invoke('printSaleInvoice', result.saleInvoice.id)
            .then(() => {
              dispatch(setLoading(false))
            })
            .catch((e) => {
              dispatch(setLoading(false))
              dispatch(showAlert(t(e.message)))
            })
        }
      })
      .catch((e) => {
        dispatch(showAlert(`${t('Error creating Record')}: ` + e.message))
      })
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
          dispatch(showAlert(t('Invoice on Hold with number') + ' ' + result.tempSaleInvoice.id))
          resetForm()
          dispatch(addHold())
          if (holdId) navigate('/saleInvoices/new', { replace: true })
        })
        .catch((e) => {
          dispatch(showAlert(`${t('Error creating Record')}: ` + e.message))
        })
    } else {
      dispatch(showAlert(t('Please add items first')))
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
              {t('Invoice ID')}:
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
              {t('Status')}:
            </label>
            <div className="relative w-full">
              <p className="p-2.5 w-full min-h-10.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 cursor-not-allowed">
                {invoiceData.status !== undefined ? t(invoiceData.status) : ''}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-4 flex items-center">
          <div className="w-full flex relative">
            <label className="w-26 shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              {t('Customer')}:
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
          {t('Sub Total')}: <span className="p-2">{itemsTotal()}</span>
        </div>
        <div className="text-xl p-2">
          {t('discount')}: <span className="p-2">{itemsTotalDiscount()}</span>
        </div>
        <div className="text-xl p-2">
          {t('tax')}: <span className="p-2">{itemsTotalTax()}</span>
        </div>
        <div className="text-xl p-2 bg-gray-200">
          {t('total')}:<span className="p-2">{itemsFinalTotal()}</span>
        </div>
      </div>
      <div className="flex m-4 justify-center">
        <div
          onClick={() => {
            handleFinalizePayment('CASH')
          }}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-40 text-center mx-4 text-xl py-3"
        >
          {t('Payment(Cash)')}
        </div>
        <div
          onClick={() => {
            handleFinalizePayment('CREDIT')
          }}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-40 text-center mx-4 text-xl py-3"
        >
          {t('Payment(Credit)')}
        </div>
        <div
          onClick={() => {
            holdInvoice()
          }}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-40 text-center mx-4 text-xl py-3"
        >
          {t('Hold')}
        </div>
        <div
          onClick={resetForm}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-40 text-center mx-4 text-xl py-3"
        >
          {t('Reset')}
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
