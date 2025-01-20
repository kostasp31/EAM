import Footer from "./Footer"
import ScrollButton from "./ScrollButton"
import "../help.css"

import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion'
import '../accordion.css' // Import default styles  

import { useNavigate } from "react-router"
import { useState, useEffect } from "react"

import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_APP } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'

const Help_Profs = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState(null)
  const [isProf, setIsProf] = useState('')
  const [clickedProfile, setClickedProfile] = useState(false)

  const [submittedDate, setSubmittedDate] = useState(false)

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
  }, [userId, submittedDate])

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

  return (
    <div>
      <nav className="navbar" style={{marginBottom:'100px'}}>
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

      <div style={{textAlign:'center'}}>
      <div style={{paddingBottom:'100px'}}>
        <div className='main-heading' style={{paddingTop:'150px'}}>
          Βοήθεια για επαγγελματίες
        </div>
        <hr style={{width:'50%'}}/>
        <div className='heading' style={{paddingBottom:'100px'}}>
          Διαδικασία - βήματα εύρεσης εργασίας
        </div>

        <div className='directions-main' style={{marginBottom:'100px'}}>
            <div className='directions-element'>
              <div className='numberCircle'>1</div>
              <div className='odigia-title'>
                Πληροφόρηση
                <hr style={{width:'80%'}} />
              </div>
              <div className='odigia-text'>
                Ενημερωθείτε για τα κριτήρια επιλεξιμότητας και την διαδικασία εγγραφής στην υπηρεσία
              </div>
            </div>
            <div className='directions-element' style={{backgroundColor: '#7dcfff'}}>
              <div className="arrow-right"></div>
              <div className='numberCircle'>2</div>
              <div className='odigia-title'>
                Βιογραφικό
                <hr style={{width:'80%'}} />
              </div>
              <div className='odigia-text'>
                Δημιουργήστε βιογραφικό με τις προσωπικές σας πληροφορίες.
              </div>
            </div>
            <div className='directions-element'>
              <div className="arrow-right" style={{borderLeft: '32px solid #7dcfff'}}></div>
                <div className='numberCircle'>3</div>
                <div className='odigia-title'>
                  Αγγελία
                  <hr style={{width:'80%'}} />
                </div>
                <div className='odigia-text'>
                  Δημιουργήστε την προσωπική σας αγγελία.
                </div>
            </div>
            <div className='directions-element' style={{backgroundColor: '#7dcfff'}}>
              <div className="arrow-right"></div>
              <div className='numberCircle'>4</div>
              <div className='odigia-title'>
                Ραντεβού
                <hr style={{width:'80%'}} />
              </div>
              <div className='odigia-text'>
                Συναντηθείτε και γνωριστείτε με τον γονέα.
              </div>
            </div>
            <div className='directions-element'>
              <div className="arrow-right" style={{borderLeft: '32px solid #7dcfff'}}></div>
              <div className='numberCircle'>5</div>
              <div className='odigia-title'>
                Συμφωνητικό
                <hr style={{width:'80%'}} />
              </div>
              <div className='odigia-text'>
                Συνάψτε και υπογράψτε το συμφωνητικό συνεργασίας.
              </div>
            </div>
            <div className='directions-element' style={{backgroundColor: '#7dcfff'}}>
              <div className="arrow-right"></div>
              <div className='numberCircle'>6</div>
              <div className='odigia-title'>
                Πληρωμή
                <hr style={{width:'80%'}} />
              </div>
              <div className='odigia-text'>
                Λάβετε κάθε μήνα το voucher για την πληρωμή σας.
              </div>
            </div>
        </div>

      </div>
      </div>

      <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto', marginBottom:'100px', marginTop:'-100px' }}>
        <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => navigate('/help')}>
          <img src='/icons/back.svg' width='28px' style={{ marginRight: '8px' }} />
          <span>Επιστροφή</span>
        </button>
      </div>

      <Footer />
    </div>

  )
}

export default Help_Profs