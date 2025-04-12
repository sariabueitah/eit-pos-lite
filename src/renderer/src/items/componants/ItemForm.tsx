import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import FormAlerts from '../../components/FormAlerts'
import { useTranslation } from 'react-i18next'

interface IFormInput {
  name: string
  description: string
  barcode: string
  unit: 'Grams' | 'Kilograms' | 'Liters' | 'Milliliters' | 'Units'
  cost: number
  price: number
  discount: number
  tax: number
  image: string
  categoryId: string
  supplierId: string
}

export default function ItemForm(props: {
  onSubmit: (setError, id, data) => void
  onBack: () => void
}): JSX.Element {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  useEffect(() => {
    //TODO add catch
    window.electron.ipcRenderer.invoke('getAllCategories').then((categories) => {
      setCategories(categories)
    })
    window.electron.ipcRenderer.invoke('getAllSuppliers').then((suppliers) => {
      setSuppliers(suppliers)
    })
  }, [])
  const { id } = useParams()

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    setValue
  } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    props.onSubmit(setError, id, {
      name: data.name,
      description: data.description,
      barcode: data.barcode,
      unit: data.unit,
      cost: data.cost,
      price: data.price,
      discount: data.discount,
      tax: data.tax,
      image: '',
      categoryId: data.categoryId,
      supplierId: data.supplierId
    })
  }

  useEffect(() => {
    if (id === undefined) return
    window.electron.ipcRenderer
      .invoke('getItemById', id)
      .then((result) => {
        setValue('name', result.name)
        setValue('description', result.description)
        setValue('barcode', result.barcode)
        setValue('unit', result.unit)
        setValue('cost', result.cost)
        setValue('price', result.price)
        setValue('discount', result.discount)
        setValue('tax', result.tax)
        setValue('image', result.image)
        setValue('categoryId', result.categoryId, { shouldTouch: true })
        setValue('supplierId', result.supplierId, { shouldTouch: true })
      })
      .catch((error) => {
        setError('root', { type: 'manual', message: error + ' ' + t('Data not retrieved') })
      })
  }, [categories, id, setError, setValue, suppliers, t])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-1/2 mx-auto">
      <FormAlerts alerts={errors} />
      <div className="grid grid-cols-4 gap-4">
        <div className="mb-5 col-span-2">
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
        <div className="mb-5 col-span-2">
          <label
            className={
              errors.barcode
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            {t('barcode')}
          </label>
          <input
            {...register('barcode', {
              required: t('Barcode is required'),
              validate: (value) => {
                return window.electron.ipcRenderer
                  .invoke('getItemByBarcode', value)
                  .then((result) => {
                    if (result && result.id !== Number(id)) {
                      return t('Barcode matches another item')
                    } else {
                      return true
                    }
                  })
              }
            })}
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
        <div className="mb-5 col-span-4">
          <label
            className={
              errors.description
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            {t('Description')}
          </label>
          <textarea
            {...register('description')}
            name="description"
            id="description"
            rows={4}
            className={
              errors.description
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5 col-span-4">
          <label
            className={
              errors.unit
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            {t('unit')}
          </label>
          <select
            {...register('unit', { required: 'Unit is required' })}
            name="unit"
            id="unit"
            className={
              errors.unit
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          >
            <option value="Units">{t('Units')}</option>
            <option value="Grams">{t('Grams')}</option>
            <option value="Kilograms">{t('Kilograms')}</option>
            <option value="Liters">{t('Liters')}</option>
            <option value="Milliliters">{t('Milliliters')}</option>
          </select>
        </div>
        <div className="mb-5">
          <label
            className={
              errors.discount
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            {t('discount')}
          </label>
          <input
            {...register('discount', {
              required: t('Discount is required'),
              min: { value: 0, message: t('Discount must be larger than 0') },
              validate: (value, data) => {
                return value <= data.price || t('Discount must be less than price')
              }
            })}
            type="number"
            step="any"
            name="discount"
            id="discount"
            className={
              errors.discount
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
            {t('cost')}
          </label>
          <input
            {...register('cost', {
              required: t('Cost is required'),
              min: { value: 0, message: t('Cost must be larger than 0') }
            })}
            type="number"
            step="any"
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
            {t('price')}
          </label>
          <input
            {...register('price', {
              required: t('Price is required'),
              min: { value: 0, message: t('Price must be larger than 0') }
            })}
            type="number"
            step="any"
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
            {t('tax')}
          </label>
          <div className="flex">
            <input
              {...register('tax', {
                required: t('Tax is required'),
                min: { value: 0, message: t('Tax must be equal or larger than 0') }
              })}
              type="number"
              step="any"
              name="tax"
              id="tax"
              className={
                errors.tax
                  ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 rounded-e-none'
                  : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 border-e-0 rounded-e-none'
              }
            />
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-e-md">
              %
            </span>
          </div>
        </div>
        <div className="mb-5 col-span-2">
          <label
            className={
              errors.categoryId
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            {t('category')}
          </label>

          <select
            {...register('categoryId', { required: t('Category is required') })}
            name="categoryId"
            id="categoryId"
            className={
              errors.categoryId
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          >
            {categories.map((value) => (
              <option key={value.id} value={value.id}>
                {value.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-5 col-span-2">
          <label
            className={
              errors.supplierId
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            {t('supplier')}
          </label>
          <select
            {...register('supplierId', { required: t('Supplier is required') })}
            name="supplierId"
            id="supplierId"
            className={
              errors.supplierId
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          >
            {suppliers.map((value) => (
              <option key={value.id} value={value.id}>
                {value.name}
              </option>
            ))}
          </select>
        </div>
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
