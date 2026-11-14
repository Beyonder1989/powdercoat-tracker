import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './context/LanguageContext'
import { RoleProvider } from './context/RoleContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <RoleProvider>
        <App />
      </RoleProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
