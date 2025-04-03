import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLoading } from '../state/slices/LoadingSlice'
import { setPage } from '../state/slices/PageSlice'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useEffect } from 'react'
import SupplierForm from './componants/SupplierForm'

interface IFormInput {
  name: string
  phoneNumber: string
  taxNumber: string
}

export default function EditSupplier(): JSX.Element {
  const { id } = useParams()
  const navigate = useNavigate()

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage('Edit Supplier'))
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
      .invoke('updateSupplier', id, {
        name: data.name,
        phoneNumber: data.phoneNumber,
        taxNumber: data.taxNumber
      })
      .then(() => {
        dispatch(setLoading(false))
        navigate('/suppliers', { replace: true })
      })
      .catch((error) => {
        dispatch(setLoading(false))
        setError('root', { type: 'manual', message: error })
      })
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
        console.log('error')
        console.log(error)
      })
  }, [id, setValue])

  return (
    <SupplierForm
      errors={errors}
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      onBack={() => {
        navigate('/suppliers', { replace: true })
      }}
    />
  )
}
