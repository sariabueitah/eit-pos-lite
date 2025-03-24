import { useState, useEffect, useContext } from 'react'
import PageContext from '../contexts/PageContext'
import UserRow from './componants/UserRow'
import { NavLink } from 'react-router-dom'

export default function Users(): JSX.Element {
  const [userData, setUserData] = useState<User[]>([])

  const { setPageContext } = useContext(PageContext)
  useEffect(() => {
    setPageContext({ pageTitle: 'Users' })
  }, [setPageContext])

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getAllUsers')
      .then((result) => {
        setUserData(result)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const handleDelete = (id: number): void => {
    window.electron.ipcRenderer
      .invoke('deleteUser', id)
      .then(() => {
        setUserData((l) => (l ? l.filter((item) => item.id !== id) : []))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className="">
      <NavLink
        className="absolute bottom-4 right-4 border border-gray-300 hover:bg-gray-300 rounded-2xl"
        to="/users/new"
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
              Username
            </th>
            <th scope="col" className="p-2">
              Phone Number
            </th>
            <th scope="col" className="p-2">
              Role
            </th>
            <th scope="col" className="p-2">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {userData &&
            userData.map((object) => (
              <UserRow onDelete={() => handleDelete(object.id)} user={object} key={object.id} />
            ))}
        </tbody>
      </table>
    </div>
  )
}
