import React from 'react'
import Footer from "./Footer.jsx"
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_APP } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'

const Search = () => {
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

  let ageOptions = []
  for (let i=18; i<=65; i++){
    ageOptions.push(i)
  }

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


      <div class="sidenav">
        <a href="/parent" ><span style={{verticalAlign:'middle'}}><img src='icons/home.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αρχική σελίδα</a>
        <a href="/search" style={{backgroundColor:'rgb(72,124,116)'}}><span style={{verticalAlign:'middle'}}><img src='icons/search.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αναζήτηση</a>
        <a href="/applications"><span style={{verticalAlign:'middle'}}><img src='icons/paper.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αιτήσεις</a>
        <a href="/colabs"><span style={{verticalAlign:'middle'}}><img src='icons/arrows.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Συνεργασίες</a>
        <a href="/dates"><span style={{verticalAlign:'middle'}}><img src='icons/users.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ραντεβού</a>
        <a href="/notifs"><span style={{verticalAlign:'middle'}}><img src='icons/bell.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ειδοποιήσεις</a>
        <a href="/profile"><span style={{verticalAlign:'middle'}}><img src='icons/person.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Προφίλ</a>
        <a href="/help" style={{borderBottom:'1px solid white'}}><span style={{verticalAlign:'middle'}}><img src='icons/help.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Βοήθεια</a>
      </div>

      <div style={{ marginTop: "90px", marginLeft: "300px", height:'15px'}}>
        <a href='/'>Aρχική σελίδα</a>
        {'  >  '}
        <a href='/parent'>Γονείς</a>
        {'  >  Αναζήτηση'}
      </div>
      <h1 style={{ marginTop: "35px", marginLeft: "300px"}}>&emsp;Αναζήτηση</h1>

      {(userData[0] && userId && userData[0].user_category === "parent") ?
        <div style={{display:'flex'}}>
          <div className='box' style={{width: "300px",height: "900px",marginTop: "50px",marginLeft:"450px",marginRight: "100px", marginBottom:"50px"}}>
            <h2 style={{textAlign:'center', paddingBottom:'10px'}}>Φίλτρα</h2>
            <form>
                <h4>Απασχόληση</h4>
                <label>Μερική</label>
                <input style={{marginLeft:'7px'}} type='radio' name='time'></input>
                <br/>
                <label>Πλήρης</label>
                <input type='radio' name='time'></input>
                
                <hr />

                <h4>Δήμος</h4>
                <select style={{padding:'7px', width:'300px', borderRadius:'6px'}}>
                  <option>Επιλέξτε Δήμο...</option>
                  <option>Δήμος Αθηναίων</option>
                  <option>Δήμος Αίγινας</option>
                  <option>Δήμος Περιστερίου</option>
                  <option>Δήμος Γαλατσίου</option>
                  <option>Δήμος Ζωγράφου</option>
                  <option>Δήμος Ηρακλείου</option>
                </select>

                <hr />

                <h4>Τοποθεσία εργασίας</h4>
                <label>Σπίτι Γονέα</label>
                <input style={{marginLeft:'99px'}} type='radio' name='place'></input>
                <br />
                <label>Σπίτι Επαγγελματία</label>
                <input style={{marginLeft:'40px'}} type='radio' name='place'></input>
                <br />
                <label>Άλλη Τοποθεσία</label>
                <input style={{marginLeft:'63px'}} type='radio' name='place'></input>

                <hr />
                
                <h4>Ηλικία επαγγελματία</h4>
                <select style={{padding:'7px', width:'45%', borderRadius:'6px',marginRight:'20px'}}>
                  <option>Από</option>
                  {ageOptions.map((age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
                <select style={{padding:'7px', width:'45%', borderRadius:'6px'}}>
                <option>Μέχρι</option>
                {ageOptions.map((age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
                </select>

                <hr />

                <h4>Διαθεσιμότητα</h4>
                <button className='custom-button'>
                  <img style={{marginLeft:'30px', marginTop:'12px' }} src='/icons/calendar_24.png' />
                  <h4 style={{marginLeft:'30px', }}>Επιλέξτε διαθεσιμότητα</h4>
                </button>

                <hr />

                <h4>Αξιολόγηση</h4>
                <img src='/icons/star_24.png' />
                <input style={{marginLeft:'150px'}} type='checkbox'></input>
                <br />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <input style={{marginLeft:'126px'}} type='checkbox'></input>
                <br />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <input style={{marginLeft:'102px'}} type='checkbox'></input>
                <br />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <input style={{marginLeft:'78px'}} type='checkbox'></input>
                <br />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <input style={{marginLeft:'54px'}} type='checkbox'></input>
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

      <Footer style={{marginTop:'20px'}}/>

    </div>  
  )
}

export default Search 