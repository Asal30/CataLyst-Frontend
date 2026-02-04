import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MessageProvider } from './components/MessageContext'
import MessagePopup from './components/MessagePopup'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MessageProvider>
      <MessagePopup />
      <App />
    </MessageProvider>
  </StrictMode>
);