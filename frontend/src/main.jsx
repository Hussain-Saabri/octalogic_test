import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById('root')).render(
  
  
  <StrictMode>
    <BrowserRouter>
     <Toaster
        position="top-right"
        duration="500"
        toastOptions={{
          style: {
            backgroundColor: "#ADD8E6",
            color: "#fff",
          },
        }}
      />
    <App />
    </BrowserRouter>
    
  </StrictMode>,
)
