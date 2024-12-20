import { BrowserRouter, Routes, Route } from "react-router-dom"

import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'

const App = () => {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="/" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
