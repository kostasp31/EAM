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
  const rejectColab = async () => {
    try {
      // Create a query against the collection
      const q = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', userData[0].uid))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const docRef = doc(FIREBASE_DB, 'user_data', querySnapshot.docs[0].id)
        console.log('udata:', userData[0])

        let temp = userData[0].dates
        for (let i=0; i<temp.length; i++) {
          if (temp[i].prof_id === date.prof_id) {
            temp[i].state = 'completed'
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
      const q = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', date.prof_id))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const prof_data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        const docRef = doc(FIREBASE_DB, 'user_data', querySnapshot.docs[0].id)

        let oldDates = prof_data[0].dates
        let newDates = oldDates
        if (!oldDates)
          newDates = []

        let temp = prof_data[0].dates
        for (let i=0; i<temp.length; i++) {
          if (temp[i].parent_id === userData[0].uid) {
            temp[i].state = 'completed'
          }
        }


        // Update the document with the new value
        await updateDoc(docRef, {
          dates: temp
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
      <h3 style={{marginTop:'0px'}}>Ραντεβού με {date.prof_name}</h3>
      <p><b>Ημερομηνία:</b> {date.day}/{date.month}/{date.year}, {date.hour}:{date.minute}</p>
      <p><b>Τρόπος συνάντησης:</b> {date.synantisi === 'personal' ? 'Φυσική παρουσία' : 'Βιντεοδιάσκεψη'}</p>
      <p><b>Τόπος/Σύνδεσμος συνάντησης:</b> {date.place}</p>

      {date.state === 'request' ?
        <div>
          <p style={{marginBottom:0}}><b>Κατάσταση Ραντεβού</b>: Εκκρεμεί αποδοχή από τον/την επαγγελματία</p>
        </div>
      : date.state === 'pending' ? 
        <div>
          <p style={{marginBottom:0}}><b>Κατάσταση Ραντεβού</b>: Το ραντεβού δεν έχει πραγματοποιηθεί ακόμα</p>
          <div style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'20px', gap:'40px' }}>
              <div style={{ width: 'fit-content'}}>
                <button className='button-40' style={{ display: 'flex', alignItems: 'center', padding:'7px 10px' }}>
                  <img src='/icons/paper.svg' width='28px' style={{ marginRight: '8px' }} />
                  <span>Αίτηση συνεργασίας</span>
                </button>
              </div>
              <div style={{ width: 'fit-content'}}>
                <button className='persona2-button' style={{ display: 'flex', alignItems: 'center', width:'auto', padding:'7px 10px' }} onClick={rejectColab}>
                  <img src='/icons/cancel.svg' width='28px' style={{ marginRight: '8px' }} />
                  <span>Απόρριψη συνεργασίας</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      :
        <div>
          <p style={{marginBottom:0}}><b>Κατάσταση Ραντεβού</b>: Ολοκληρωμένο</p>
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

  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [hour, setHour] = useState('')
  const [minute, setMinute] = useState('')
  const [synantisi, setSynantisi] = useState('personal')
  const [place, setPlace] = useState('')
  const [link, setLink] = useState('')

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
    });
  }

  const submitDate = async() => {
    if (!(selectedDate && selectedDate.name)) {
      triggerNotif("warning", "Δεν μπορείτε να δηνμιουργήσετε ραντεβού", "Βρείτε πρώτα έναν επαγγελματία μέσω της αναζήτησης")
      return
    }

    

    let failed = false
    if (synantisi === 'personal' && !place) {
      triggerNotif("danger", "Το ραντεβού δεν υποβλήθηκε", "Προσδιορίστε τον τόπο συνάντησης για την καταχώρηση του ραντεβού")
      failed = true
    }
    if (synantisi === 'zoom' && !link) {
      triggerNotif("danger", "Το ραντεβού δεν υποβλήθηκε", "Προσδιορίστε τον σύνδεσμο της βιντεοδιάσκεψης για την καταχώρηση του ραντεβού")
      failed = true
    }
    if (!day) {
      triggerNotif("danger", "Το ραντεβού δεν υποβλήθηκε", "Ορίστε μια έγκυρη ημέρα για την καταχώρηση του ραντεβού")
      failed = true
    }
    if (!month) {
      triggerNotif("danger", "Το ραντεβού δεν υποβλήθηκε", "Ορίστε έναν έγκυρο μήνα για την καταχώρηση του ραντεβού")
      failed = true
    }
    if (!year) {
      triggerNotif("danger", "Το ραντεβού δεν υποβλήθηκε", "Ορίστε ένα έγκυρο έτος για την καταχώρηση του ραντεβού")
      failed = true
    }
    if (!hour) {
      triggerNotif("danger", "Το ραντεβού δεν υποβλήθηκε", "Ορίστε μια έγκυρη ώρα για την καταχώρηση του ραντεβού")
      failed = true
    }
    if (!minute) {
      triggerNotif("danger", "Το ραντεβού δεν υποβλήθηκε", "Ορίστε μια έγκυρη ώρα για την καταχώρηση του ραντεβού")
      failed = true
    }

    if (failed)
      return

    // make the date in the parents data
    try {
      // Create a query against the collection
      const q = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', userId))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const docRef = doc(FIREBASE_DB, 'user_data', querySnapshot.docs[0].id)

        let oldDates = userData[0].dates
        let newDates = oldDates
        if (!oldDates)
          newDates = []

        console.log("new:", newDates)

        const newDate = {
          prof_name: selectedDate.name + ' ' + selectedDate.surname, 
          prof_id: selectedDate.uid, 
          day: day,
          month: month,
          year: year,
          hour: hour,
          minute: minute,
          synantisi: synantisi,
          place: synantisi === 'personal' ? place : link,
          state: 'request'
        }

        newDates.push(newDate)

        // Update the document with the new value
        await updateDoc(docRef, {
          dates: newDates
        })

      } else {
        console.log("No such document found with the specified uid!")
      }
    } catch (error) {
      console.error("Error updating document: ", error)
    }  

    // the date in the profs data
    try {
      // Create a query against the collection
      const q = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', selectedDate.uid))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const docRef = doc(FIREBASE_DB, 'user_data', querySnapshot.docs[0].id)

        let oldDates = selectedDate.dates
        let newDates = oldDates
        if (!oldDates)
          newDates = []

        let oldNotifs = selectedDate.notifications
        let newNotifs = oldNotifs
        if (!oldNotifs)
          newNotifs = []

        console.log("new:", newNotifs)
        

        const newNotif = {
          content: "θέλει να κλείσει ραντεβού μαζί σας για συνεργασία",
          ref_user: userData[0].name + ' ' + userData[0].surname,
          time: 1646108200 
        }

        const newDate = {
          parent_name: userData[0].name + ' ' + userData[0].surname, 
          parent_id: userData[0].uid, 
          day: day,
          month: month,
          year: year,
          hour: hour,
          minute: minute,
          synantisi: synantisi,
          place: synantisi === 'personal' ? place : link,
          state: 'request'
        }

        newNotifs.push(newNotif)
        newDates.push(newDate)

        // Update the document with the new value
        await updateDoc(docRef, {
          dates: newDates,
          notifications: newNotifs
        })

        console.log("Document updated successfully")
        triggerNotif("success", "Επιτυχία", "Το ραντεβού υποβλήθηκε")
        setSubmittedDate(!submittedDate)
      } else {
        console.log("No such document found with the specified uid!")
      }
    } catch (error) {
      console.error("Error updating document: ", error)
    }  

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
          {/* <li class="nav-item"><a href="/announcements">Ανακοινώσεις</a></li> */}
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

      <ReactNotifications />
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

      <div style={{ paddingLeft: '270px', paddingTop: '90px' }}>
        <div style={{ height: '15px', alignItems: 'left' }}>
          <a href='/'>Aρχική σελίδα</a>
          {'  >  '}
          <a href='/parent'>Γονείς</a>
          {'  >  Ραντεβού'}
        </div>
        <h1 style={{ marginTop: "35px" }}>&emsp;Ραντεβού</h1>
        <hr style={{ color: 'turquoise', backgroundColor: 'turquoise', border: 'none', height: '4px', width: '90px', float: 'left', marginTop: '-20px', marginLeft: '30px' }} />
      </div>

      {(userData[0] && userId && userData[0].user_category === "parent") ?
      <div style={{display:'flex', marginLeft:'250px'}}>
        <div className='box' style={{width: "40%", height: "auto",marginTop: "50px",marginLeft:"350px", marginBottom:"50px"}}>
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
        <div className='box' style={{width: "20%", height: "auto",marginTop: "50px",marginBottom:"50px", marginLeft:'30px'}}>
          <h3 style={{textAlign:'center'}}>Νέο ραντεβού</h3>
          <b>Με</b>
          <hr style={{width:'40px',marginTop:'2px',marginLeft:'0px',border:'1px solid  #38bca4'}}/>
          { selectedDate && selectedDate.name ? <p>{selectedDate.name} {selectedDate.surname}</p> : <p>Δεν έχει επιλεχθεί επαγγελματίας για ραντεβού</p>}
          <form>
            <span>
              <b>Ημερομηνία</b>
              <hr style={{width:'40px',marginTop:'2px',marginLeft:'0px',border:'1px solid  #38bca4'}}/>
            </span>
            <div>
              <select onChange={(e) => setDay(e.target.value)} value={day}>
                <option value="" disabled selected>Ημέρα</option> {/* days do not adjust with months */}
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select> / 
              <select style={{marginLeft:'5px'}} onChange={(e) => setMonth(e.target.value)} value={month}>
                <option value="" disabled selected>Μήνας</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select> /
              <select style={{marginLeft:'5px'}} onChange={(e) => setYear(e.target.value)} value={year}>
                <option value="" disabled selected>Έτος</option>
                <option>2025</option>
                <option>2026</option>
              </select>
            </div>
            <span>
              <b>Ώρα</b>
              <hr style={{width:'40px',marginTop:'2px',marginLeft:'0px',border:'1px solid  #38bca4'}}/>
            </span>
            <div>
              <select onChange={(e) => setHour(e.target.value)} value={hour}>
                <option value="" disabled selected>Ώρα</option>
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
              </select> : 
              <select style={{marginLeft:'5px'}} onChange={(e) => setMinute(e.target.value)} value={minute}>
                <option value="" disabled selected>Λεπτά</option>
                <option>00</option>
                <option>15</option>
                <option>30</option>
                <option>45</option>
              </select>
            </div>
            <span>
              <b>Τρόπος συνάντησης</b>
              <hr style={{width:'40px',marginTop:'2px',marginLeft:'0px',border:'1px solid  #38bca4'}}/>
            </span>
            <div>
              <span className='clickable' onClick={() => setSynantisi('personal')}>
                <label className='clickable'>Φυσική Παρουσία</label>
                <input style={{marginLeft:'17px'}} type='radio' name='place' value="personal" checked={synantisi === 'personal'}></input>
              </span>
              <br />
              <span className='clickable' onClick={() => setSynantisi('zoom')}>
                <label className='clickable'>Μέσω Zoom</label>
                <input style={{marginLeft:'56px'}} type='radio' name='place' value="zoom" checked={synantisi !== 'personal'} onClick={() => setSynantisi('zoom')}></input>
              </span>
            </div>
            <span>
              <b>Τόπος συνάντησης</b>
              <hr style={{width:'40px',marginTop:'2px',marginLeft:'0px',border:'1px solid  #38bca4'}}/>
            </span>
            <input style={{margin:'0px 160px 0px 0px', padding:'10px'}} value={place} onChange={(e) => setPlace(e.target.value)} disabled={synantisi === 'zoom'}></input>
            <span>
              <b>Σύνδεσμος Zoom</b>
              <hr style={{width:'40px',marginTop:'2px',marginLeft:'0px',border:'1px solid  #38bca4'}} />
            </span>
            <input style={{margin:'0px 160px 0px 0px', padding:'10px' }} value={link} onChange={(e) => setLink(e.target.value)} disabled={synantisi === 'personal'}></input>
            <a className='button-40' onClick={submitDate} >Καταχώρηση</a>
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