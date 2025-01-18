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


const Date = ({date, userData, userId, triggerNotif, submittedDate, setSubmittedDate}) => {
  const acceptDate = async () => {
    try {
      // Create a query against the collection
      const q = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', userData[0].uid))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const docRef = doc(FIREBASE_DB, 'user_data', querySnapshot.docs[0].id)
        console.log('udata:', userData[0])

        let temp = userData[0].dates
        for (let i=0; i<temp.length; i++) {
          if (temp[i].parent_id === date.parent_id) {
            temp[i].state = 'pending'
          }
        }
        
        await updateDoc(docRef, {
          dates: temp
        })
      
      } else {
        console.log("No such document found with the specified uid!")
      }
    } catch (error) {
      console.error("Error updating document: ", error)
    }

    try {
      // Create a query against the collection
      const q = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', date.parent_id))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const parent_data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        const docRef = doc(FIREBASE_DB, 'user_data', querySnapshot.docs[0].id)

        let oldDates = parent_data[0].dates
        let newDates = oldDates
        if (!oldDates)
          newDates = []

        let oldNotifs = parent_data[0].notifications
        let newNotifs = oldNotifs
        if (!oldNotifs)
          newNotifs = []

        const newNotif = {
          content: "αποδέχτηκε το ραντεβού σας",
          ref_user: userData[0].name + ' ' + userData[0].surname,
          time: 1646108200 
        }


        let temp = parent_data[0].dates
        for (let i=0; i<temp.length; i++) {
          if (temp[i].prof_id === userData[0].uid) {
            temp[i].state = 'pending'
          }
        }

        newNotifs.push(newNotif)

        // Update the document with the new value
        await updateDoc(docRef, {
          dates: temp,
          notifications: newNotifs
        })

        triggerNotif('success', 'Επιτυχία', 'Η κατάσταση του ραντεβού ενημερώθηκε με επιτυχία')
        setSubmittedDate(!submittedDate)

        console.log("Document updated successfully")
      } else {
        console.log("No such document found with the specified uid!")
      }
    } catch (error) {
      console.error("Error updating document: ", error)
    }  

  }

  return (
    <div className='box' style={{backgroundColor:'lightgray', border:'0', boxShadow:'3px 3px 1px #38bca4', padding:'15px', marginBottom:'20px'}}>
      <h3 style={{marginTop:'0px'}}>Ραντεβού με {date.parent_name}</h3>
      <p><b>Ημερομηνία:</b> {date.day}/{date.month}/{date.year}, {date.hour}:{date.minute}</p>
      <p><b>Τρόπος συνάντησης:</b> {date.synantisi === 'personal' ? 'Φυσική παρουσία' : 'Βιντεοδιάσκεψη'}</p>
      <p><b>Τόπος/Σύνδεσμος συνάντησης:</b> {date.place}</p>
      

      {date.state === 'request' ? 
        <div>
          <div style={{height:'fit-content', display:'flex', flexDirection:'row', marginTop:'-15px'}}>
            <p><b>Κατάσταση Ραντεβού</b>: Ακκρεμεί αποδοχή</p>       
            <div style={{height:'fit-content', marginTop:'13px', marginBottom:'auto', marginLeft:'10px'}}>
              <img src='/icons/warning.png' width='28'/>
            </div>
          </div>
          <button onClick={acceptDate} className='button-41' style={{display:'flex', justifyContent:'flex-end', marginTop:'-55px'}}>Αποδοχή</button>
        </div>
        : date.state === 'pending' ?
        <div>
          <div style={{height:'fit-content', display:'flex', flexDirection:'row', marginTop:'-15px'}}>
            <p><b>Κατάσταση Ραντεβού</b>: Το ραντεβού δεν έχει πραγματοποιηθεί ακόμα</p>       
          </div>
        </div>
        :
        <div>
          <div style={{height:'fit-content', display:'flex', flexDirection:'row', marginTop:'-15px'}}>
            <p><b>Κατάσταση Ραντεβού</b>: Ολοκληρωμένο</p>       
          </div>
        </div>
      }

    </div>
  )
}

const Dates = ({selectedDate, setSelectedDate}) => {
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

  const triggerNotif = (type, title, content) => {
    Store.addNotification({
      title: title,
      message: content,
      type: type,
      insert: "top",
      container: "bottom-right",
      animationIn: ["animate__animated", "animate__bounceIn"],
      animationOut: ["animate__animated", "animate__bounceOut"],
      dismiss: {
        duration: 5000,
        onScreen: true
      }
    })
  }

  const days = Array.from({length:31}, (_,i) => i + 1)
  const months = Array.from({length:12}, (_,i) => i + 1)
  const hours = Array.from({length:24}, (_,i) => i + 0)

  return (    
    <div>
      <nav className="navbar">
        <a href="/" className="logo">
          <img src="/logos/gov_gr_logo.svg" alt="GOV logo" />
        </a>
        <ul className="nav-links">
          <li className="nav-item"><a href="/">Αρχική σελίδα</a></li>
          <li className="nav-item" style={{backgroundColor:'rgb(206, 205, 205)', borderRadius:'7px'}}><a href="/profs">Επαγγελματίες</a></li>
          <li className="nav-item"><a href="/parent">Γονείς</a></li>
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


      <ReactNotifications />
      <div className="sidenav">
        <a href="/profs" ><span style={{verticalAlign:'middle'}}><img src='icons/home.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αρχική σελίδα</a>
        <a href="/ad"><span style={{verticalAlign:'middle'}}><img src='icons/volume.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αγγελία</a>
        <a href="/bio"><span style={{verticalAlign:'middle'}}><img src='icons/paper.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Βιογραφικό</a>
        <a href="/colabs_profs"><span style={{verticalAlign:'middle'}}><img src='icons/arrows.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Συνεργασίες</a>
        <a href="/dates_profs" style={{backgroundColor:'rgb(50, 165, 154)'}}><span style={{verticalAlign:'middle'}}><img src='icons/users.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ραντεβού</a>
        <a href="/notifs_profs"><span style={{verticalAlign:'middle'}}><img src='icons/bell.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ειδοποιήσεις</a>
        <a href="/profile_profs"><span style={{verticalAlign:'middle'}}><img src='icons/person.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Προφίλ</a>
        <a href="/ratings"><span style={{ verticalAlign: 'middle' }}><img src='icons/thumbs.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Αξιολογήσεις</a>     
        <a href="/help" style={{borderBottom:'1px solid white'}}><span style={{verticalAlign:'middle'}}><img src='icons/help.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Βοήθεια</a>
      </div>

      <div style={{ paddingLeft: '270px', paddingTop: '90px' }}>
        <div style={{ height: '15px', alignItems: 'left' }}>
          <a href='/'>Aρχική σελίδα</a>
          {'  >  '}
          <a href='/profs'>Επαγγελματίες</a>
          {'  >  Ραντεβού'}
        </div>
        <h1 style={{ marginTop: "35px" }}>&emsp;Ραντεβού</h1>
        <hr style={{ color: 'turquoise', backgroundColor: 'turquoise', border: 'none', height: '4px', width: '90px', float: 'left', marginTop: '-20px', marginLeft: '30px' }} />
      </div>

      {(userData[0] && userId && userData[0].user_category === "professional") ?
      <div style={{display:'flex', marginLeft:'250px'}}>
        <div className='box' style={{width: "70%", height: "auto",marginTop: "50px",marginLeft:"350px", marginBottom:"50px"}}>
          <h3 style={{textAlign:'center'}}>Τα ραντεβού σας</h3>
          { userData[0] && userData[0].dates ?
              userData[0].dates.map((date) => {
                return (<Date date={date} userData={userData} userId={userId} triggerNotif={triggerNotif} submittedDate={submittedDate} setSubmittedDate={setSubmittedDate}/>)
              })
          :
              <div>
                <h2 style={{textAlign:'center', marginTop:'100px'}}>Δεν έχετε κανένα ραντεβού</h2>
              </div>

          }
        </div>
      </div>

        :
        (isProf === 'parent') ?
          <div className='main-content'>
            <div style={{marginLeft:'250px'}}>
              <h1 style={{ marginTop: "35px" }}>&emsp;Συνδεθείτε ως επαγγελματίας</h1>
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
              <h1 style={{ marginTop: "35px" }}>&emsp;Συνδεθείτε ως επαγγελματίας</h1>
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