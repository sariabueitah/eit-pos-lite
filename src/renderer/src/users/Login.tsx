import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import FormAlerts from '../components/FormAlerts'
import { useTranslation } from 'react-i18next'

interface IFormInput {
  userName: string
  password: string
}

export default function Login(): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const userCheck = await window.electron.ipcRenderer.invoke('getUserByUserName', data.userName)
    if (userCheck) {
      const loginCheck = await window.electron.ipcRenderer.invoke('login', data)
      if (loginCheck) {
        navigate('/', { replace: true })
      } else {
        setError('password', { type: 'manual', message: t('Invalid password') })
      }
    } else {
      setError('userName', { type: 'manual', message: t('Invalid Username') })
    }
  }
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <form
        className="border rounded-2xl border-gray-400 p-4 w-80"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormAlerts alerts={errors} />
        <div className="mb-5">
          <label
            className={
              errors.userName
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            {t('User Name')}
          </label>
          <input
            {...register('userName', { required: t('User Name is required') })}
            name="userName"
            type="text"
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
              errors.password
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            {t('Password')}
          </label>
          <input
            {...register('password', { required: t('Password is required') })}
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
          {t('Login')}
        </button>
      </form>
    </div>
  )
}
