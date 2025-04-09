import { useDispatch } from 'react-redux'
import { setLoading, setPage } from '../state/slices/PageSlice'
import { useEffect } from 'react'
import CategoryForm from './componants/CategoryForm'
import { useNavigate } from 'react-router-dom'

export default function EditCategory(): JSX.Element {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(setPage('Edit Category'))
  }, [dispatch])

  const onSubmit = (setError, id, data): void => {
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
  return (
    <CategoryForm
      onSubmit={onSubmit}
      onBack={() => {
        navigate('/categories', { replace: true })
      }}
    />
  )
}
