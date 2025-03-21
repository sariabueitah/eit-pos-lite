import { NavLink } from 'react-router-dom'
import SessionContext from '../contexts/SessionContext'
import { useContext } from 'react'

function NavBar(): JSX.Element {
  const { sessionContext } = useContext(SessionContext)

  return (
    <nav className="bg-gray-400">
      <ul className="flex">
        {sessionContext && sessionContext.role === 'ADMIN' && (
          <>
            <li className="cursor-pointer mx-2 hover:text-blue-600">
              <NavLink to="/users">Users</NavLink>
            </li>
            <li className="cursor-pointer mx-2 hover:text-blue-600">
              <NavLink to="/users/new">Add User</NavLink>
            </li>
          </>
        )}
        {sessionContext !== undefined && (
          <>
            <li className="cursor-pointer mx-2 hover:text-blue-600">
              <NavLink to="/items">Items</NavLink>
            </li>
            <li className="cursor-pointer mx-2 hover:text-blue-600">
              <NavLink to="/items/new">Add Items</NavLink>
            </li>
            <li className="cursor-pointer mx-2 hover:text-blue-600">
              <NavLink to="/" onClick={() => window.electron.ipcRenderer.invoke('logout')}>
                Logout
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default NavBar
