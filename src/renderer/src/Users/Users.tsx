import { useState, useEffect } from 'react'
import UserRow from './componants/UserRow'

export default function Users(): JSX.Element {
  const [userData, setUserData] = useState<User[]>([])

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
    <>
      <h1>Users Page</h1>

      <div className="">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
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
    </>
  )
}
