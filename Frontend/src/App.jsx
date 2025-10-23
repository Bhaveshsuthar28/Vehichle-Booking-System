import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { UserProtectedWrapper } from "./context/User.Protected.jsx";
import { CaptainProtectedWrapper } from "./context/Captain.Protected.jsx";
import { LoaderContent } from "./components/Loader.Content.Components.jsx";
import "remixicon/fonts/remixicon.css";

const Starter = lazy(() =>
  import("./pages/Starter.page.jsx").then((module) => ({ default: module.Starter }))
);

const UserLogin = lazy(() =>
  import("./pages/userLogin.page.jsx").then((module) => ({ default: module.UserLogin }))
);

const UserSignUp = lazy(() =>
  import("./pages/userSignup.page.jsx").then((module) => ({ default: module.UserSignUp }))
);

const CaptainLogin = lazy(() =>
  import("./pages/captainLogin.page.jsx").then((module) => ({ default: module.CaptainLogin }))
);

const CaptainSignUp = lazy(() =>
  import("./pages/captainSignup.page.jsx").then((module) => ({ default: module.CaptainSignUp }))
);

const Home = lazy(() =>
  import("./pages/Home.page.jsx").then((module) => ({ default: module.Home }))
);

const CapatainHome = lazy(() =>
  import("./pages/captain.home.page.jsx").then((module) => ({ default: module.CapatainHome }))
);

const RidingLive = lazy(() =>
  import("./pages/Riding.User.page.jsx").then((module) => ({ default: module.RidingLive }))
);

const CaptainRiding = lazy(() => 
  import("./pages/CaptainRiding.page.jsx").then((module) => ({ default : module.CaptainRiding}))
);

function App() {
  return (
    <Suspense fallback={<LoaderContent />}>
      <Routes>
        <Route path="/" element={<Starter />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-signup" element={<UserSignUp />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignUp />} />
        <Route
          path="/riding"
          element={
            <UserProtectedWrapper>
              <RidingLive />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/captain-riding"
          element={
            <CaptainProtectedWrapper>
              <CaptainRiding />
            </CaptainProtectedWrapper>
          }
        />
        <Route
          path="/home"
          element={
            <UserProtectedWrapper>
              <Home />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/captain-home"
          element={
            <CaptainProtectedWrapper>
              <CapatainHome />
            </CaptainProtectedWrapper>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
