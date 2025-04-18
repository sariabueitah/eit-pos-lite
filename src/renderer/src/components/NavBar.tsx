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
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                    clipRule="evenodd"
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
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path d="M10.5 1.875a1.125 1.125 0 0 1 2.25 0v8.219c.517.162 1.02.382 1.5.659V3.375a1.125 1.125 0 0 1 2.25 0v10.937a4.505 4.505 0 0 0-3.25 2.373 8.963 8.963 0 0 1 4-.935A.75.75 0 0 0 18 15v-2.266a3.368 3.368 0 0 1 .988-2.37 1.125 1.125 0 0 1 1.591 1.59 1.118 1.118 0 0 0-.329.79v3.006h-.005a6 6 0 0 1-1.752 4.007l-1.736 1.736a6 6 0 0 1-4.242 1.757H10.5a7.5 7.5 0 0 1-7.5-7.5V6.375a1.125 1.125 0 0 1 2.25 0v5.519c.46-.452.965-.832 1.5-1.141V3.375a1.125 1.125 0 0 1 2.25 0v6.526c.495-.1.997-.151 1.5-.151V1.875Z" />
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
