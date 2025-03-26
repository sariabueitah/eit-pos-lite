import { useNavigate } from 'react-router-dom'
import PageContext from '../contexts/PageContext'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useContext, useEffect } from 'react'
import SupplierForm from './componants/SupplierForm'

interface IFormInput {
  name: string
  phoneNumber: string
  taxNumber: string
}

export default function AddUser(): JSX.Element {
  const navigate = useNavigate()
  const { setPageContext } = useContext(PageContext)
  useEffect(() => {
    setPageContext({ pageTitle: 'Add Supplier' })
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
        .invoke('addSupplier', {
          name: data.name,
          phoneNumber: data.phoneNumber,
          taxNumber: data.taxNumber
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
      navigate('/suppliers', { replace: true })
    } else {
      setError('root', { type: 'manual', message: 'createSupplier request was not successfull' })
    }
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
