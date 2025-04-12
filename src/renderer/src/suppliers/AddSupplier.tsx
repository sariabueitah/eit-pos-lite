import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setPage, setLoading } from '../state/slices/PageSlice'
import SupplierForm from './componants/SupplierForm'
import { useTranslation } from 'react-i18next'

export default function AddSupplier(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage(t('Add Supplier')))
  }, [dispatch, t])

  const onSubmit = (setError, _, data): void => {
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
        //TODO check catch
        dispatch(setLoading(false))
        setError('root', { type: 'manual', message: error })
      })
  }

  return (
    <SupplierForm
      onSubmit={onSubmit}
      onBack={() => {
        navigate('/suppliers', { replace: true })
      }}
    />
  )
}
