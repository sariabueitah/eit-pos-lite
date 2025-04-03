import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setPage } from '../state/slices/PageSlice'
import { setLoading } from '../state/slices/LoadingSlice'
import { useForm, SubmitHandler } from 'react-hook-form'
import ItemForm from './componants/ItemForm'
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
  categoryId: string
  supplierId: string
}

export default function AddItems(): JSX.Element {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage('Add Item'))
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
      .invoke('addItem', {
        name: data.name,
        description: data.description,
        barcode: data.barcode,
        unit: data.unit,
        cost: data.cost,
        price: data.price,
        tax: data.tax,
        image: '',
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
