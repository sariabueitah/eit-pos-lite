import { calTotal, calTotalDiscount, calTotalTax, roundNum } from '../components/Math'
import { setPage, showAlert } from '../state/slices/PageSlice'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

export default function SaleInvoice(): JSX.Element {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage(`${t('Sale Invoice')} #${id}`))
  }, [dispatch, id, t])

  const [saleInvoice, setSaleInvoice] = useState<SaleInvoice>()
  const [saleInvoiceItems, setSaleInvoiceItems] = useState<SaleInvoiceItem[]>([])

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getSaleInvoiceById', id)
      .then((result) => {
        setSaleInvoice(result)
      })
      .catch((e) => {
        dispatch(showAlert(`${t('Data not retrieved')}: ` + e.message))
      })
    window.electron.ipcRenderer
      .invoke('getSaleInvoiceItemsBySaleInvoiceId', id)
      .then((results) => {
        setSaleInvoiceItems(results)
      })
      .catch((e) => {
        dispatch(showAlert(`${t('Data not retrieved')}: ` + e.message))
      })
  }, [dispatch, id, t])

  const itemsTotal = (): number => {
    let total = 0
    saleInvoiceItems.forEach((item) => {
      total += item.price * item.quantity
    })
    return roundNum(total)
  }

  const itemsTotalDiscount = (): number => {
    let total = 0
    saleInvoiceItems.forEach((item) => {
      total += calTotalDiscount(item.quantity, item.discount)
    })
    return roundNum(total)
  }

  const itemsTotalTax = (): number => {
    let total = 0
    saleInvoiceItems.forEach((item) => {
      total += calTotalTax(item.price, item.quantity, item.discount, item.tax)
    })
    return roundNum(total)
  }

  const itemsFinalTotal = (): number => {
    let total = 0
    saleInvoiceItems.forEach((item) => {
      total += calTotal(item.price, item.quantity, item.discount, item.tax)
    })
    return roundNum(total)
  }
  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 flex items-center">
          <div className="w-full flex relative">
            <label className="w-32 shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              {t('Invoice ID')}:
            </label>
            <div className="relative w-full">
              <p className="p-2.5 w-full min-h-10.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 cursor-not-allowed">
                {saleInvoice?.id}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex items-center">
          <div className="w-full flex relative">
            <label className="w-32 shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              {t('Date')}:
            </label>
            <div className="relative w-full">
              <p className="p-2.5 w-full min-h-10.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 cursor-not-allowed">
                {saleInvoice?.date && new Date(saleInvoice?.date).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex items-center">
          <div className="w-full flex relative">
            <label className="w-32 shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              {t('User ID')}:
            </label>
            <div className="relative w-full">
              <p className="p-2.5 w-full min-h-10.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 cursor-not-allowed">
                {saleInvoice?.userId}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex items-center">
          <div className="w-full flex relative">
            <label className="w-32 shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              {t('Status')}:
            </label>
            <div className="relative w-full">
              <p className="p-2.5 w-full min-h-10.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 cursor-not-allowed">
                {saleInvoice?.status && typeof saleInvoice.status === 'string'
                  ? t(saleInvoice.status)
                  : ''}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-3 flex items-center">
          <div className="w-full flex relative">
            <label className="w-32 shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              {t('Customer')}:
            </label>
            <p className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300">
              {saleInvoice?.customer}
            </p>
          </div>
        </div>
        <div className="col-span-1 flex items-center">
          <div className="w-full flex relative">
            <label className="w-32 shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              {t('Payment Method')}:
            </label>
            <div className="relative w-full">
              <p className="p-2.5 w-full min-h-10.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 cursor-not-allowed">
                {t(saleInvoice?.paymentMethod || '')}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-4 mt-3">
        <div className="grid grid-cols-9 text-gray-700 uppercase bg-gray-200 text-xs font-bold">
          <div className="p-2">{t('ID')}</div>
          <div className="p-2">{t('Barcode')}</div>
          <div className="p-2">{t('Name')}</div>
          <div className="p-2">{t('Unit')}</div>
          <div className="p-2 text-center">{t('Price per unit')}</div>
          <div className="p-2 text-center">{t('Quantity')}</div>
          <div className="p-2 text-center">{t('Total Discount')}</div>
          <div className="p-2 text-center">{t('Total Tax')}</div>
          <div className="p-2 text-center">{t('Final Total')}</div>
        </div>
        <div className="max-h-[45vh] overflow-y-scroll bg-gray-300">
          {saleInvoiceItems.map((value) => {
            return (
              <div
                key={value.id}
                className="odd:bg-white even:bg-gray-100 grid grid-cols-9 text-gray-700"
              >
                <div className="text-gray-500 text-sm p-2">{value.id}</div>
                <div className="text-gray-500 text-sm p-2">{value.barcode}</div>
                <div className="text-gray-500 text-sm p-2">{value.name}</div>
                <div className="text-gray-500 text-sm p-2">{value.unit && t(value.unit)}</div>
                <div className="text-gray-500 text-sm p-2 text-center">{value.price}</div>
                <div className="text-gray-500 text-sm p-2 text-center">{value.quantity}</div>
                <div className="text-gray-500 text-sm p-2 text-center">
                  {calTotalDiscount(value.quantity, value.discount)}
                </div>
                <div className="text-gray-500 text-sm p-2 text-center">
                  {calTotalTax(value.price, value.quantity, value.discount, value.tax)}
                </div>
                <div className="text-gray-500 text-sm p-2 text-center">
                  {calTotal(value.price, value.quantity, value.discount, value.tax)}
                </div>
              </div>
            )
          })}
        </div>
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
          onClick={() => navigate('/saleInvoices', { replace: true })}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-40 text-center mx-4 text-xl py-3"
        >
          {t('Back')}
        </div>
        <div
          onClick={() => {}}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-40 text-center mx-4 text-xl py-3"
        >
          {t('Print Invoice')}
        </div>
        <div
          onClick={() => {}}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-40 text-center mx-4 text-xl py-3"
        >
          {t('Print Invoice(A4)')}
        </div>
        <div
          onClick={() => {}}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-40 text-center mx-4 text-xl py-3"
        >
          {t('Cancel')}
        </div>
      </div>
    </>
  )
}
