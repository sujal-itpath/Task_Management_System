import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './component/common/ToastContext.jsx'

createRoot(document.getElementById('root')).render(
    <ToastProvider>
        <App />
    </ToastProvider>
    
)
