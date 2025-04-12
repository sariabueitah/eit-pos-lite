import { calTotal, calTotalDiscount, calTotalTax, roundNum } from '../components/Math'
import { setPage } from '../state/slices/PageSlice'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

export default function PurchaseInvoice(): JSX.Element {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage(`${t('Purchase Invoice')} #${id}`))
  }, [dispatch, id, t])

  const [purchaseInvoice, setPurchaseInvoice] = useState<PurchaseInvoice>()
  const [purchaseInvoiceItems, setPurchaseInvoiceItems] = useState<PurchaseInvoiceItem[]>([])

  useEffect(() => {
    //TODO check catch
    window.electron.ipcRenderer
      .invoke('getPurchaseInvoiceById', id)
      .then((result) => {
        setPurchaseInvoice(result)
      })
      .catch()
    //TODO check catch
    window.electron.ipcRenderer
      .invoke('getPurchaseInvoiceItemsByPurchaseInvoiceId', id)
      .then((results) => {
        setPurchaseInvoiceItems(results)
      })
      .catch()
  }, [id])

  const itemsTotal = (): number => {
    let total = 0
    purchaseInvoiceItems.forEach((item) => {
      total += item.cost * item.quantity
    })
    return roundNum(total)
  }

  const itemsTotalDiscount = (): number => {
    let total = 0
    purchaseInvoiceItems.forEach((item) => {
      total += calTotalDiscount(item.quantity, 0)
    })
    return roundNum(total)
  }

  const itemsTotalTax = (): number => {
    let total = 0
    purchaseInvoiceItems.forEach((item) => {
      total += calTotalTax(item.cost, item.quantity, 0, item.tax)
    })
    return roundNum(total)
  }

  const itemsFinalTotal = (): number => {
    let total = 0
    purchaseInvoiceItems.forEach((item) => {
      total += calTotal(item.cost, item.quantity, 0, item.tax)
    })
    return roundNum(total)
  }
  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 flex items-center">
          <div className="w-full flex relative">
            <label className="w-36 shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              {t('Invoice ID')}:
            </label>
            <div className="relative w-full">
              <p className="p-2.5 w-full min-h-10.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 cursor-not-allowed">
                {purchaseInvoice?.id}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex items-center">
          <div className="w-full flex relative">
            <label className="w-36 shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              {t('Date')}:
            </label>
            <div className="relative w-full">
              <p className="p-2.5 w-full min-h-10.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 cursor-not-allowed">
                {purchaseInvoice?.date && new Date(purchaseInvoice?.date).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex items-center">
          <div className="w-full flex relative">
            <label className="w-36 shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              {t('supplier')}:
            </label>
            <div className="relative w-full">
              <p className="p-2.5 w-full min-h-10.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 cursor-not-allowed">
                {purchaseInvoice?.name}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex items-center">
          <div className="w-full flex relative">
            <label className="w-36 shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              {t('Status')}:
            </label>
            <div className="relative w-full">
              <p className="p-2.5 w-full min-h-10.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 cursor-not-allowed">
                {purchaseInvoice?.status}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex items-center">
          <div className="w-full flex relative">
            <label className="w-36 shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              {t('Invoice Number')}:
            </label>
            <div className="relative w-full">
              <p className="p-2.5 w-full min-h-10.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 cursor-not-allowed">
                {purchaseInvoice?.invoiceNumber}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex items-center">
          <div className="w-full flex relative">
            <label className="w-36 shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              {t('Paid Amount')}:
            </label>
            <p className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300">
              {purchaseInvoice?.paid}
            </p>
          </div>
        </div>
        <div className="col-span-1 flex items-center">
          <div className="w-full flex relative">
            <label className="w-36 shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              {t('Total Amount')}:
            </label>
            <div className="relative w-full">
              <p className="p-2.5 w-full min-h-10.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 cursor-not-allowed">
                {purchaseInvoice?.totalPrice}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex items-center">
          <div className="w-full flex relative">
            <label className="w-36 shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200">
              {t('balance')}:
            </label>
            <div className="relative w-full">
              <p className="p-2.5 w-full min-h-10.5 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 cursor-not-allowed">
                {(purchaseInvoice?.totalPrice ?? 0) - (purchaseInvoice?.paid ?? 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-4 mt-3">
        <div className="grid grid-cols-8 text-gray-700 uppercase bg-gray-200 text-xs font-bold">
          <div className="p-2">{t('ID')}</div>
          <div className="p-2">{t('Barcode')}</div>
          <div className="p-2">{t('Name')}</div>
          <div className="p-2">{t('Unit')}</div>
          <div className="p-2 text-center">{t('Price per unit')}</div>
          <div className="p-2 text-center">{t('Quantity')}</div>
          <div className="p-2 text-center">{t('Total Tax')}</div>
          <div className="p-2 text-center">{t('Final Total')}</div>
        </div>
        <div className="max-h-[45vh] overflow-y-scroll bg-gray-300">
          {purchaseInvoiceItems.map((value) => {
            return (
              <div
                key={value.id}
                className="odd:bg-white even:bg-gray-100 grid grid-cols-8 text-gray-700"
              >
                <div className="text-gray-500 text-sm p-2">{value.id}</div>
                <div className="text-gray-500 text-sm p-2">{value.barcode}</div>
                <div className="text-gray-500 text-sm p-2">{value.name}</div>
                <div className="text-gray-500 text-sm p-2">{value.unit ? t(value.unit) : ''}</div>
                <div className="text-gray-500 text-sm p-2 text-center">{value.cost}</div>
                <div className="text-gray-500 text-sm p-2 text-center">{value.quantity}</div>
                <div className="text-gray-500 text-sm p-2 text-center">
                  {calTotalTax(value.cost, value.quantity, 0, value.tax)}
                </div>
                <div className="text-gray-500 text-sm p-2 text-center">
                  {calTotal(value.cost, value.quantity, 0, value.tax)}
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
          onClick={() => navigate('/purchaseInvoices', { replace: true })}
          className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl w-1/3 max-w-40 text-center mx-4 text-xl py-3"
        >
          {t('Back')}
        </div>
      </div>
    </>
  )
}
