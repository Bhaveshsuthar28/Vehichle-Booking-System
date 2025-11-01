import "remixicon/fonts/remixicon.css";
import { Route as RouterRoute, Routes as RouterRoutes } from "react-router-dom";
import { UserProtectedWrapper as RequireUser } from "./context/User.Protected.jsx";
import { CaptainProtectedWrapper as RequireCaptain } from "./context/Captain.Protected.jsx";
import { Starter } from "./pages/Starter.page.jsx";
import { UserLogin } from "./pages/userLogin.page.jsx";
import { UserSignUp } from "./pages/userSignup.page.jsx";
import { CaptainLogin } from "./pages/captainLogin.page.jsx";
import { CaptainSignUp } from "./pages/captainSignup.page.jsx";
import { Home } from "./pages/Home.page.jsx";
import { CapatainHome } from "./pages/captain.home.page.jsx";
import { RidingLive } from "./pages/Riding.User.page.jsx";
import { CaptainRiding } from "./pages/CaptainRiding.page.jsx";


const App = () => (
  <RouterRoutes>
    <RouterRoute path="/" element={<Starter />} />
    <RouterRoute path="/user-login" element={<UserLogin />} />
    <RouterRoute path="/user-signup" element={<UserSignUp />} />
    <RouterRoute path="/captain-login" element={<CaptainLogin />} />
    <RouterRoute path="/captain-signup" element={<CaptainSignUp />} />
    <RouterRoute
      path="/riding"
      element={
        <RequireUser>
          <RidingLive />
        </RequireUser>
      }
    />
    <RouterRoute
      path="/captain-riding"
      element={
        <RequireCaptain>
          <CaptainRiding />
        </RequireCaptain>
      }
    />
    <RouterRoute
      path="/home"
      element={
        <RequireUser>
          <Home />
        </RequireUser>
      }
    />
    <RouterRoute
      path="/captain-home"
      element={
        <RequireCaptain>
          <CapatainHome />
        </RequireCaptain>
      }
    />
  </RouterRoutes>
);

export default App;