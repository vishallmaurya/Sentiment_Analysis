import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from "./layout/AppLayout"
import { getGoogleClientId } from "../src/utils/EnvLoader.js";
import { GoogleOAuthProvider } from '@react-oauth/google';

const Home = lazy(() => import("./Pages/Home/index.jsx"));
const Login = lazy(() => import("./Pages/Login/index.jsx"));
const Profile = lazy(() => import("./Pages/Profile/index.jsx"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword/index.jsx"));

// import { Home } from './Pages/Home'
// import { Login } from './Pages/Login'
// import { Profile } from './Pages/Profile'
// import { ResetPassword } from './Pages/ResetPassword/index.jsx'

const ErrorFallback = ({ error }) => (
  <div style={{textAlign: "center" }}>
    <h2>Something went wrong!</h2>
    <p>{error?.message || "An unknown error occurred"}</p>
  </div>
);


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (<AppLayout />),
      errorElement: (<ErrorFallback/>),
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<div>Loading Home...</div>}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "/login",
          element: (
            <GoogleOAuthProvider clientId={getGoogleClientId()}>
              <Suspense fallback={<div>Loading Login...</div>}>
                <Login />
              </Suspense>
            </GoogleOAuthProvider>
          )
        },
        {
          path: "/profile", 
          element: (
            <Suspense fallback={<div>Loading Profile...</div>}>
              <Profile />
            </Suspense>
          ),
         },
        {
          path: "/reset-password/:token", 
          element: (
            <Suspense fallback={<div>Loading Reset Password...</div>}>
              <ResetPassword />
            </Suspense>
          ),
        }
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
