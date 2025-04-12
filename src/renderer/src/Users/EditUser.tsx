import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setPage, setLoading } from '../state/slices/PageSlice'
import UserForm from './componants/UserForm'
import { useTranslation } from 'react-i18next'

export default function EditUser(): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(setPage(t('Edit User')))
  }, [dispatch, t])

  const onSubmit = (setError, id, data): void => {
    dispatch(setLoading(true))
    window.electron.ipcRenderer
      .invoke('updateUser', id, {
        name: data.name,
        phoneNumber: data.phoneNumber,
        role: data.role,
        password: data.password
      })
      .then(() => {
        dispatch(setLoading(false))
        navigate('/users', { replace: true })
      })
      .catch((error) => {
        //TODO check catch
        dispatch(setLoading(false))
        setError('root', { type: 'manual', message: error })
      })
  }

  return (
    <UserForm
      onSubmit={onSubmit}
      onBack={() => {
        navigate('/categories', { replace: true })
      }}
    />
  )
}
