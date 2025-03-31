import { calculateTax, calculateTotal } from '../../components/Math'
import { TempItem } from '../AddSaleInvoices'

export default function AddSaleInvoiceItems({
  items,
  setKeyPad
}: {
  items: TempItem[]
  setKeyPad: (prev) => void
}): JSX.Element {
  return (
    <div className="mt-3">
      <div className="grid grid-cols-8 text-gray-700 uppercase bg-gray-200 text-xs font-bold">
        <div className="p-2">Barcode</div>
        <div className="p-2">Name</div>
        <div className="p-2">category</div>
        <div className="p-2">Unit</div>
        <div className="p-2 text-center">Price</div>
        <div className="p-2 text-center">Quantity</div>
        <div className="p-2 text-center">tax</div>
        <div className="p-2 text-center">total</div>
      </div>
      <div className="h-[50vh] overflow-y-scroll bg-gray-300">
        {items.map((value) => {
          return (
            <div
              onClick={() => setKeyPad({ itemId: value.itemId, name: value.name })}
              key={value.itemId}
              className="odd:bg-white even:bg-gray-100 grid grid-cols-8 text-gray-700"
            >
              <div className="text-gray-500 text-sm p-2">{value.barcode}</div>
              <div className="text-gray-500 text-sm p-2">{value.name}</div>
              <div className="text-gray-500 text-sm p-2">{value.category}</div>
              <div className="text-gray-500 text-sm p-2">{value.unit}</div>
              <div className="text-gray-500 text-sm p-2 text-center">{value.price}</div>
              <div className="text-gray-500 text-sm p-2 text-center">{value.quantity}</div>

              <div className="text-gray-500 text-sm p-2 text-center">
                {calculateTax(value.price, value.quantity, value.tax)}
              </div>
              <div className="text-gray-500 text-sm p-2 text-center">
                {calculateTotal(value.price, value.quantity, value.tax)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
