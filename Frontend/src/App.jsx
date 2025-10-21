import { Route, Routes } from "react-router-dom"
import { Starter } from "./pages/Starter.page.jsx"
import { UserLogin } from "./pages/userLogin.page.jsx"
import { UserSignUp } from "./pages/userSignup.page.jsx"
import { CaptainLogin } from "./pages/captainLogin.page.jsx"
import { CaptainSignUp } from "./pages/captainSignup.page.jsx"
import { Home } from "./pages/Home.page.jsx"
import { UserProtectedWrapper } from "./context/User.Protected.jsx"
import { CapatainHome } from "./pages/captain.home.page.jsx"
import { CaptainProtectedWrapper } from "./context/Captain.Protected.jsx"
import { RidingLive } from "./pages/Riding.User.page.jsx"
import 'remixicon/fonts/remixicon.css'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Starter/>}/>
        <Route path="/user-login" element={<UserLogin/>} />
        <Route path="/user-signup" element={<UserSignUp/>} />
        <Route path="/captain-login" element={<CaptainLogin/>} />
        <Route path="/captain-signup" element={<CaptainSignUp/>} />
        <Route path="/riding" element={
          <UserProtectedWrapper>
            <RidingLive/>
          </UserProtectedWrapper>
        }/>
        <Route path="/home" element={
          <UserProtectedWrapper>
            <Home/>
          </UserProtectedWrapper>
        }
        />
        <Route path="/captain-home" element={
          <CaptainProtectedWrapper>
            <CapatainHome/>
          </CaptainProtectedWrapper>
        }
        />
      </Routes>
    </>
  )
}

export default App
