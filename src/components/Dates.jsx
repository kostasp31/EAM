import React from 'react'
import Footer from "./Footer.jsx"
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_APP } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'

const Date = () => {
  return (
    <div className='box' style={{backgroundColor:'lightgray', border:'0', boxShadow:'3px 3px 1px #38bca4', padding:'15px', marginBottom:'20px'}}>
      <h3 style={{marginTop:'0px'}}>Ραντεβού με [Ονοματεπώνυμο]</h3>
      <p>Ημερομηνία:</p>
      <p>Τρόπος συνάντησης:</p>
      <p>Τόπος/Σύνδεσμος συνάντησης:</p>
      <p style={{marginBottom:0}}>Κατάσταση Ραντεβού:</p>
    </div>
  )
}

const Dates = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState(null)
  const [isProf, setIsProf] = useState('')
  const [clickedProfile, setClickedProfile] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUserId(user.uid) // Store the user's UID
      } else {
        setUserId(null)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchUserData() // Fetch user data only after the user_id is available
    }
  }, [userId])

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH)
      navigate('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleLogoutLogin = async () => {
    try {
      await signOut(FIREBASE_AUTH)
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const fetchUserData = async () => {
    try {
      const q = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', userId)) // Query only data matching the user's UID
      const querySnapshot = await getDocs(q)
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      // console.log("user id: ", userId)
      console.log("user data: ", users)
      setUserData(users)

      if (users[0] && users[0].user_category === 'professional')
        setIsProf('professional')
      else
        setIsProf('parent')
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const CircleWithInitials = ({ name, surname }) => {
    let initials = name[0]+surname[0]
    return (
      <div className="circle">
        {initials}  
    </div>
    )
  }

  const days = Array.from({length:31}, (_,i) => i + 1)
  const months = Array.from({length:12}, (_,i) => i + 1)
  const hours = Array.from({length:24}, (_,i) => i + 0)

  return (    
    <div>
      <nav class="navbar" style={{position:'fixed', top:'0'}}>
        <a href="/" class="logo">
          <img src="/logos/gov_gr_logo.svg" alt="GOV logo" />
        </a>
        <ul class="nav-links">
          <li class="nav-item"><a href="/">Αρχική σελίδα</a></li>
          <li class="nav-item"><a href="/profs">Επαγγελματίες</a></li>
          <li class="nav-item" style={{backgroundColor:'rgb(206, 205, 205)', borderRadius:'7px'}}><a href="/parent">Γονείς</a></li>
          <li class="nav-item"><a href="/announcements">Ανακοινώσεις</a></li>
          <li class="nav-item"><a href="/help">Βοήθεια</a></li>
          {(window.localStorage.length && userData[0]) ?
            <li>
              <div style={{cursor:'pointer', marginRight:'10px'}} onClick={() => setClickedProfile(!clickedProfile)}>
                <CircleWithInitials name={userData[0].name} surname={userData[0].surname} />
              </div>
              { clickedProfile ?
              <div className="menu">
                <ul>
                  {userData[0].user_category === 'professional' ?
                    <li><a href="/profile_profs">Profile</a></li>
                    :
                    <li><a href="/profile">Profile</a></li>
                  }

                  <li onClick={handleLogout}>Logout</li>
                </ul>
              </div>
              : '' }
            </li>
          :
            (!window.localStorage.length) ?
            <li class="nav-item"><a href="/login">Σύνδεση</a></li>
          :
            ''
          }
        </ul>
      </nav>


      <div className="sidenav">
        <a href="/parent" ><span style={{verticalAlign:'middle'}}><img src='icons/home.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αρχική σελίδα</a>
        <a href="/search"><span style={{verticalAlign:'middle'}}><img src='icons/search.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αναζήτηση</a>
        <a href="/applications"><span style={{verticalAlign:'middle'}}><img src='icons/paper.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αιτήσεις</a>
        <a href="/colabs"><span style={{verticalAlign:'middle'}}><img src='icons/arrows.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Συνεργασίες</a>
        <a href="/dates" style={{backgroundColor:'rgb(72,124,116)'}}><span style={{verticalAlign:'middle'}}><img src='icons/users.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ραντεβού</a>
        <a href="/notifs"><span style={{verticalAlign:'middle'}}><img src='icons/bell.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ειδοποιήσεις</a>
        <a href="/profile"><span style={{verticalAlign:'middle'}}><img src='icons/person.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Προφίλ</a>
        <a href="/help" style={{borderBottom:'1px solid white'}}><span style={{verticalAlign:'middle'}}><img src='icons/help.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Βοήθεια</a>
      </div>

      <div style={{ marginTop: "90px", marginLeft: "300px", height:'15px'}}>
        <a href='/'>Aρχική σελίδα</a>
        {'  >  '}
        <a href='/parent'>Γονείς</a>
        {'  >  Ραντεβού'}
      </div>
      <h1 style={{ marginTop: "35px", marginLeft: "300px"}}>&emsp;Ραντεβού</h1>

      {(userData[0] && userId && userData[0].user_category === "parent") ?
      <div style={{display:'flex'}}>
        <div className='box' style={{width: "40%", height: "auto",marginTop: "50px",marginLeft:"350px", marginBottom:"50px"}}>
          <Date />
          <Date />
          <Date />
        </div>
        <div className='box' style={{width: "20%", height: "auto",marginTop: "50px",marginBottom:"50px", marginLeft:'30px'}}>
          <h3 style={{textAlign:'center'}}>Νέο ραντεβού</h3>
          <b>Με</b>
          <hr style={{width:'40px',marginTop:'2px',marginLeft:'10px',border:'1px solid  #38bca4'}}/>
          <p>[Ονοματεπώνυμο]</p>
          <form>
            <b>Ημερομηνία</b>
            <hr style={{width:'40px',marginTop:'2px',marginLeft:'10px',border:'1px solid  #38bca4'}}/>
            <select>
              <option value="" disabled selected>Ημέρα</option> {/* days do not adjust with months */}
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select> / 
            <select style={{marginLeft:'5px'}}>
              <option value="" disabled selected>Μήνας</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select> /
            <select style={{marginLeft:'5px'}}>
              <option value="" disabled selected>Έτος</option>
              <option>2025</option>
              <option>2026</option>
            </select>
            <br />
            <br />
            <b>Ώρα</b>
            <hr style={{width:'40px',marginTop:'2px',marginLeft:'10px',border:'1px solid  #38bca4'}}/>
            <select>
              <option value="" disabled selected>Ώρα</option>
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
            </select> : 
            <select style={{marginLeft:'5px'}}>
              <option value="" disabled selected>Λεπτά</option>
              <option>00</option>
              <option>15</option>
              <option>30</option>
              <option>45</option>
            </select>
            <br />
            <br />
            <b>Τρόπος Συνάντησης</b>
          </form>
        </div>
      </div>

      :
      (isProf === 'professional') ?
        <div className='main-content'>
          <div style={{marginLeft:'250px'}}>
            <h1 style={{ marginTop: "35px" }}>&emsp;Συνδεθείτε ως γονέας</h1>
            <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
              <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => {handleLogoutLogin()}}>
                <img src='icons/login.svg' width='28px' style={{ marginRight: '8px' }} />
                <span>Σύνδεση</span>
              </button>
            </div>
          </div>
        </div>
      :
        (window.localStorage.length) ?
          <div className='main-content'>
            <img style={{marginLeft:'250px'}} src='/gifs/loading.svg' />
          </div>
        :
        <div className='main-content'>
          <div style={{marginLeft:'250px'}}>
            <h1 style={{ marginTop: "35px" }}>&emsp;Συνδεθείτε ως γονέας</h1>
            <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
              <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => {handleLogoutLogin()}}>
                <img src='icons/login.svg' width='28px' style={{ marginRight: '8px' }} />
                <span>Σύνδεση</span>
              </button>
            </div>
          </div>
        </div>
      }
    <Footer />
      
    </div>
  )
}

export default Dates