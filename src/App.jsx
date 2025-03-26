import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from "./layout/AppLayout"
import { getGoogleClientId } from "../src/utils/EnvLoader.js";
import { GoogleOAuthProvider } from '@react-oauth/google';

const Home = lazy(() => 
  import("./Pages/Home/index.jsx").then(module => ({ default: module.Home }))
);

const Login = lazy(() => 
  import("./Pages/Login/index.jsx").then(module => ({ default: module.Login }))
);

const Profile = lazy(() => 
  import("./Pages/Profile/index.jsx").then(module => ({ default: module.Profile }))
);

const ResetPassword = lazy(() => 
  import("./Pages/ResetPassword/index.jsx").then(module => ({ default: module.ResetPassword }))
);

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (<AppLayout />),
      errorElement: (<div>Error</div>),
      children: [
        {path: "/",element: (<Home />)},
        {
          path: "/login",
          element: (
            <GoogleOAuthProvider clientId={getGoogleClientId()}>
              <Login />
            </GoogleOAuthProvider>
          )
        },
        { path: "/profile", element: (<Profile/>) },
        { path: "/reset-password/:token", element: (<ResetPassword/>) }
      ]
    }
  ])  


  return (
    <Suspense fallback={<div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App
