import React from 'react'
import { useNavigate } from 'react-router-dom'
import "../help.css"

import ScrollButton from './ScrollButton'


import Footer from "./Footer.jsx"
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_APP } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { useState, useEffect } from 'react'

const Help = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState(null)
  const [isProf, setIsProf] = useState('')
  const [clickedProfile, setClickedProfile] = useState(false)

  const [meanRating, setMeanRating] = useState(null)

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
      // console.log("user data: ", users)
      setUserData(users)

      if (users[0] && users[0].user_category === 'professional') {
        setIsProf('professional')
        if (users[0].ratings) {
          let count = 0
          for (let i=0; i<users[0].ratings.length; i++)
            count += users[0].ratings[i].rating
          setMeanRating(count / users[0].ratings.length)
        }
        else {
          setMeanRating(-1)
        }
      }
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

  // TODO; fix onClick
  return (    
    <div>
      <nav className="navbar">
        <a href="/" className="logo">
          <img src="/logos/gov_gr_logo.svg" alt="GOV logo" />
        </a>
        <ul className="nav-links">
          <li className="nav-item"><a href="/">Αρχική σελίδα</a></li>
          <li className="nav-item"><a href="/profs">Επαγγελματίες</a></li>
          <li className="nav-item"><a href="/parent">Γονείς</a></li>
          {/* <li className="nav-item"><a href="/announcements">Ανακοινώσεις</a></li> */}
          <li className="nav-item" style={{backgroundColor:'rgb(206, 205, 205)', borderRadius:'7px'}}><a href="/help">Βοήθεια</a></li>
          {(window.localStorage.length && userData[0]) ?
            <li>
              <div style={{cursor:'pointer', marginRight:'10px'}} onClick={() => setClickedProfile(!clickedProfile)}>
                <CircleWithInitials name={userData[0].name} surname={userData[0].surname} />
              </div>
              { clickedProfile ?
              <div className="menu">
                <ul>
                  {userData[0].user_category === 'professional' ?
                    <li><a href="/profile_profs">Προφίλ</a></li>
                    :
                    <li><a href="/profile">Προφίλ</a></li>
                  }

                  <li onClick={handleLogout} style={{color:'#ff0000', cursor:'pointer'}}>Αποσύνδεση</li>
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

      <ScrollButton />

      <div className='main-content'>
        <div className='main-heading'>
          Χρειάζεστε Βοήθεια;
        </div>

        <div className='searchbar-main-0'>
          <div className='searchbar-main-1'>
            <div className='input-container'>
              <input
                className='input-form'
                placeholder='Αναζήτηση βοήθειας'
                />
            </div>
            <div className='searchbar-main-icon' style={{marginRight:'20px'}}>
              <img src='/icons/search_24.png' />
            </div>
          </div>
        </div>

        <hr />
        <div className='panel-grid'>
          <div className='first-row'>
            <div className='first-row-element' onClick={() => navigate('/help/parents')}>
              <div className='heading'>Για γονείς</div>
              <div className='content'>
                Πληροφορίες σχετικά με τα κριτήρια επιλεξιμότητας και την διαδικασία υποβολής αίτησης.
              </div>
            </div>
            <div className='first-row-element' onClick={() => navigate('/help/profs')}>
              <div className='heading'>Για Επαγγελματίες</div>
              <div className='content'>
              Πληροφορίες σχετικά με τα κριτήρια επιλεξιμότητας τη δημιουργία αγγελίας και τη σύναψη συμφωνητικού.
              </div>
            </div>
          </div>
          <div className='second-row'>
            <div className='second-row-element' onClick={() => navigate('/help/FAQ_parents')}>
            <div className='heading'>FAQ - Γονείς</div>
            <div className='content'>
            Συχνές ερωτήσεις σχετικά με τη χρήση της πλατφόρμας και τι προϋποθέσεις δήλωσης από τους ενδιαφερόμενους γονείς.
              </div>
            </div>
            <div className='second-row-element' onClick={() => navigate('/help/FAQ_professionals')}>
            <div className='heading'>FAQ - Επαγγελματίες</div>
            <div className='content'>
            Συχνές ερωτήσεις σχετικά με τη χρήση της πλατφόρμας και τι προϋποθέσεις δήλωσης από τους ενδιαφερόμενους επαγγελματίες.
              </div>
            </div>
            <div className='second-row-element' onClick={() => navigate('/help/conditions')}>
            <div className='heading'>Όροι Χρήσης</div>
            <div className='content'>
            Όροι χρήσης της πλατφόρμας και δήλωση προσωπικών δεδομένων.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto', marginBottom:'100px', marginTop:'-200px' }}>
        <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
          <img src='/icons/back.svg' width='28px' style={{ marginRight: '8px' }} />
          <span>Επιστροφή</span>
        </button>
      </div>

      <Footer />

    </div>
  )
}

export default Help