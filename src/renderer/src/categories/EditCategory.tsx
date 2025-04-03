import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setPage } from '../state/slices/PageSlice'
import { setLoading } from '../state/slices/LoadingSlice'
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
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    dispatch(setLoading(true))
    window.electron.ipcRenderer
      .invoke('updateCategory', id, {
        name: data.name
      })
      .then(() => {
        dispatch(setLoading(false))
        navigate('/categories', { replace: true })
      })
      .catch((error) => {
        dispatch(setLoading(false))
        setError('root', { type: 'manual', message: error })
      })
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
