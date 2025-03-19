import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from "./layout/AppLayout"
import { Home } from './Pages/Home'
import { Login } from './Pages/Login'
import { Profile } from './Pages/Profile'
import { getGoogleClientId } from "../src/utils/EnvLoader.js";
import { GoogleOAuthProvider } from '@react-oauth/google';

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
        }
      ]
    }
  ])  


  return (
      <RouterProvider router={router} />
  )
}

export default App
