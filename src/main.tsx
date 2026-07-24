import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthProvider'
import { CondoProvider } from './contexts/CondoProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CondoProvider>
          <App />
        </CondoProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
