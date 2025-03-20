import AlertContext from '../contexts/AlertContext'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(): JSX.Element {
  const navigate = useNavigate()
  const { setAlertContext } = useContext(AlertContext)
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event): Promise<void> => {
    event.preventDefault()
    const x = await window.electron.ipcRenderer.invoke('login', {
      userName: userName,
      password: password
    })
    if (x) {
      navigate('/users', { replace: true })
    } else {
      setAlertContext({ error: true, message: 'Invalid username or password' })
    }
  }
  return (
    <>
      <div>
        <form className="max-w-sm mx-auto">
          <h1 className="text-center">Login Page</h1>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">Username</label>
            <input
              onChange={(event) => setUserName(event.target.value)}
              value={userName}
              type="text"
              id="userName"
              name="userName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <input
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              name="password"
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <button
            onClick={handleLogin}
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Login
          </button>
        </form>
      </div>
    </>
  )
}
