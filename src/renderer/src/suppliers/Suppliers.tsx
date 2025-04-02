import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPage } from '../state/slices/PageSlice'
import SupplierRow from './componants/SupplierRow'
import { NavLink } from 'react-router-dom'

export default function Users(): JSX.Element {
  const [supplierData, setSupplierData] = useState<Supplier[]>([])

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage('Suppliers'))
  }, [dispatch])

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getAllSuppliers')
      .then((result) => {
        setSupplierData(result)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const handleDelete = (id: number): void => {
    window.electron.ipcRenderer
      .invoke('deleteSupplier', id)
      .then(() => {
        setSupplierData((l) => (l ? l.filter((item) => item.id !== id) : []))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className="">
      <NavLink
        className="absolute bottom-4 right-4 border border-gray-300 hover:bg-gray-300 rounded-2xl"
        to="/suppliers/new"
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
      <table className="w-full text-sm text-left text-gray-500 overflow-x-scroll">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="p-2">
              ID
            </th>
            <th scope="col" className="p-2">
              Name
            </th>
            <th scope="col" className="p-2">
              Phone Number
            </th>
            <th scope="col" className="p-2">
              Tax Number
            </th>
            <th scope="col" className="p-2">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {supplierData &&
            supplierData.map((object) => (
              <SupplierRow
                onDelete={() => handleDelete(object.id)}
                supplier={object}
                key={object.id}
              />
            ))}
        </tbody>
      </table>
    </div>
  )
}
