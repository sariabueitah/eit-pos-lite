import PageContext from '../contexts/PageContext'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SaleInvoices(): JSX.Element {
  const navigate = useNavigate()
  const { setPageContext } = useContext(PageContext)
  useEffect(() => {
    setPageContext({ pageTitle: 'Sale Invoices' })
  }, [setPageContext])
  return <></>
}
