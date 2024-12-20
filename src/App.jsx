import { BrowserRouter, Routes, Route } from "react-router-dom"

import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'
import Root from './components/Root'

const App = () => {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="/" element={<Root />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
