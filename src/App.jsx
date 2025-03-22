import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from "./layout/AppLayout"
import { Home } from './Pages/Home'
import { Login } from './Pages/Login'
import { Profile } from './Pages/Profile'
import { getGoogleClientId } from "../src/utils/EnvLoader.js";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ResetPassword } from './Pages/ResetPassword/index.jsx'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AppLayout />
      ),
      errorElement: (
        <div>Error</div>
      ),
      children: [
        {
          path: "/",
          element: (<Home />)
        },
        {
          path: "/login",
          element: (
            <GoogleOAuthProvider clientId={getGoogleClientId()}>
              <Login />
            </GoogleOAuthProvider>
          )
        },
        {
          path: "/profile",
          element: (<Profile/>)
        },
        {
          path: "/reset-password/:token",
          element: (<ResetPassword/>)
        }
      ]
    }
  ])  


  return (
      <RouterProvider router={router} />
  )
}

export default App
