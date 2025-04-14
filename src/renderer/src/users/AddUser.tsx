import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setPage, setLoading } from '../state/slices/PageSlice'
import UserForm from './componants/UserForm'
import { useTranslation } from 'react-i18next'

export default function AddUser(): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(setPage(t('Add User')))
  }, [dispatch, t])
  const onSubmit = (setError, _, data): void => {
    dispatch(setLoading(true))
    window.electron.ipcRenderer
      .invoke('addUser', {
        name: data.name,
        userName: data.userName,
        phoneNumber: data.phoneNumber,
        role: data.role,
        password: data.password
      })
      .then(() => {
        navigate('/users', { replace: true })
        dispatch(setLoading(false))
      })
      .catch((error) => {
        setError('root', { type: 'manual', message: t('Failed to create Record') + ' ' + error })
        dispatch(setLoading(false))
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
