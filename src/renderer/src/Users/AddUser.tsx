import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setPage } from '../state/slices/PageSlice'
import { setLoading } from '../state/slices/LoadingSlice'
import { useForm, SubmitHandler } from 'react-hook-form'
import FormAlerts from '../components/FormAlerts'
import { useEffect } from 'react'

interface IFormInput {
  name: string
  userName: string
  phoneNumber: string
  role: 'ADMIN' | 'USER'
  password: string
  confirmPassword: string
}

export default function AddUser(): JSX.Element {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage('Add User'))
  }, [dispatch])

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    dispatch(setLoading(true))
    window.electron.ipcRenderer
      .invoke('addUser', {
        name: data.name,
        userName: data.userName,
        phoneNumber: data.phoneNumber,
        role: data.role,
        password: data.password
      })
      .then(() => {
        navigate('/users', { replace: true })
        dispatch(setLoading(false))
      })
      .catch((error) => {
        setError('root', { type: 'manual', message: error })
        dispatch(setLoading(false))
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-1/3 mx-auto">
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
            errors.userName
              ? 'block mb-2 text-sm font-medium text-red-900'
              : 'block mb-2 text-sm font-medium text-gray-900'
          }
        >
          Username
        </label>
        <input
          {...register('userName', {
            required: 'Username is required',
            minLength: {
              value: 5,
              message: 'Username must be at least 5 characters'
            },
            validate: (value) => {
              return window.electron.ipcRenderer
                .invoke('getUserByUserName', value)
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
          name="userName"
          id="userName"
          className={
            errors.userName
              ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
              : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
          }
        />
      </div>
      <div className="mb-5">
        <label
          className={
            errors.phoneNumber
              ? 'block mb-2 text-sm font-medium text-red-900'
              : 'block mb-2 text-sm font-medium text-gray-900'
          }
        >
          Phone Number
        </label>
        <input
          {...register('phoneNumber', {
            required: 'Phone Number is required',
            minLength: {
              value: 10,
              message: 'Phone number must be at least 10 characters'
            }
          })}
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          className={
            errors.phoneNumber
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
              message: 'Password must contain at least 6 characters, including letters and numbers'
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
            errors.confirmPassword
              ? 'block mb-2 text-sm font-medium text-red-900'
              : 'block mb-2 text-sm font-medium text-gray-900'
          }
        >
          Confirm Password
        </label>
        <input
          {...register('confirmPassword', {
            required: 'Confirm password is required',
            validate: (value, data) => {
              return value === data.password || 'The passwords do not match'
            }
          })}
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className={
            errors.confirmPassword
              ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
              : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
          }
        />
      </div>
      <div>
        <button
          type="submit"
          className="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Submit
        </button>
        <button
          onClick={() => {
            navigate('/users', { replace: true })
          }}
          className="hover:bg-gray-300 border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-4"
        >
          Back
        </button>
      </div>
    </form>
  )
}
