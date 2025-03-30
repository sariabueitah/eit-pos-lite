import { useNavigate, useParams } from 'react-router-dom'
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

export default function EditItems(): JSX.Element {
  const { id } = useParams()
  const navigate = useNavigate()

  const { setPageContext } = useContext(PageContext)
  useEffect(() => {
    setPageContext({ pageTitle: 'Edit Item' })
  }, [setPageContext])

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
