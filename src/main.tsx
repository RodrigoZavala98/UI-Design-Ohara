import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { C } from './theme'
import './index.css'

/* El fondo del documento sigue a la apariencia activa */
document.body.style.background = C.shell

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
