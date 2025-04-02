import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setPage } from '../state/slices/PageSlice'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useEffect } from 'react'
import CategoryForm from './componants/CategoryForm'

interface IFormInput {
  name: string
}

export default function EditCategory(): JSX.Element {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage('Edit Category'))
  }, [dispatch])

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
        .invoke('updateCategory', id, {
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
      setError('root', { type: 'manual', message: 'updateCategory request was not successfull' })
    }
  }

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('getCategoryById', id)
      .then((result) => {
        setValue('name', result.name)
      })
      .catch((error) => {
        console.log('error')
        console.log(error)
      })
  }, [id, setValue])

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
