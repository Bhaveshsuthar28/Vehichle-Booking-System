import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom" 
import UserContext from './context/User.Context.jsx'
import CaptainContext from './context/Capatain.Context.jsx'
import 'react-toastify/dist/ReactToastify.css';
import SocketProvider from './context/Socket.context.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <CaptainContext>
        <UserContext>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserContext>
      </CaptainContext>
    </SocketProvider>
  </StrictMode>,
)