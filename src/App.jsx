import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from "./layout/AppLayout"
import { Home } from './Pages/Home'

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
