import { useState } from 'react'
import KeyPad from '../../components/KeyPad'
import { calTotalTax, calTotal } from '../../components/Math'

type Search = {
  type: 'Barcode' | 'Name' | 'ID'
  showType: boolean
  value: string
  searchResults: [{ name: string; id: number }] | []
}
export default function AddSaleInvoiceItems({
  items,
  setItems
}: {
  items: PurchaseInvoiceItem[]
  setItems: (items: PurchaseInvoiceItem[]) => void
}): JSX.Element {
  const searchTypesArray: Array<Search['type']> = ['Barcode', 'Name', 'ID']
  const [search, setSearch] = useState<Search>({
    type: 'Barcode',
    showType: false,
    value: '',
    searchResults: []
  })
  const [keypadInfo, setKeypadInfo] = useState<
    undefined | { itemId: number; name: string; value: number; discount: boolean }
  >(undefined)

  const handleKeypadInput = (value: number): void => {
    if (keypadInfo) {
      const tempItems = [...items]
      const itemIndex = tempItems.findIndex((item) => item.itemId === keypadInfo.itemId)
      if (itemIndex >= 0) {
        const spliced = tempItems.splice(itemIndex, 1)
        if (spliced[0].unit == 'Units' && !Number.isInteger(value)) {
          alert('Quantity must be an integer')
          return
        }
        spliced[0].quantity = value

        setItems([...spliced, ...tempItems])
      }
    }
    setKeypadInfo(undefined)
  }

  const handleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch((prev) => ({ ...prev, value: e.target.value }))
    if (search.type == 'Name') {
      window.electron.ipcRenderer
        .invoke('getItemByName', e.target.value)
        .then((result) => {
          setSearch((prev) => ({ ...prev, searchResults: result }))
        })
        .catch((e) => {
          alert(e)
        })
    } else {
      setSearch((prev) => ({ ...prev, searchResults: [] }))
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key == 'Enter' || e.key == 'Tab') {
      checkItem()
    }
  }

  const checkItem = (): void => {
    switch (search.type) {
      case 'Barcode':
        {
          window.electron.ipcRenderer
            .invoke('getItemByBarcode', search.value)
            .then((result) => {
              addItemFromScanner(result.id)
            })
            .catch((e) => {
              alert(e)
            })
        }
        break
      case 'ID':
        {
          window.electron.ipcRenderer
            .invoke('getItemById', search.value)
            .then((result) => {
              addItemFromScanner(result.id)
            })
            .catch((e) => {
              alert(e)
            })
        }
        break
      case 'Name':
        {
          if (search.searchResults.length > 0 && search.searchResults[0]) {
            addItemFromScanner(search.searchResults[0].id)
          } else {
            alert('error')
          }
        }
        break
      default: {
        alert('error')
      }
    }
  }

  const addItemFromScanner = (itemId: number): void => {
    const tempItems = [...items]
    const itemIndex = tempItems.findIndex((item) => item.itemId === itemId)
    if (itemIndex >= 0) {
      const spliced = tempItems.splice(itemIndex, 1)
      spliced[0].quantity += 1
      setItems([...spliced, ...tempItems])
    } else {
      window.electron.ipcRenderer.invoke('getItemById', itemId).then((result) => {
        const newItem = {
          itemId: result.id,
          barcode: result.barcode,
          name: result.name,
          unit: result.unit,
          quantity: 1,
          tax: result.tax,
          cost: result.cost
        } as PurchaseInvoiceItem
        setItems([newItem, ...tempItems])
      })
    }
    setSearch((prev) => ({ ...prev, value: '', searchResults: [] }))
  }

  return (
    <>
      <div className="col-span-4 flex items-center">
        <div className="w-full flex relative">
          <button
            onClick={() => setSearch((prev) => ({ ...prev, showType: !prev.showType }))}
            id="dropdown-button"
            className="w-36 shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200"
            type="button"
          >
            {search.type}
            <svg
              className="w-2.5 h-2.5 ms-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {search.showType && (
            <div
              id="dropdown"
              className="z-10 absolute top-11 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44"
            >
              <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdown-button">
                {searchTypesArray.map((value: typeof search.type) => {
                  if (value != search.type) {
                    return (
                      <li key={value}>
                        <button
                          type="button"
                          className="inline-flex w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            setSearch({
                              type: value,
                              showType: false,
                              value: '',
                              searchResults: []
                            })
                          }
                        >
                          {value}
                        </button>
                      </li>
                    )
                  } else {
                    return
                  }
                })}
              </ul>
            </div>
          )}
          <input
            onKeyDown={(e) => handleSearchKeyDown(e)}
            onChange={(e) => handleSearchOnChange(e)}
            value={search.value}
            type="text"
            name="scanner"
            id="scanner"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300"
          />
          {search.searchResults.length > 0 && search.value.trim() != '' && (
            <div className="z-10 absolute top-11 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full">
              <ul className="py-2 text-sm text-gray-700">
                {search.searchResults.map((value: { name: string; id: number }) => {
                  return (
                    <li
                      onClick={() => addItemFromScanner(value.id)}
                      key={value.id}
                      className="flex w-full px-4 py-2 hover:bg-gray-100 cursor-pointer justify-between"
                    >
                      <span>{value.name}</span>
                      <span>{value.id}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          <button
            onClick={checkItem}
            type="submit"
            className="absolute z-10 top-0 end-0 p-2.5 text-sm font-medium h-full text-gray-900 bg-gray-100 rounded-e-lg border border-gray-300 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
      <div className="col-span-4 mt-3">
        <div className="grid grid-cols-7 text-gray-700 uppercase bg-gray-200 text-xs font-bold">
          <div className="p-2">Barcode</div>
          <div className="p-2">Name</div>
          <div className="p-2">Unit</div>
          <div className="p-2 text-center">Price per unit</div>
          <div className="p-2 text-center">Quantity</div>
          <div className="p-2 text-center">Total Tax</div>
          <div className="p-2 text-center">Final Total</div>
        </div>
        <div className="h-[45vh] overflow-y-scroll bg-gray-300">
          {items.map((value) => {
            return (
              <div
                onClick={() =>
                  setKeypadInfo({
                    itemId: value.itemId,
                    name: value.name || '',
                    value: value.quantity,
                    discount: false
                  })
                }
                key={value.itemId}
                className="odd:bg-white even:bg-gray-100 grid grid-cols-7 text-gray-700"
              >
                <div className="text-gray-500 text-sm p-2">{value.barcode}</div>
                <div className="text-gray-500 text-sm p-2">{value.name}</div>
                <div className="text-gray-500 text-sm p-2">{value.unit}</div>
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
      {keypadInfo && (
        <KeyPad
          handleCancel={() => setKeypadInfo(undefined)}
          handleSubmit={handleKeypadInput}
          keypadInfo={keypadInfo}
        />
      )}
    </>
  )
}
