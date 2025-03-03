import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"

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
import Public_Profile from "./components/Public_Profile"

import Help_Parents from "./components/Help_Parents"
import Help_Profs from "./components/Help_Profs"

import Preview_Application from "./components/Preview_Application"


const App = () => {
  const [filters, setFilters] = useState({
    hours: {},
    dhmos: ''
  })

  const [selectedDate, setSelectedDate] = useState([])

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="parent" element={<Parent />} />
          <Route path="search" element={<Search filters={filters} setFilters={setFilters} selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>} />
          <Route path="applications" element={<Applications selectedDate={selectedDate}/>} />
          <Route path="colabs" element={<Colabs />} />
          <Route path="dates" element={<Dates selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>} />
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

          <Route path="help/parents" element={<Help_Parents />} />
          <Route path="help/profs" element={<Help_Profs />} />

          <Route path="search/profile/:id" element={<Public_Profile selectedDate={selectedDate} setSelectedDate={setSelectedDate} />} />
          <Route path="applications/preview/:index" element={<Preview_Application />} />


          <Route path="/" element={<Root filters={filters} setFilters={setFilters}/>} />
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
