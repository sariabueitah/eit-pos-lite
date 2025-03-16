import { Routes, Route } from 'react-router-dom'
import Login from './Users/Login'
import Users from './Users/Users'
import AddUser from './Users/AddUser'
import EditUser from './Users/EditUser'
import NavBar from './components/NavBar'

function App(): JSX.Element {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/new" element={<AddUser />} />
        <Route path="/users/edit/:id" element={<EditUser />} />
      </Routes>
    </>
  )
}

export default App
