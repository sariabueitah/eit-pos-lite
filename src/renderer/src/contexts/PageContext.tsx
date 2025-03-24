import { createContext } from 'react'

type PageContextType = {
  pageContext: { pageTitle: string }
  setPageContext: React.Dispatch<React.SetStateAction<{ pageTitle: string }>>
}

const iPageContext = {
  pageContext: { pageTitle: '' },
  setPageContext: (): void => {}
}

const PageContext = createContext<PageContextType>(iPageContext)

export default PageContext
