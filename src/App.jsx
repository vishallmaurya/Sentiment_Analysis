import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from "./layout/AppLayout"
import { getGoogleClientId } from "../src/utils/EnvLoader.js";
import { GoogleOAuthProvider } from '@react-oauth/google';

// const Home = lazy(() => import("./Pages/Home"));
// const Login = lazy(() => import("./Pages/Login"));
// const Profile = lazy(() => import("./Pages/Profile"));
// const ResetPassword = lazy(() => import("./Pages/ResetPassword/index.jsx"));

import { Home } from './Pages/Home'
import { Login } from './Pages/Login'
import { Profile } from './Pages/Profile'
import { ResetPassword } from './Pages/ResetPassword/index.jsx'

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
