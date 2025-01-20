import React from 'react'
import ProfileComponent from "./Profile/ProfileComponent"
import Footer from './Footer'

import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_APP } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router'

import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import 'animate.css/animate.min.css'

import TimePickerDummy from './TimePicker_Dummy'

const Preview_Application = () => {
  const app_index = useParams().index
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const [appData, setAppData] = useState(null)
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

      setUserData(users)
      setAppData(users[0].applications[app_index])

      console.log(users[0].applications[app_index])

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

  return (
    <div>
      <ReactNotifications />
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
                    <li><a href="/profile_profs">Προφίλ</a></li>
                    :
                    <li><a href="/profile">Προφίλ</a></li>
                  }

                  <li onClick={handleLogout}  style={{color:'#ff0000', cursor:'pointer'}}>Αποσύνδεση</li>
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
        <a href="/parent" ><span style={{verticalAlign:'middle'}}><img src='/icons/home.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αρχική σελίδα</a>
        <a href="/search"><span style={{verticalAlign:'middle'}}><img src='/icons/search.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αναζήτηση</a>
        <a href="/applications" style={{backgroundColor:'rgb(50, 165, 154)'}}><span style={{verticalAlign:'middle'}}><img src='/icons/paper.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αιτήσεις</a>
        <a href="/colabs"><span style={{verticalAlign:'middle'}}><img src='/icons/arrows.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Συνεργασίες</a>
        <a href="/dates"><span style={{verticalAlign:'middle'}}><img src='/icons/users.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ραντεβού</a>
        <a href="/notifs"><span style={{verticalAlign:'middle'}}><img src='/icons/bell.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ειδοποιήσεις</a>
        <a href="/profile"><span style={{verticalAlign:'middle'}}><img src='/icons/person.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Προφίλ</a>
        <a href="/help" style={{borderBottom:'1px solid white'}}><span style={{verticalAlign:'middle'}}><img src='/icons/help.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Βοήθεια</a>
      </div>

      {appData &&
        <div>
        <div style={{ paddingLeft: '270px', paddingTop: '90px' }}>
          <div style={{ height: '15px', alignItems: 'left' }}>
            <a href='/'>Aρχική σελίδα</a>
            {'  >  '}
            <a href='/parent'>Γονείς</a>
            {'  >  Αίτηση συνεργασίας με ' + appData.prof_name}
          </div>
          <h1 style={{ marginTop: "35px" }}>&emsp;{'Αίτηση συνεργασίας με ' + appData.prof_name}</h1>
          <hr style={{ color: 'turquoise', backgroundColor: 'turquoise', border: 'none', height: '4px', width: '90px', float: 'left', marginTop: '-20px', marginLeft: '30px' }} />
        </div>


        <div>
          <div className='main-content' style={{marginTop:'-80px'}}>
            <div style={{marginLeft:'250px'}}>
            <div style={{marginLeft:'auto', marginRight:'auto', width:'fit-content', fontSize:'25px', fontWeight:'700', marginBottom:'50px'}}>Στοιχεία γονέα</div>
            <form style={{width:'fit-content', marginLeft:'auto', marginRight:'auto', marginTop:'50px'}}>
              <div className="input-row">
                <div className="input_box">
                  <label htmlFor="name-field">Όνομα</label>
                  <input type="text" id="name-field" value={appData.name} disabled/>
                </div>
                <div className="input_box">
                  <label htmlFor="surname-field">Επώνυμο</label>
                  <input type="text" id="surname-field" value={appData.surname} disabled/>
                </div>
              </div>
              <div className="input-row">
                <div className="input_box">
                  <label htmlFor="age-field">Ηλικία</label>
                  <input type="number" id="age-field" disabled value={appData.age}/>
                </div>
                <div className="input_box">
                  <label htmlFor="sex-field">Φύλο</label>
                  <select name="cars" id="sex-field" disabled value={appData.gender} >
                    <option value="" hidden></option>
                    <option value="male">Άντρας</option>
                    <option value="female">Γυναίκα</option>
                  </select>
                </div>
              </div>
              <div className="input-row">
                <div className="input_box">
                  <label htmlFor="amka-field">ΑΜΚΑ</label>
                  <input type="number" id="amka-field" disabled value={appData.AMKA}/>
                </div>
                <div className="input_box">
                  <label htmlFor="afm-field">ΑΦΜ</label>
                  <input type="number" id="afm-field" disabled value={appData.AFM} />
                </div>
              </div>
              <div className="input-row">
                <div className="input_box">
                  <label htmlFor="email-field">Email</label>
                  <input type="email" id="email-field" disabled value={appData.email}/>
                </div>
                <div className="input_box">
                  <label htmlFor="phone-field">Τηλέφωνο</label>
                  <input type="phone" id="phone-field"  disabled value={appData.phone} />
                </div>
              </div>
              <div className="input-row">

                <div className="input_box">
                  <label htmlFor="address-field">Δήμος</label>
                  <select name="cars" id="sex-field"  disabled value={appData.address} >
                    <option value=""  hidden></option>
                    <option value="Athena">Δήμος Αθηναίων</option>
                    <option value="Aigina">Δήμος Αίγινας</option>
                    <option value="Peristeri">Δήμος Περιστερίου</option>
                    <option value="Galatsi">Δήμος Γαλατσίου</option>
                    <option value="Zografou">Δήμος Ζωγράφου</option>
                    <option value="Irakleiou">Δήμος Ηρακλείου</option>
                  </select>
                </div>

                <div className="input_box">
                  <label htmlFor="taxidromikos-field">Ταχυδρομικός Κώδικας</label>
                  <input type="text" id="taxidromikos-field" disabled value={appData.tk}/>
                </div>
              </div>
              <div className="input-row">
                <div className="input_box">
                  <label htmlFor="city-field">Πόλη</label>
                  <input type="text" id="city-field"  disabled value={appData.city} />
                </div>
                <div className="input_box">
                  <label htmlFor="area-field">Περιοχή</label>
                  <input type="text" id="area-field"  disabled value={appData.area} />
                </div>
              </div>
              <div className="last-row">

              </div>
            </form>

            <div style={{marginLeft:'auto', marginRight:'auto', width:'fit-content', fontSize:'25px', fontWeight:'700', marginBottom:'30px', marginTop:'30px'}}>Στοιχεία παιδιού</div>
            <form style={{width:'fit-content', marginLeft:'auto', marginRight:'auto', marginTop:'50px'}}>
              <div className="input-row">
                <div className="input_box">
                  <label htmlFor="name-field">Όνομα</label>
                  <input type="text" id="name-field" value={appData.childName} disabled/>
                </div>
                <div className="input_box">
                  <label htmlFor="surname-field">Επώνυμο</label>
                  <input type="text" id="surname-field" value={appData.childSurname} disabled/>
                </div>
              </div>
              <div className="input-row">
                <div className="input_box">
                  <label htmlFor="age-field">Ηλικία</label>
                  <input type="number" id="age-field" value={appData.childAge} disabled/>
                </div>
                <div className="input_box">
                  <label htmlFor="sex-field">Φύλο</label>
                  <select name="cars" id="sex-field" value={appData.childGender} disabled>
                    <option value="" disabled hidden></option>
                    <option value="male">Άντρας</option>
                    <option value="female">Γυναίκα</option>
                  </select>
                </div>
              </div>
              <div className="input-row">
                <div className="input_box" style={{marginLeft:'auto', marginRight:'auto', width:'fit-content'}}>
                  <label htmlFor="amka-field">ΑΜΚΑ</label>
                  <input type="number" id="amka-field" value={appData.childAMKA} disabled/>
                </div>
              </div>
            </form>
            </div>
            <hr style={{marginRight:'-250px', marginTop:'50px'}}/>

            <div style={{marginLeft:'250px'}}>
              <h2 style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>Ώρες απασχόλησης</h2>
              <TimePickerDummy availability={appData.hours} />
              <br />
              <h2 style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>Τοποθεσία απασχόλησης</h2>
              <div className='pass-input-container' style={{display:'flex'}}>
                <img style={{width:'42px'}} src='/icons/location_64.png'/>
                <input
                  disabled
                  className='form-input'
                  style={{}}
                  placeholder='Διεύθυνση και αριθμός'
                  value={appData.place}
                  onChange={(e) => {
                    setPlace(e.target.value)
                  }}
                />
              </div>
            </div>

            <hr style={{marginRight:'-250px', marginTop:'50px'}}/>

            <div>
            <div style={{marginLeft:'250px'}}>
              <h1 style={{ textAlign: 'center', marginTop:'70px'  }}>Συμφωνητικό συνεργασίας</h1>
              <div className='box1' style={{width:'100px', marginLeft:'auto', marginRight:'auto', width:'fit-content'}}>
                  {appData.aggrement}
              </div>
            </div>
            <br />
            <div style={{marginLeft:'250px'}}>
              <h2 style={{ textAlign: 'center'}}>Ισχύς συνεργασίας</h2>
              <div style={{display:'flex'}}>
                <div>
                  <h4>Από</h4>
                  <select disabled onChange={(e) => setStartDay(e.target.value)} value={appData.startDay}>
                    <option value="" disabled selected>Ημέρα</option> {/* days do not adjust with months */}
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select> / 
                  <select disabled style={{marginLeft:'5px'}} onChange={(e) => setStartMonth(e.target.value)} value={appData.startMonth}>
                    <option value="" disabled selected>Μήνας</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select> /
                  <select disabled style={{marginLeft:'5px'}} onChange={(e) => setStartYear(e.target.value)} value={appData.startYear}>
                    <option value="" disabled selected>Έτος</option>
                    <option>2025</option>
                    <option>2026</option>
                  </select>
                </div>
                <div style={{marginLeft:'15px'}}>
                  <h4>Μέχρι</h4>
                  <select disabled onChange={(e) => setEndDay(e.target.value)} value={appData.endDay}>
                    <option value="" disabled selected>Ημέρα</option> {/* days do not adjust with months */}
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select> / 
                  <select disabled style={{marginLeft:'5px'}} onChange={(e) => setEndMonth(e.target.value)} value={appData.endMonth}>
                    <option value="" disabled selected>Μήνας</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select> /
                  <select disabled style={{marginLeft:'5px'}} onChange={(e) => setEndYear(e.target.value)} value={appData.endYear}>
                    <option value="" disabled selected>Έτος</option>
                    <option>2025</option>
                    <option>2026</option>
                  </select>
                </div>
              </div>
            </div>
            </div>

            <hr style={{marginRight:'-250px', marginTop:'50px'}}/>

            <div style={{marginLeft:'250px'}}>
              <div style={{marginLeft:'auto', marginRight:'auto', width:'fit-content', fontSize:'25px', fontWeight:'700', marginBottom:'50px', marginTop:'50px'}}>Όροι και προϋποθέσεις</div>
              <div>
                <div style={{marginBottom:'50px'}}>
                  <input type="checkbox" disabled checked={appData.dilosi}/> <span>Δηλώνω υπεύθυνα ότι επιβεβαιώνω την εκυρότητα των υποβληθέντων στοιχείων</span>
                </div>
                <div>
                  <input type="checkbox" disabled size="100" checked={appData.apodoxi} /> <span>Αποδοχή <a href="/help/conditions" target='blank'>όρων και προϋποθέσεων</a></span>
                </div>
              </div>
            </div>     
          </div>
        </div>
      </div>
      }
      <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto', marginBottom:'50px', marginTop:'-50px' }}>
        <button className='button-40' style={{ display: 'flex', alignItems: 'center', marginLeft:'250px', width:'fit-content' }} onClick={() => navigate('/applications')}>
          <img src='/icons/back.svg' width='28px' style={{ marginRight: '8px' }} />
          <span>Επιστροφή</span>
        </button>
      </div>

      <Footer />
    </div>
  )
}

export default Preview_Application