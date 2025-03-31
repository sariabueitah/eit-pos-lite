import { useState } from 'react'

type searchObj = {
  type: 'Barcode' | 'Name' | 'ID'
  showType: boolean
  value: string
  searchResults: [{ name: string; id: number }] | []
}

export default function AddSaleInvoiceHeader(props: {
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
