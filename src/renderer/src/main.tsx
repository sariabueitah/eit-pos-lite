import './assets/main.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './state/store'
import './i18n/i18n'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter basename={'/'}>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>
)
