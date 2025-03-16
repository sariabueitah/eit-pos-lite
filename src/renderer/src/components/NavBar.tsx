import { NavLink } from 'react-router-dom'

function NavBar(): JSX.Element {
  return (
    <nav className="bg-gray-400 p-1">
      <ul className="flex">
        <li className="cursor-pointer mx-2 hover:text-blue-600">
          <NavLink to="/">Login</NavLink>
        </li>
        <li className="cursor-pointer mx-2 hover:text-blue-600">
          <NavLink to="/users">Users</NavLink>
        </li>
        <li className="cursor-pointer mx-2 hover:text-blue-600">
          <NavLink to="/users/new">Add User</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
