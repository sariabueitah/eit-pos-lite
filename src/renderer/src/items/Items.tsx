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
