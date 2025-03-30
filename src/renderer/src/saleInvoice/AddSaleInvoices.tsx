import PageContext from '../contexts/PageContext'
import SessionContext from '../contexts/SessionContext'
import { useContext, useEffect, useState } from 'react'

type TempItem = {
  itemId: number
  barcode: string
  name: string
  category: string
  price: number
  unit: number
  quantity: number
  tax: number
  cost: number
}

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

  const setCustomer = (name: string): void => {
    setSaleInvoice((prev) => ({
      ...prev,
      customer: name
    }))
  }

  const [saleInvoiceItems, setSaleInvoiceItems] = useState<TempItem[]>([])

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

  const finishItem = (paymentMethod: 'CASH' | 'CREDIT'): void => {
    window.electron.ipcRenderer
      .invoke(
        'test',
        {
          userId: sessionContext?.id,
          customer: saleInvoice.customer,
          date: Date(),
          paymentMethod: paymentMethod,
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
  }

  return (
    <div>
      <ASIHeader
        addItemHandler={addItemHandler}
        setCustomer={setCustomer}
        customer={saleInvoice.customer || ''}
      />
      <ASIItems items={saleInvoiceItems} />
      <div className="grid grid-cols-8">
        <div className="col-span-6 row-span-3 flex mt-4">
          <div
            onClick={() => finishItem('CASH')}
            className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl min-w-52 text-center p-5 mr-4 text-3xl"
          >
            Cash
          </div>
          <div
            onClick={() => finishItem('CREDIT')}
            className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl min-w-52 text-center p-5 mr-4 text-3xl"
          >
            Credit
          </div>
          <div
            onClick={() => {}}
            className="cursor-pointer bg-white hover:bg-gray-300 border-gray-300 border rounded-2xl min-w-52 text-center p-5 text-3xl"
          >
            Hold
          </div>
        </div>
        <div className="text-xl col-span-1 text-right bg-white">Total before Tax =</div>
        <div className="text-xl col-span-1 text-center bg-white">{totalPriceCalc()}</div>
        <div className="text-xl col-span-1 text-right bg-gray-100">Total Tax =</div>
        <div className="text-xl col-span-1 text-center bg-gray-100">{totalTaxCalc()}</div>
        <div className="text-xl col-span-1 text-right bg-white">Total after Tax =</div>
        <div className="text-xl col-span-1 text-center bg-white">
          {roundNum(totalPriceCalc() + totalTaxCalc())}
        </div>
      </div>
    </div>
  )
}

type searchObj = {
  type: 'Barcode' | 'Name' | 'ID'
  showType: boolean
  value: string
  searchResults: [{ name: string; id: number }] | []
}

function ASIHeader(props: {
  addItemHandler: (itemId) => void
  setCustomer: (name) => void
  customer: string
}): JSX.Element {
  const searchTypesArray: Array<searchObj['type']> = ['Barcode', 'Name', 'ID']

  const [searchObj, setSearchObj] = useState<searchObj>({
    type: 'Barcode',
    showType: false,
    value: '',
    searchResults: []
  })

  const handleChangeSearchType = (_, value: typeof searchObj.type): void => {
    setSearchObj((prev) => ({ ...prev, showType: false, type: value }))
    if (value == 'Name') {
      window.electron.ipcRenderer.invoke('searchItemByName', searchObj.value).then((result) => {
        setSearchObj((prev) => ({ ...prev, searchResults: result }))
      })
    } else {
      setSearchObj((prev) => ({ ...prev, searchResults: [] }))
    }
  }
  const toggleSearchType = (): void => {
    setSearchObj((prev) => ({ ...prev, showType: !prev.showType }))
  }

  const handleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchObj((prev) => ({ ...prev, value: e.target.value }))
    if (searchObj.type == 'Name') {
      window.electron.ipcRenderer
        .invoke('searchItemByName', e.target.value)
        .then((result) => {
          setSearchObj((prev) => ({ ...prev, searchResults: result }))
        })
        .catch((e) => {
          alert(e)
        })
    } else {
      setSearchObj((prev) => ({ ...prev, searchResults: [] }))
    }
  }

  const addItem = (): void => {
    switch (searchObj.type) {
      case 'Barcode':
        {
          window.electron.ipcRenderer
            .invoke('searchItemByBarcode', searchObj.value)
            .then((result) => {
              props.addItemHandler(result.id)
              setSearchObj((prev) => ({ ...prev, value: '', showType: false, searchResults: [] }))
            })
            .catch((e) => {
              alert(e)
            })
        }
        break
      case 'ID':
        {
          window.electron.ipcRenderer
            .invoke('searchItemById', searchObj.value)
            .then((result) => {
              props.addItemHandler(result.id)
              setSearchObj((prev) => ({ ...prev, value: '', showType: false, searchResults: [] }))
            })
            .catch((e) => {
              alert(e)
            })
        }
        break
      case 'Name':
        {
          if (searchObj.searchResults.length > 0 && searchObj.searchResults[0]) {
            props.addItemHandler(searchObj.searchResults[0].id)
            setSearchObj((prev) => ({ ...prev, value: '', showType: false, searchResults: [] }))
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

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key == 'Enter' || e.key == 'Tab') {
      addItem()
    }
  }

  const handleSelectSearch = (id: number): void => {
    props.addItemHandler(id)
    setSearchObj((prev) => ({ ...prev, value: '', searchResults: [] }))
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <div className="mt-6 flex items-center">
          <label className="block text-gray-900 mr-5">Customer:</label>
          <input
            onChange={(e) => props.setCustomer(e.target.value)}
            value={props.customer}
            type="text"
            name="customer"
            id="customer"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
        <div className="mt-5 flex relative">
          <button
            onClick={toggleSearchType}
            id="dropdown-button"
            className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200"
            type="button"
          >
            {searchObj.type}
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
          {searchObj.showType && (
            <div
              id="dropdown"
              className="z-10 absolute top-11 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44"
            >
              <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdown-button">
                {searchTypesArray.map((value: typeof searchObj.type) => {
                  if (value != searchObj.type) {
                    return (
                      <li key={value}>
                        <button
                          type="button"
                          className="inline-flex w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={(e) => handleChangeSearchType(e, value)}
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
          <div className="relative w-full">
            <input
              onKeyDown={(e) => handleSearchKeyDown(e)}
              onChange={(e) => handleSearchOnChange(e)}
              value={searchObj.value}
              type="search"
              name="scanner"
              id="scanner"
              className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300"
            />
            {searchObj.searchResults.length > 0 && searchObj.value.trim() != '' && (
              <div className="z-10 absolute top-11 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full">
                <ul className="py-2 text-sm text-gray-700">
                  {searchObj.searchResults.map((value: { name: string; id: number }) => {
                    return (
                      <li
                        onClick={() => handleSelectSearch(value.id)}
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
              onClick={addItem}
              type="submit"
              className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-gray-900 bg-gray-100 rounded-e-lg border border-gray-300 hover:bg-gray-200"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-1">
        <div className="text-center">Invoice Status</div>
        <div className="px-6  py-9 border text-center text-2xl bg-amber-300">Waiting</div>
      </div>
    </div>
  )
}

function ASIItems({ items }: { items: TempItem[] }): JSX.Element {
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
      <div className="h-[50vh] overflow-y-scroll">
        {items.map((value) => {
          return (
            <div
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
                {calculateItemTotal(value.price, value.quantity, value.tax)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function calculateTax(price: number, quantity: number, tax: number): number {
  const total = price * quantity
  return roundNum(total * (tax / 100))
}
function calculateItemTotal(price: number, quantity: number, tax: number): number {
  const total = price * quantity
  return roundNum(total * (tax / 100) + total)
}

function roundNum(number: number): number {
  return +(Math.round(Number(number + 'e+2')) + 'e-2')
}
