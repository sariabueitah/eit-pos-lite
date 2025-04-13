import { useTranslation } from 'react-i18next'
import { hideAlert } from '../state/slices/PageSlice'
import { RootState } from '../state/store'
import { useDispatch, useSelector } from 'react-redux'

export default function AlertComponent(): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const alert = useSelector((state: RootState) => state.page.alert)

  return (
    <>
      {alert.show && (
        <div className="absolute z-50 top-0 left-0 w-screen h-screen bg-gray-700/75">
          <div className="flex justify-center h-screen items-center">
            <div className="relative p-4 text-center bg-white rounded-xl shadow min-w-[300px]">
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500">{alert.message}</h3>
                <button
                  onClick={() => dispatch(hideAlert())}
                  type="button"
                  className="px-3 py-2 rounded-2xl bg-white hover:bg-gray-300 border border-gray-300 min-w-1/2"
                >
                  {t('Ok')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
