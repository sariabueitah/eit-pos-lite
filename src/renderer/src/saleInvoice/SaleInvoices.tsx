import { useDispatch } from 'react-redux'
import { setPage } from '../state/slices/PageSlice'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

//TODO add view page and cancel action for issued invoice and search funtionality
export default function SaleInvoices(): JSX.Element {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage('Sale Invoices'))
  }, [dispatch])

  return <></>
}
