import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setPage, setLoading } from '../state/slices/PageSlice'
import ItemForm from './componants/ItemForm'
import { useTranslation } from 'react-i18next'

export default function AddItems(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage(t('Add Item')))
  }, [dispatch])

  const onSubmit = (setError, _, data): void => {
    dispatch(setLoading(true))
    window.electron.ipcRenderer
      .invoke('addItem', data)
      .then(() => {
        dispatch(setLoading(false))
        navigate('/items', { replace: true })
      })
      .catch((error) => {
        dispatch(setLoading(false))
        //TODO check catch
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
