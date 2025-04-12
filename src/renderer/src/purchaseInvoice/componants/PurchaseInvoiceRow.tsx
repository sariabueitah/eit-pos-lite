import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
type Props = {
  purchaseInvoice: PurchaseInvoice
}
export default function PurchaseInvoiceRow(props: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <tr className="bg-white border-b border-gray-200">
      <td className="p-2">{props.purchaseInvoice.id}</td>
      <td className="p-2">{props.purchaseInvoice.name}</td>
      <td className="p-2">{props.purchaseInvoice.invoiceNumber}</td>
      <td className="p-2">{t(props.purchaseInvoice.status)}</td>
      <td className="p-2">{props.purchaseInvoice.paid}</td>
      <td className="p-2">{props.purchaseInvoice.totalPrice}</td>
      <td className="p-2">{new Date(props.purchaseInvoice.date).toLocaleString('en-GB')}</td>
      <td className="p-2">
        <button
          className="cursor-pointer"
          onClick={() =>
            navigate('/purchaseInvoices/' + props.purchaseInvoice.id, { replace: true })
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </button>
      </td>
    </tr>
  )
}
