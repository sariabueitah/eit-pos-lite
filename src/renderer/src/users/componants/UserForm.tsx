import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import FormAlerts from '../../components/FormAlerts'
import { useTranslation } from 'react-i18next'

interface IFormInput {
  name: string
  userName: string
  phoneNumber: string
  role: 'ADMIN' | 'USER'
  password: string
  confirmPassword: string
}
export default function UserForm(props: {
  onSubmit: (setError, id, data) => void
  onBack: () => void
}): JSX.Element {
  const { t } = useTranslation()
  const { id } = useParams()
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    setValue
  } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    props.onSubmit(setError, id, data)
  }

  useEffect(() => {
    if (id === undefined) return
    window.electron.ipcRenderer
      .invoke('getUserById', id)
      .then((result) => {
        setValue('name', result.name)
        setValue('userName', result.userName)
        setValue('phoneNumber', result.phoneNumber)
        setValue('role', result.role)
      })
      .catch((error) => {
        setError('root', { type: 'manual', message: error + ' ' + t('Data not retrieved') })
      })
  }, [id, setError, setValue, t])

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
          {t('Name')}
        </label>
        <input
          {...register('name', { required: t('Name is required') })}
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
          {t('User Name')}
        </label>
        <input
          {...register('userName', {
            required: t('User Name is required'),
            minLength: {
              value: 5,
              message: t('User Name must be at least 5 characters')
            },
            validate: (value) => {
              return window.electron.ipcRenderer
                .invoke('getUserByUserName', value)
                .then((result) => {
                  if (result && result.id !== Number(id)) {
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
          disabled={id !== undefined}
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
          {t('Phone Number')}
        </label>
        <input
          {...register('phoneNumber', {
            required: t('Phone Number is required'),
            minLength: {
              value: 10,
              message: t('Phone number must be at least 10 numbers long')
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
          {t('Role')}
        </label>
        <select
          {...register('role', { required: t('Role is required') })}
          name="role"
          id="role"
          className={
            errors.role
              ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
              : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
          }
        >
          <option value="USER">{t('User')}</option>
          <option value="ADMIN">{t('Admin')}</option>
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
          {t('Password')}
        </label>
        <input
          {...register('password', {
            required: t('Password is required'),
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
              message: t(
                'Password must contain at least 6 characters, including letters and numbers'
              )
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
          {t('Confirm Password')}
        </label>
        <input
          {...register('confirmPassword', {
            required: t('Confirm password is required'),
            validate: (value, data) => {
              return value === data.password || t('The passwords do not match')
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
          {t('Submit')}
        </button>
        <button
          onClick={props.onBack}
          className="hover:bg-gray-300 border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-4"
        >
          {t('Back')}
        </button>
      </div>
    </form>
  )
}
