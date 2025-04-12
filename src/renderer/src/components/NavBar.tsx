import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { showHold } from '../state/slices/PageSlice'
import { RootState } from '../state/store'
import { useTranslation } from 'react-i18next'

function NavBar(): JSX.Element {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const session = useSelector((state: RootState) => state.session.value)
  const pageTitle = useSelector((state: RootState) => state.page.pageTitle)
  const show = useSelector((state: RootState) => state.page.hold.show)
  const count = useSelector((state: RootState) => state.page.hold.count)

  const switchLanguage = (): void => {
    if (i18n.language === 'en') {
      i18n.changeLanguage('ar')
    } else {
      i18n.changeLanguage('en')
    }
  }

  return (
    <>
      {session && (
        <div className="flex justify-between items-center p-3 border-b border-gray-300">
          <div className="flex gap-2">
            <NavLink to="/">
              <div className="p-3 rounded-2xl bg-white hover:bg-gray-300 border border-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                  <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                </svg>
              </div>
            </NavLink>
            <button className="relative" onClick={() => dispatch(showHold(!show))}>
              <div
                className={
                  'p-3 rounded-2xl hover:bg-gray-300 border border-gray-300 ' +
                  (show ? 'bg-gray-300' : 'bg-white')
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
                  />
                </svg>
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2">
                  {count}
                </div>
              </div>
            </button>
          </div>

          <div className="align-middle">
            <h1>{pageTitle}</h1>
          </div>
          <div className="flex items-center">
            <button onClick={switchLanguage}>
              <span className="text-center block">{t('Language')}</span>
            </button>
            <NavLink to="/" onClick={() => window.electron.ipcRenderer.invoke('logout')}>
              <span className="text-center block">{session?.name}</span>
              <span className="text-center block">{t('Logout')}</span>
            </NavLink>
          </div>
        </div>
      )}
    </>
  )
}

export default NavBar
