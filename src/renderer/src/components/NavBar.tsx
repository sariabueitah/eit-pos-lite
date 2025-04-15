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
            <NavLink to="/config">
              <div className="p-3 rounded-2xl bg-white hover:bg-gray-300 border border-gray-300">
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
                    d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
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
          <div className="align-middle flex flex-col">
            <h2 className="text-center">{session?.name}</h2>
            <h1 className="text-center">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative" onClick={switchLanguage}>
              <div
                className={
                  'p-3 rounded-2xl hover:bg-gray-300 border border-gray-300 w-[50px] ' +
                  (show ? 'bg-gray-300' : 'bg-white')
                }
              >
                {i18n.language === 'en' ? 'ع' : 'En'}
              </div>
            </button>
            <button
              className="relative"
              onClick={() => window.electron.ipcRenderer.invoke('logout')}
            >
              <div
                className={
                  'p-3 rounded-2xl hover:bg-gray-300 border border-gray-300 ' +
                  (show ? 'bg-gray-300' : 'bg-white')
                }
              >
                {t('Logout')}
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default NavBar
