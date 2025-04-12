import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setPage, setLoading } from '../state/slices/PageSlice'
import ItemForm from './componants/ItemForm'
import { useTranslation } from 'react-i18next'

export default function EditItems(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage(t('Edit Item')))
  }, [dispatch, t])

  const onSubmit = (setError, id, data): void => {
    dispatch(setLoading(true))
    window.electron.ipcRenderer
      .invoke('updateItem', id, data)
      .then(() => {
        dispatch(setLoading(false))
        navigate('/items', { replace: true })
      })
      .catch((error) => {
        //TODO check catch
        dispatch(setLoading(false))
        setError('root', { type: 'manual', message: error })
      })
  }

  return (
    <ItemForm
      onSubmit={onSubmit}
      onBack={() => {
        navigate('/items', { replace: true })
      }}
    />
  )
}
