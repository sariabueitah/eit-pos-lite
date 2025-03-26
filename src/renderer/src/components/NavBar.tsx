import { NavLink } from 'react-router-dom'
import SessionContext from '../contexts/SessionContext'
import PageContext from '../contexts/PageContext'
import { useContext } from 'react'

function NavBar(): JSX.Element {
  const { sessionContext } = useContext(SessionContext)
  const { pageContext } = useContext(PageContext)

  return (
    <>
      {sessionContext && (
        <div className="flex justify-between items-center p-3 border-b border-gray-300">
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
          <div className="align-middle">
            <h1>{pageContext?.pageTitle}</h1>
          </div>
          <div>
            <NavLink to="/" onClick={() => window.electron.ipcRenderer.invoke('logout')}>
              <span className="text-center block">{sessionContext?.name}</span>
              <span className="text-center block">Logout</span>
            </NavLink>
          </div>
        </div>
      )}
    </>
  )
}

export default NavBar
