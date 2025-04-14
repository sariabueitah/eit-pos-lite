import { useDispatch } from 'react-redux'
import { setLoading, setPage } from '../state/slices/PageSlice'
import { useEffect } from 'react'
import CategoryForm from './componants/CategoryForm'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function EditCategory(): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(setPage(t('Edit Category')))
  }, [dispatch, t])

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
      .catch((e) => {
        dispatch(setLoading(false))
        setError('root', {
          type: 'manual',
          message: `${t('Failed to update Record')} : ${e.message}`
        })
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
