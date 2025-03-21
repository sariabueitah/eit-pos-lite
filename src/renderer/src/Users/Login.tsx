import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import FormAlerts from '../components/FormAlerts'

interface IFormInput {
  user_name: string
  password: string
}

export default function Login(): JSX.Element {
  const navigate = useNavigate()

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const userCheck = await window.electron.ipcRenderer.invoke('getUserbyUserName', data.user_name)
    if (userCheck) {
      const loginCheck = await window.electron.ipcRenderer.invoke('login', data)
      if (loginCheck) {
        navigate('/users', { replace: true })
      } else {
        setError('password', { type: 'manual', message: 'Invalid password' })
      }
    } else {
      setError('user_name', { type: 'manual', message: 'Invalid Username' })
    }
  }
  return (
    <>
      <div>
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-center">Login Page</h1>
          <FormAlerts alerts={errors} />
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
              {...register('user_name', { required: 'Username is required' })}
              name="user_name"
              type="text"
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
                errors.password
                  ? 'block mb-2 text-sm font-medium text-red-900'
                  : 'block mb-2 text-sm font-medium text-gray-900'
              }
            >
              Password
            </label>
            <input
              {...register('password', { required: 'Password is required' })}
              aria-invalid={errors.password ? 'true' : 'false'}
              name="password"
              type="password"
              id="password"
              className={
                errors.password
                  ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                  : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              }
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
          >
            Login
          </button>
        </form>
      </div>
    </>
  )
}
