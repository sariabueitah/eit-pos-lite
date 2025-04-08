import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setPage, setLoading } from '../state/slices/PageSlice'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useEffect } from 'react'
import ItemForm from './componants/ItemForm'

interface IFormInput {
  name: string
  description: string
  barcode: string
  unit: 'Grams' | 'Kilograms' | 'Liters' | 'Milliliters' | 'Units'
  cost: number
  price: number
  tax: number
  image: string
  categoryId: string
  supplierId: string
}

export default function EditItems(): JSX.Element {
  const { id } = useParams()
  const navigate = useNavigate()

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage('Edit Item'))
  }, [dispatch])

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    setValue
  } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    dispatch(setLoading(true))
    window.electron.ipcRenderer
      .invoke('updateItem', id, {
        name: data.name,
        description: data.description,
        barcode: data.barcode,
        unit: data.unit,
        cost: data.cost,
        price: data.price,
        tax: data.tax,
        image: data.image,
        categoryId: data.categoryId,
        supplierId: data.supplierId
      })
      .then(() => {
        dispatch(setLoading(false))
        navigate('/items', { replace: true })
      })
      .catch((error) => {
        dispatch(setLoading(false))
        setError('root', { type: 'manual', message: error })
      })
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
        setTimeout(() => {
          setValue('categoryId', result.categoryId)
          setValue('supplierId', result.supplierId)
        }, 200)
      })
      .catch((error) => {
        console.log('error')
        console.log(error)
      })
  }, [id, setValue])

  return (
    <ItemForm
      errors={errors}
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      onBack={() => {
        navigate('/items', { replace: true })
      }}
    />
  )
}
