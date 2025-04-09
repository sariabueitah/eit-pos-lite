import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import FormAlerts from '../../components/FormAlerts'

interface IFormInput {
  name: string
  phoneNumber: string
  taxNumber: string
}

export default function SupplierForm(props: {
  onSubmit: (setError, id, data) => void
  onBack: () => void
}): JSX.Element {
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
    window.electron.ipcRenderer
      .invoke('getSupplierById', id)
      .then((result) => {
        setValue('name', result.name)
        setValue('phoneNumber', result.phoneNumber)
        setValue('taxNumber', result.taxNumber)
      })
      .catch((error) => {
        setError('root', { type: 'manual', message: error + ' Data not retrieved' })
      })
  }, [id, setError, setValue])

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
          {...register('name', {
            required: 'Name is required',
            validate: (value) => {
              return window.electron.ipcRenderer
                .invoke('getSupplierByName', value)
                .then((result) => {
                  if (result && result.id !== Number(id)) {
                    return 'Name matches another supplier'
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
          {...register('phoneNumber', { required: 'Phone Number is required' })}
          type="text"
          name="phoneNumber"
          id="phoneNumber"
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
            errors.taxNumber
              ? 'block mb-2 text-sm font-medium text-red-900'
              : 'block mb-2 text-sm font-medium text-gray-900'
          }
        >
          Tax Number
        </label>
        <input
          {...register('taxNumber', {
            required: 'Tax Number is required',
            validate: (value) => {
              return window.electron.ipcRenderer
                .invoke('getSupplierByTaxNumber', value)
                .then((result) => {
                  if (result && result.id !== Number(id)) {
                    return 'Tax Number matches another supplier'
                  } else {
                    return true
                  }
                })
            }
          })}
          type="text"
          name="taxNumber"
          id="taxNumber"
          className={
            errors.taxNumber
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
          onClick={props.onBack}
          className="hover:bg-gray-300 border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-4"
        >
          Back
        </button>
      </div>
    </form>
  )
}
