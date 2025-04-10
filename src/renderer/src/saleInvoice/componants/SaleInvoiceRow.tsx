type Props = {
  saleInvoice: SaleInvoice
}
export default function SaleInvoiceRow(props: Props): JSX.Element {
  return (
    <tr className="bg-white border-b border-gray-200">
      <td className="p-2">{props.saleInvoice.id}</td>
      <td className="p-2">{props.saleInvoice.customer}</td>
      <td className="p-2">{props.saleInvoice.status}</td>
      <td className="p-2">{props.saleInvoice.paymentMethod}</td>
      <td className="p-2">{props.saleInvoice.userName}</td>
      <td className="p-2">{new Date(props.saleInvoice.date).toLocaleString('en-GB')}</td>
      <td className="p-2"></td>
    </tr>
  )
}
