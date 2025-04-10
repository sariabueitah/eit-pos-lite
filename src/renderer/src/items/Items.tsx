import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPage } from '../state/slices/PageSlice'
import ItemRow from './componants/ItemRow'
import { NavLink } from 'react-router-dom'

export default function Items(): JSX.Element {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage('Items'))
  }, [dispatch])

  const [itemData, seItemData] = useState<Item[]>([])
  const [search, setSearch] = useState('')
  const [deleted, setDeleted] = useState('ALL')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.electron.ipcRenderer.invoke('searchItems', search.trim(), deleted).then((result) => {
        seItemData(result)
      })
    }, 500)
    return (): void => clearTimeout(timeoutId)
  }, [search, deleted])

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getAllItems')
      .then((result) => {
        seItemData(result)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const handleDelete = (id: number): void => {
    window.electron.ipcRenderer
      .invoke('deleteItem', id)
      .then(() => {
        seItemData((l) => (l ? l.filter((item) => item.id !== id) : []))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className="">
      <NavLink
        className="absolute bottom-4 right-4 border border-gray-300 hover:bg-gray-300 rounded-2xl"
        to="/items/new"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-16"
        >
          <path
            fillRule="evenodd"
            d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      </NavLink>
      <div className="w-full grid grid-cols-4 gap-2 relative">
        <div className="col-span-4 flex items-center gap-2 justify-baseline">
          <input
            className="peer/all hidden"
            type="radio"
            id="radio1"
            name="radios"
            value="ALL"
            checked={deleted === 'ALL'}
            onChange={() => setDeleted('ALL')}
          />
          <label
            className="border border-gray-300 hover:bg-gray-300 py-1 px-3 cursor-pointer peer-checked/all:bg-gray-300 peer-checked/all:hover:bg-gray-400 rounded-xl"
            htmlFor="radio1"
          >
            All
          </label>
          <input
            className="peer/active hidden"
            type="radio"
            id="radio2"
            name="radios"
            value="ACTIVE"
            checked={deleted === 'ACTIVE'}
            onChange={() => setDeleted('ACTIVE')}
          />
          <label
            className="border border-gray-300 hover:bg-gray-300 py-1 px-3 cursor-pointer peer-checked/active:bg-gray-300 peer-checked/active:hover:bg-gray-400 rounded-xl"
            htmlFor="radio2"
          >
            Active
          </label>
          <input
            className="peer/deleted hidden"
            type="radio"
            id="radio3"
            name="radios"
            value="INACTIVE"
            checked={deleted === 'INACTIVE'}
            onChange={() => setDeleted('INACTIVE')}
          />
          <label
            className="border border-gray-300 hover:bg-gray-300 py-1 px-3 cursor-pointer peer-checked/deleted:bg-gray-300 peer-checked/deleted:hover:bg-gray-400 rounded-xl"
            htmlFor="radio3"
          >
            Deleted
          </label>
        </div>
        <div className="col-span-4 relative my-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            name="search"
            id="search"
            placeholder="Search By ID, Barcode or Name"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-gray-300 border"
          />
          <button
            type="submit"
            className="absolute z-10 top-0 end-0 p-2.5 text-sm font-medium h-full text-gray-900 bg-gray-100 rounded-e-lg border border-gray-300 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 overflow-scroll">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="p-2">
              ID
            </th>
            <th scope="col" className="p-2">
              Name
            </th>
            <th scope="col" className="p-2">
              Description
            </th>
            <th scope="col" className="p-2">
              barcode
            </th>
            <th scope="col" className="p-2">
              unit
            </th>
            <th scope="col" className="p-2">
              cost
            </th>
            <th scope="col" className="p-2">
              discount
            </th>
            <th scope="col" className="p-2">
              price
            </th>
            <th scope="col" className="p-2">
              tax
            </th>
            <th scope="col" className="p-2">
              category
            </th>
            <th scope="col" className="p-2">
              supplier
            </th>
            <th scope="col" className="p-2">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {itemData &&
            itemData.map((object) => (
              <ItemRow onDelete={() => handleDelete(object.id)} item={object} key={object.id} />
            ))}
        </tbody>
      </table>
    </div>
  )
}
