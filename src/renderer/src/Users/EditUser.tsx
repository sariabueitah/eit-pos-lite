import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditUser(): JSX.Element {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: '',
    user_name: '',
    phone_number: '',
    role: 'USER',
    password: ''
  })

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getUserbyId', id)
      .then((result) => {
        console.log(result)
        setUser((prevUser) => ({ ...prevUser, ...result }))
      })
      .catch((error) => {
        console.log(error)
      })
  }, [id])

  const [confirmPassword, setConfirmPassword] = useState('')

  const handleChange = (event): void => {
    setUser({ ...user, [event.target.name]: event.target.value })
  }

  const handleConfirmPassword = (event): void => {
    setConfirmPassword(event.target.value)
  }

  const handleSubmit = async (event): Promise<void> => {
    let success = false
    event.preventDefault()
    try {
      await window.electron.ipcRenderer
        .invoke('updateUser', id, user)
        .then((result) => {
          console.log('success')
          console.log(result)
          success = true
        })
        .catch((error) => {
          console.log('error')
          console.log(error)
        })
    } catch (e) {
      console.log('error catch')
      console.log(e)
    }
    if (success) {
      navigate('/users', { replace: true })
    } else {
      console.log('error')
    }
  }

  return (
    <>
      <div>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <h1>Edit User</h1>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleChange}
              value={user.name}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">Username</label>
            <input
              type="text"
              name="user_name"
              id="user_name"
              onChange={handleChange}
              value={user.user_name}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">Phone Number</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              onChange={handleChange}
              value={user.phone_number}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">Role</label>
            <select
              name="role"
              onChange={handleChange}
              value={user.role}
              id="role"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={user.password}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">Confirm Password</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              onChange={handleConfirmPassword}
              value={confirmPassword}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  )
}
