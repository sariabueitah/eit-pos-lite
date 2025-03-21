import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import FormAlerts from '../components/FormAlerts'

interface IFormInput {
  name: string
  user_name: string
  phone_number: string
  role: 'ADMIN' | 'USER'
  password: string
  confirm_password: string
}

export default function AddUser(): JSX.Element {
  const navigate = useNavigate()

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    let success = false
    try {
      await window.electron.ipcRenderer
        .invoke('createUser', {
          name: data.name,
          user_name: data.user_name,
          phone_number: data.phone_number,
          role: data.role,
          password: data.password
        })
        .then(() => {
          success = true
        })
        .catch((error) => {
          setError('root', { type: 'manual', message: error })
        })
    } catch (error) {
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message
      setError('root', { type: 'manual', message: message })
    }
    if (success) {
      navigate('/users', { replace: true })
    } else {
      setError('root', { type: 'manual', message: 'createUser request was not successfull' })
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
        <h1>Add User</h1>
        <FormAlerts alerts={errors} />
        <div className="mb-5">
          <label
            className={
              errors.name
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            Name
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            type="text"
            name="name"
            id="name"
            className={
              errors.name
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.user_name
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            Username
          </label>
          <input
            {...register('user_name', {
              required: 'Username is required',
              minLength: {
                value: 5,
                message: 'Username must be at least 5 characters'
              },
              validate: (value) => {
                return window.electron.ipcRenderer
                  .invoke('getUserbyUserName', value)
                  .then((result) => {
                    if (result) {
                      return 'Username already exists'
                    } else {
                      return true
                    }
                  })
              }
            })}
            type="text"
            name="user_name"
            id="user_name"
            className={
              errors.user_name
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.phone_number
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            Phone Number
          </label>
          <input
            {...register('phone_number', {
              required: 'Phone Number is required',
              minLength: {
                value: 10,
                message: 'Phone number must be at least 10 characters'
              }
            })}
            type="text"
            id="phone_number"
            name="phone_number"
            className={
              errors.phone_number
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.role
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            Role
          </label>
          <select
            {...register('role', { required: 'Role is required' })}
            name="role"
            id="role"
            className={
              errors.role
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div className="mb-5">
          <label
            className={
              errors.password
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            Password
          </label>
          <input
            {...register('password', {
              required: 'Password is required',
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
                message:
                  'Password must contain at least 6 characters, including letters and numbers'
              }
            })}
            type="password"
            id="password"
            name="password"
            className={
              errors.password
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.confirm_password
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            Confirm Password
          </label>
          <input
            {...register('confirm_password', {
              required: 'Confirm password is required',
              validate: (value, data) => {
                return value === data.password || 'The passwords do not match'
              }
            })}
            type="password"
            id="confirm_password"
            name="confirm_password"
            className={
              errors.confirm_password
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
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
  )
}
