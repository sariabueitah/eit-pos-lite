import { useNavigate, useParams } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import FormAlerts from '../components/FormAlerts'
import { useEffect } from 'react'

interface IFormInput {
  name: string
  description: string
  barcode: string
  unit: 'Grams' | 'Kilograms' | 'Liters' | 'Milliliters' | 'Units'
  cost: number
  price: number
  tax: number
  image: string
  category: string
  supplier: string
}

export default function EditItems(): JSX.Element {
  const { id } = useParams()
  const navigate = useNavigate()

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
        .invoke('updateItem', id, {
          name: data.name,
          description: data.description,
          barcode: data.barcode,
          unit: data.unit,
          cost: data.cost,
          price: data.price,
          tax: data.tax,
          image: data.image,
          category: data.category,
          supplier: data.supplier
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
      navigate('/items', { replace: true })
    } else {
      setError('root', { type: 'manual', message: 'updateItem request was not successfull' })
    }
  }

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getItemById', id)
      .then((result) => {
        setValue('name', result.name)
        setValue('description', result.description)
        setValue('barcode', result.barcode)
        setValue('unit', result.unit)
        setValue('cost', result.cost)
        setValue('price', result.price)
        setValue('tax', result.tax)
        setValue('image', result.image)
        setValue('category', result.category)
        setValue('supplier', result.supplier)
      })
      .catch((error) => {
        console.log('error')
        console.log(error)
      })
  }, [id, setValue])

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
        <h1>Add Items</h1>
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
              errors.description
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            Description
          </label>
          <input
            {...register('description', { required: 'Description is required' })}
            type="text"
            name="description"
            id="description"
            className={
              errors.description
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.barcode
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            Barcode
          </label>
          <input
            {...register('barcode', { required: 'Barcode is required' })}
            type="text"
            name="barcode"
            id="barcode"
            className={
              errors.barcode
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.unit
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            Unit
          </label>
          <input
            {...register('unit', { required: 'Unit is required' })}
            type="text"
            name="unit"
            id="unit"
            className={
              errors.unit
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.cost
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            Cost
          </label>
          <input
            {...register('cost', { required: 'Cost is required' })}
            type="text"
            name="cost"
            id="cost"
            className={
              errors.cost
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.price
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            Price
          </label>
          <input
            {...register('price', { required: 'Price is required' })}
            type="text"
            name="price"
            id="price"
            className={
              errors.price
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.tax
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            Tax
          </label>
          <input
            {...register('tax', { required: 'Tax is required' })}
            type="text"
            name="tax"
            id="tax"
            className={
              errors.tax
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.image
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            Image
          </label>
          <input
            {...register('image', { required: 'Image is required' })}
            type="text"
            name="image"
            id="image"
            className={
              errors.image
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.category
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            Category
          </label>
          <input
            {...register('category', { required: 'Category is required' })}
            type="text"
            name="category"
            id="category"
            className={
              errors.category
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.supplier
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            Supplier
          </label>
          <input
            {...register('supplier', { required: 'Supplier is required' })}
            type="text"
            name="supplier"
            id="supplier"
            className={
              errors.supplier
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
