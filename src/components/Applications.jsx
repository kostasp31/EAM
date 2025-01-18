import React from 'react'
import Footer from "./Footer.jsx"
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_APP } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'

import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'

import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import 'animate.css/animate.min.css'

const Applications = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState(null)
  const [isProf, setIsProf] = useState('')
  const [clickedProfile, setClickedProfile] = useState(false)

  const [page, setPage] = useState(0)

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

  return (    
    <div>
      <nav className="navbar" style={{position:'fixed', top:'0'}}>
        <a href="/" className="logo">
          <img src="/logos/gov_gr_logo.svg" alt="GOV logo" />
        </a>
        <ul className="nav-links">
          <li className="nav-item"><a href="/">Αρχική σελίδα</a></li>
          <li className="nav-item"><a href="/profs">Επαγγελματίες</a></li>
          <li className="nav-item" style={{backgroundColor:'rgb(206, 205, 205)', borderRadius:'7px'}}><a href="/parent">Γονείς</a></li>
          {/* <li className="nav-item"><a href="/announcements">Ανακοινώσεις</a></li> */}
          <li className="nav-item"><a href="/help">Βοήθεια</a></li>
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
        <a href="/applications" style={{backgroundColor:'rgb(50, 165, 154)'}}><span style={{verticalAlign:'middle'}}><img src='icons/paper.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αιτήσεις</a>
        <a href="/colabs"><span style={{verticalAlign:'middle'}}><img src='icons/arrows.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Συνεργασίες</a>
        <a href="/dates"><span style={{verticalAlign:'middle'}}><img src='icons/users.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ραντεβού</a>
        <a href="/notifs"><span style={{verticalAlign:'middle'}}><img src='icons/bell.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ειδοποιήσεις</a>
        <a href="/profile"><span style={{verticalAlign:'middle'}}><img src='icons/person.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Προφίλ</a>
        <a href="/help" style={{borderBottom:'1px solid white'}}><span style={{verticalAlign:'middle'}}><img src='icons/help.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Βοήθεια</a>
      </div>

      <div style={{ paddingLeft: '270px', paddingTop: '90px' }}>
        <div style={{ height: '15px', alignItems: 'left' }}>
          <a href='/'>Aρχική σελίδα</a>
          {'  >  '}
          <a href='/parent'>Γονείς</a>
          {'  >  Αιτήσεις'}
        </div>
        <h1 style={{ marginTop: "35px" }}>&emsp;Αιτήσεις</h1>
        <hr style={{ color: 'turquoise', backgroundColor: 'turquoise', border: 'none', height: '4px', width: '90px', float: 'left', marginTop: '-20px', marginLeft: '30px' }} />
      </div>
      

      {(userData[0] && userId && userData[0].user_category === "parent") ?
        (page === 0) ?
          <div>
            <div style={{width:'fit-content', marginRight:'auto', marginLeft:'auto', marginTop:'50px'}}>
              <h2 style={{ textAlign: 'left', marginLeft:'250px' }}>Ενεργές αιτήσεις</h2>
              <div className='box1' style={{height:'fit-content', marginBottom:'50px', display:'flex', flexDirection:'row', marginLeft:'250px', width:'1200px'}}>
                <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto'}}>
                  <div style={{fontSize:'20px', fontWeight:'700', marginBottom:'5px'}}>
                    <div>
                      Συνεργασία με 
                    </div>
                  </div>
                </div>
                <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto', marginLeft:'10px'}}>
                  <img src='icons/warning.png' width='28'/>
                </div>
                <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto', marginLeft:'10px'}}>
                  <div className='arrow-box' ><div style={{marginLeft:'11px', paddingTop:'11px', fontWeight:700}}>Εκκρεμεί αποδοχή</div></div>
                </div>

                <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto', marginLeft:'auto'}}>
                  <button className='button-40' style={{ display: 'flex', alignItems: 'center', width:'fit-content', height:'fit-content' }}>
                    <img src='icons/layers.svg' width='20px' style={{ marginRight: '8px' }} />
                    <span>Λεπτομέρειες</span>
                  </button>
                </div>
              </div>
            </div>

            <div style={{}}>
              <button className='button-40' style={{width:'200px', marginLeft:'auto', marginRight:'auto', display:'block'}} onClick={() => setPage(1)}>
                <img src='icons/pencil.svg' width='24px'/>
                <span>Νέα αίτηση</span>
              </button>
            </div>
          </div>
        : 
        <div>
          <div class="stepper-wrapper" style={{marginLeft:'250px'}}>
            <div class={page === 1 ? "stepper-item active" : "stepper-item completed"}>
              <div class="step-counter">1</div>
              <div class="step-name">Βασικά στοιχεία</div>
            </div>
            <div class={page > 2 ? "stepper-item completed" : page < 2 ? "stepper-item" : "stepper-item active"}>
              <div class="step-counter">2</div>
              <div class="step-name">Τόπος - χρόνος</div>
            </div>
            <div class={page > 3 ? "stepper-item completed" : page < 3 ? "stepper-item" : "stepper-item active"}>
              <div class="step-counter">3</div>
              <div class="step-name">Συμφωνητικό</div>
            </div>
            <div class={page > 4 ? "stepper-item completed" : page < 4 ? "stepper-item" : "stepper-item active"}>
              <div class="step-counter">4</div>
              <div class="step-name">Όροι και προϋποθέσεις</div>
            </div>
            <div class={page > 5 ? "stepper-item completed" : page < 5 ? "stepper-item" : "stepper-item active"}>
              <div class="step-counter">5</div>
              <div class="step-name">Προεπισκόπηση - υποβολή</div>
            </div>
          </div>
          <div>
            {(page === 1) ?
              <div className='main-content'>
                <div style={{marginLeft:'250px'}}>
                  1
                </div>
              </div>
            : (page === 2) ?
              <div className='main-content'>
                <div style={{marginLeft:'250px'}}>
                  2
                </div>
              </div>
            : (page === 3) ?
              <div className='main-content'>
                <div style={{marginLeft:'250px'}}>
                  3
                </div>
              </div>
            : (page === 4) ?
              <div className='main-content'>
                <div style={{marginLeft:'250px'}}>
                  4
                </div>
              </div>
            : (page === 5) ?
              <div className='main-content'>
                <div style={{marginLeft:'250px'}}>
                  5
                </div>
              </div>
            : <></>
            }
          </div>
          <div style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'100px', gap:'40px', marginLeft:'250px'}}>
              <div style={{ width: 'fit-content'}}>
                <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => {setPage(page-1)}}>
                  <img src='/icons/left_arrow.svg' width='28px' style={{ marginRight: '8px' }} />
                  <span>Προηγούμενο</span>
                </button>
              </div>
              <div style={{ width: 'fit-content'}}>
                <button disabled={page>4} className='button-40' style={{ display: 'flex', alignItems: 'center', backgroundColor:'#ffffff', color:'#000000', border: '2px solid #111827' }} onClick={() => {setPage(page+1)}}>
                  <span style={{marginLeft:'21px'}}>Επόμενο</span>
                  <img src='/icons/right_arrow.svg' width='28px' style={{ marginLeft: '8px', marginRight:'21px' }} />
                </button>
              </div>
            </div>
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
    </div>
  )
}

export default Applications