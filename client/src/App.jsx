import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from "react-hot-toast"
import { AuthContext } from '../context/AuthContext'

const App = () => {
  const { authUser } = useContext(AuthContext)
  
  return (
    <div className="min-h-screen bg-[url(/bgImage.svg)] bg-cover bg-fixed bg-center">  {/* ✅ Improved background */}
      <Toaster 
        position="top-right"  // ✅ Added position
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Routes>
        <Route 
          path='/' 
          element={authUser ? <HomePage /> : <Navigate to="/login" replace />}  // ✅ Added replace
        />
        <Route 
          path='/login' 
          element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}  // ✅ Added replace
        />
        <Route 
          path='/profile' 
          element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />}  // ✅ Added replace
        />
        {/* ✅ Optional: Add a 404 route */}
        <Route 
          path="*" 
          element={<Navigate to={authUser ? "/" : "/login"} replace />} 
        />
      </Routes>
    </div>
  ) 
} 

export default App