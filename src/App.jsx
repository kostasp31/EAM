import { BrowserRouter, Routes, Route } from "react-router-dom"

import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'

import { Container, TextField, Button } from '@mui/material'

const App = () => {
  
  return (
    <Container>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="profile" element={<Profile/>} />
            <Route path="/" element={<Login />} />
            <Route path="register" element={<Register/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </Container>
  )
}

export default App
