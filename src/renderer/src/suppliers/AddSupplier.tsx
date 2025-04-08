import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setPage, setLoading } from '../state/slices/PageSlice'
import { useForm, SubmitHandler } from 'react-hook-form'
import SupplierForm from './componants/SupplierForm'
import { useEffect } from 'react'

interface IFormInput {
  name: string
  phoneNumber: string
  taxNumber: string
}

export default function AddUser(): JSX.Element {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage('Add Supplier'))
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
      .invoke('addSupplier', {
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
