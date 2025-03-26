import { useNavigate } from 'react-router-dom'
import PageContext from '../contexts/PageContext'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useContext, useEffect } from 'react'
import CategoryForm from './componants/CategoryForm'

interface IFormInput {
  name: string
}

export default function AddUser(): JSX.Element {
  const navigate = useNavigate()
  const { setPageContext } = useContext(PageContext)
  useEffect(() => {
    setPageContext({ pageTitle: 'Add Category' })
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
        .invoke('addCategory', {
          name: data.name
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
      navigate('/categories', { replace: true })
    } else {
      setError('root', { type: 'manual', message: 'createCategory request was not successfull' })
    }
  }

  return (
    <CategoryForm
      errors={errors}
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      onBack={() => {
        navigate('/categories', { replace: true })
      }}
    />
  )
}
