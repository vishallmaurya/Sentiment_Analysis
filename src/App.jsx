import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from "./layout/AppLayout"
import { Home } from './Pages/Home'
import { Login } from './Pages/Login'
import { SignUp } from './Pages/SignUp'

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
          path: "/signup",
          element: (<SignUp/>)
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
