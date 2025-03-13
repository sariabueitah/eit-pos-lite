import { useState, useEffect } from 'react'
import UserRow from './componants/UserRow'

export default function Users(): JSX.Element {
  const userData = useUserData()
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
            </tr>
          </thead>
          <tbody>{userData && userData.map((object, i) => <UserRow obj={object} key={i} />)}</tbody>
        </table>
      </div>
    </>
  )
}

function useUserData(): [User] | undefined {
  const [userData, setUserData] = useState<[User]>()

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setUserData(await window.api.getAllUserData())
    }
    fetchData()
  }, [])

  return userData
}
