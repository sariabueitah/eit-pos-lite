import { useDispatch } from 'react-redux'
import { setLoading, setPage, showAlert } from '../state/slices/PageSlice'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormAlerts from '../components/FormAlerts'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

interface IFormInput {
  name: string
  address: string
  phoneNumber: string
  email: string
  taxId: string
  printer: string
  printSize: string
}

export default function Config(): JSX.Element {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  useEffect(() => {
    dispatch(setPage(t('Configuration')))
  }, [dispatch, t])

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const dataArray: { name: string; value: string }[] = []
    Object.keys(data).forEach((key) => {
      dataArray.push({ name: key, value: data[key] })
    })
    dispatch(setLoading(true))
    window.electron.ipcRenderer
      .invoke('updateConfigByName', dataArray)
      .then(() => {
        dispatch(setLoading(false))
        navigate('/', { replace: true })
      })
      .catch((e) => {
        dispatch(showAlert(`${t('Error updating Record')}: ` + e.message))
        dispatch(setLoading(false))
      })
  }

  const [src, setSrc] = useState('')
  const [printers, setPrinters] = useState<Electron.PrinterInfo[]>([])

  useEffect(() => {
    dispatch(setLoading(true))
    window.electron.ipcRenderer
      .invoke('getAllConfig')
      .then((config) => {
        config.map((c) => {
          setValue(c.name, c.value)
        })
        dispatch(setLoading(false))
      })
      .catch((e) => {
        dispatch(showAlert(`${t('Data not retrieved')} : ${e}`))
        dispatch(setLoading(false))
      })
    window.electron.ipcRenderer
      .invoke('loadLogo')
      .then((data) => {
        setSrc(`${data}`)
        dispatch(setLoading(false))
      })
      .catch((error) => {
        dispatch(showAlert(`${t('Data not retrieved')} : ${error}`))
        dispatch(setLoading(false))
      })
    window.electron.ipcRenderer.invoke('getPrinters').then((data: Electron.PrinterInfo[]) => {
      setPrinters(data)
    })
  }, [dispatch, setValue, t])

  useEffect(() => {
    const off = window.electron.ipcRenderer.on('changeLogo', (_, data) => {
      setSrc(`${data}`)
      dispatch(setLoading(false))
    })
    return off
  }, [dispatch])

  const handleUploadLogo = (): void => {
    dispatch(setLoading(true))
    window.electron.ipcRenderer.send('changeLogo')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-1/3 mx-auto">
      <FormAlerts alerts={errors} />
      <div className="grid grid-cols-1 gap-4">
        <div className="border border-gray-300 border-dashed rounded-lg p-4 flex flex-col items-center gap-2">
          <h2 className="text-lg">{t('logo')}</h2>
          <img className="w-32 h-32" src={src} alt={'logo'} />
          <button
            className="hover:bg-gray-300 border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-4"
            onClick={handleUploadLogo}
          >
            Change Logo
          </button>
        </div>
        <div className="mb-5">
          <label
            className={
              errors.name
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            {t('Name')}
          </label>
          <input
            {...register('name')}
            type="text"
            name="name"
            id="name"
            className={
              errors.name
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.address
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            {t('address')}
          </label>
          <input
            {...register('address')}
            type="text"
            name="address"
            id="address"
            className={
              errors.address
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.email
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            {t('email')}
          </label>
          <input
            {...register('email')}
            type="text"
            name="email"
            id="email"
            className={
              errors.email
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.phoneNumber
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            {t('Phone Number')}
          </label>
          <input
            {...register('phoneNumber')}
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            className={
              errors.phoneNumber
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.taxId
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            {t('Tax ID')}
          </label>
          <input
            {...register('taxId')}
            type="text"
            name="taxId"
            id="taxId"
            className={
              errors.taxId
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          />
        </div>
        <div className="mb-5">
          <label
            className={
              errors.printer
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            {t('Printer')}
          </label>
          <select
            {...register('printer')}
            name="printer"
            id="printer"
            className={
              errors.printer
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          >
            <option key="PDF" value="">
              {t('Default Printer')}
            </option>
            {printers.map((printer) => (
              <option key={printer.name} value={printer.name}>
                {printer.displayName}
              </option>
            ))}
            <option key="PDF" value="PDF">
              PDF
            </option>
          </select>
        </div>
        <div className="mb-5">
          <label
            className={
              errors.printSize
                ? 'block mb-2 text-sm font-medium text-red-900'
                : 'block mb-2 text-sm font-medium text-gray-900'
            }
          >
            {t('Print Size')}
          </label>
          <select
            {...register('printSize')}
            name="printSize"
            id="printSize"
            className={
              errors.printSize
                ? 'bg-gray-50 border border-red-500 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5'
                : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            }
          >
            <option value="A4">A4</option>
            <option value="80">80mm</option>
            <option value="58">58mm</option>
          </select>
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          {t('Submit')}
        </button>
        <button
          onClick={() => navigate('/', { replace: true })}
          className="hover:bg-gray-300 border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-4"
        >
          {t('Back')}
        </button>
      </div>
    </form>
  )
}
