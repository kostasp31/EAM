import { BrowserRouter, Routes, Route } from "react-router-dom"

import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'
import Root from './components/Root'
import Parent from './components/Parent'
import Search from "./components/Search"
import Applications from "./components/Applications"
import Colabs from "./components/Colabs"
import Dates from "./components/Dates"
import Help from "./components/Help"
import Notifications from "./components/Notifications"
import Announcements from "./components/Announcements"


const App = () => {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="parent" element={<Parent />} />
          <Route path="search" element={<Search />} />
          <Route path="applications" element={<Applications />} />
          <Route path="colabs" element={<Colabs />} />
          <Route path="dates" element={<Dates />} />
          <Route path="help" element={<Help />} />
          <Route path="notifs" element={<Notifications />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="/" element={<Root />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
