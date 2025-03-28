import { useNavigate } from 'react-router-dom'
import PageContext from '../contexts/PageContext'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useContext, useEffect } from 'react'
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

export default function AddItems(): JSX.Element {
  const navigate = useNavigate()
  const { setPageContext } = useContext(PageContext)
  useEffect(() => {
    setPageContext({ pageTitle: 'Add Item' })
  }, [setPageContext])

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    let success = false
    try {
      await window.electron.ipcRenderer
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
      setError('root', { type: 'manual', message: 'insertItem request was not successfull' })
    }
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
