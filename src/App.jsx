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

import Prof from "./components/Professional"

import Conditions from "./components/Conditions"
import FAQ_Parents from "./components/FAQ_Parents"
import FAQ_Profs from "./components/FAQ_Profs"

import Ad from "./components/Ad"
import Bio from "./components/Bio"
import Colabs_profs from "./components/Colabs_profs"
import Dates_profs from "./components/Dates_profs"
import Notifications_Profs from "./components/Notifications_profs"
import Profile_Profs from "./components/Profile_profs"
import Ratings from "./components/Ratings"


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
          <Route path="help/conditions" element={<Conditions />} />
          <Route path="help/FAQ_parents" element={<FAQ_Parents />} />
          <Route path="help/FAQ_professionals" element={<FAQ_Profs />} />
          <Route path="notifs" element={<Notifications />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="profs" element={<Prof />} />
          <Route path="ad" element={<Ad />} />
          <Route path="bio" element={<Bio />} />
          <Route path="colabs_profs" element={<Colabs_profs />} />
          <Route path="dates_profs" element={<Dates_profs />} />
          <Route path="notifs_profs" element={<Notifications_Profs />} />
          <Route path="profile_profs" element={<Profile_Profs />} />
          <Route path="ratings" element={<Ratings />} />


          <Route path="/" element={<Root />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
