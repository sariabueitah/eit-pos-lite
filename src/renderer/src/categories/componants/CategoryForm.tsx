import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import FormAlerts from '../../components/FormAlerts'
import { useTranslation } from 'react-i18next'

interface IFormInput {
  name: string
}

export default function CategoryForm(props: {
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
      .invoke('getCategoryById', id)
      .then((result) => {
        setValue('name', result.name)
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
          {...register('name', {
            required: t('Name is required'),
            validate: (value) => {
              return window.electron.ipcRenderer
                .invoke('getCategoryByName', value)
                .then((result) => {
                  if (result && result.id !== Number(id)) {
                    return t('Name matches another category')
                  } else {
                    return true
                  }
                })
            }
          })}
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
