import { useNavigate, useParams } from 'react-router-dom'
import PageContext from '../contexts/PageContext'
import { useForm, SubmitHandler } from 'react-hook-form'
import FormAlerts from '../components/FormAlerts'
import { useContext, useEffect } from 'react'

interface IFormInput {
  name: string
  userName: string
  phoneNumber: string
  role: 'ADMIN' | 'USER'
  password: string
  confirmPassword: string
}

export default function EditUser(): JSX.Element {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setPageContext } = useContext(PageContext)
  useEffect(() => {
    setPageContext({ pageTitle: 'Edit User' })
  }, [setPageContext])

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    setValue
  } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    let success = false
    try {
      await window.electron.ipcRenderer
        .invoke('updateUser', id, {
          name: data.name,
          phoneNumber: data.phoneNumber,
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
      setError('root', { type: 'manual', message: 'updateUser request was not successfull' })
    }
  }

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getUserbyId', id)
      .then((result) => {
        setValue('name', result.name)
        setValue('userName', result.userName)
        setValue('phoneNumber', result.phoneNumber)
        setValue('role', result.role)
      })
      .catch((error) => {
        console.log('error')
        console.log(error)
      })
  }, [id, setValue])

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
        <label className="block mb-2 text-sm font-medium text-gray-900">Username</label>
        <input
          {...register('userName')}
          type="text"
          name="userName"
          id="userName"
          className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed"
          disabled
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
