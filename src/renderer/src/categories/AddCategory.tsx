import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setPage, setLoading } from '../state/slices/PageSlice'
import CategoryForm from './componants/CategoryForm'
import { useTranslation } from 'react-i18next'

export default function AddCategory(): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(setPage(t('Add Category')))
  }, [dispatch, t])

  const onSubmit = (setError, _, data): void => {
    dispatch(setLoading(true))
    window.electron.ipcRenderer
      .invoke('addCategory', {
        name: data.name
      })
      .then(() => {
        dispatch(setLoading(false))
        navigate('/categories', { replace: true })
      })
      .catch((error) => {
        //TODO check catch
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
