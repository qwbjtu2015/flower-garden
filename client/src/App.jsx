import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Home from './pages/Home'
import FlowerDetail from './pages/FlowerDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import Tips from './pages/Tips'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/flower/:id" element={<FlowerDetail />} />
              <Route path="/tips" element={<Tips />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-100 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
        <p className="text-lg mb-2">🌸 花语花园 - 您的养花指南</p>
        <p className="text-sm">分享养花知识，感受自然之美</p>
      </div>
    </footer>
  )
}

export default App
