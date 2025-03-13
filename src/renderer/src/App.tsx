import { Routes, Route } from 'react-router-dom'
import Login from './Users/Login'
import Users from './Users/Users'
import NavBar from './components/NavBar'

function App(): JSX.Element {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </>
  )
}

export default App
