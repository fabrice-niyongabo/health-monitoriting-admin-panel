import React, { Component, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ProtectedRoute from './controllers/protected-route'
import UnProtectedRoute from './controllers/un-protected-route'
import './scss/style.scss'
import Logout from './views/pages/logout'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))

class App extends Component {
  render() {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route
              exact
              path="/"
              name="Login Page"
              element={
                <UnProtectedRoute>
                  <Suspense fallback={loading}>
                    <Login />
                  </Suspense>
                </UnProtectedRoute>
              }
            />
            <Route exact path="/logout" element={<Logout />} />
            <Route
              path="*"
              name="Home"
              element={
                <ProtectedRoute>
                  <Suspense fallback={loading}>
                    <DefaultLayout />
                  </Suspense>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </>
    )
  }
}

export default App
