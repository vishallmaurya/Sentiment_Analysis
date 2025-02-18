import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from "./layout/AppLayout"
import { Home } from './Pages/Home'
import { Login } from './Pages/Login'
import { Profile } from './Pages/Profile'

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
          element: (<Login/>)
        },
        {
          path: "/profile",
          element: (<Profile/>)
        }
      ]
    }
  ])  


  return (
    <RouterProvider
      router={router}
    />
  )
}

export default App
