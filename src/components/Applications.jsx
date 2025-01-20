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

import TimePicker from './TimePicker.jsx'
import TimePickerDummy from './TimePicker_Dummy.jsx'

const Applications = ({selectedDate}) => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState(null)
  const [isProf, setIsProf] = useState('')
  const [clickedProfile, setClickedProfile] = useState(false)

  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [AMKA, setAMKA] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [tk, setTk] = useState('')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')

  const [childName, setChildName] = useState('')
  const [childSurname, setChildSurname] = useState('')
  const [childAge, setChildaAge] = useState('')
  const [childGender, setChildGender] = useState('')
  const [childAMKA, setChildAMKA] = useState('')

  const [ageError, setAgeError] = useState(false)
  const [genderError, setGenderError] = useState(false)
  const [AMKAError, setAMKAError] = useState(false)
  const [phoneError, setPhoneError] = useState(false)
  const [addressError, setAddressError] = useState(false)
  const [tkError, setTkError] = useState(false)
  const [cityError, setCityError] = useState(false)
  const [areaError, setAreaError] = useState(false)

  const [childnameError, setChildnameError] = useState(false)
  const [childsurnameError, setChildsurnameError] = useState(false)
  const [childgenderError, setChildgenderError] = useState(false)
  const [childageError, setChildageError] = useState(false)
  const [childAMKAError, setChildAMKAError] = useState(false)

  const [dilosi, setDilosi] = useState(false)
  const [apodoxi, setApodoxi] = useState(false)

  const [place, setPlace] = useState('')
  const [hours, setHours] = useState({
    "friday-end": 15,
    "friday-start": 8,
    "monday-end": 16,
    "monday-start": 8,
    "saturday-end": -1,
    "saturday-start": -1,
    "sunday-end": -1,
    "sunday-start": -1,
    "thursday-end": 16,
    "thursday-start": 8,
    "tuesday-end": 16,
    "tuesday-start": 8,
    "wednesday-end": 16,
    "wednesday-start": 8
  })

  const [aggrement, setAggrement] = useState('')
  const [startDay, setStartDay] = useState('')
  const [startMonth, setStartMonth] = useState('')
  const [startYear, setStartYear] = useState('')
  const [endDay, setEndDay] = useState('')
  const [endMonth, setEndMonth] = useState('')
  const [endYear, setEndYear] = useState('')

  const [page, setPage] = useState(selectedDate.day ? 1 : 0)

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

  const handleAggrement = (event) => {
    const file = event.target.files[0]
    if (file) {
      setAggrement(file.name)
    } else {
      setAggrement('')
    }
  }

  const forwardPage = () => {
    let failed = false
    if (page === 1) {
      if (!(userData[0].age || age)) {
        triggerNotif("danger", "Υποχρεωτικό πεδίο", "Συμπλρώστε την ηλικία σας")
        setAgeError(true)
        failed = true
      }
      console.log('AMKE', userData[0].AMKA, AMKA)
      if (!(userData[0].AMKA  || AMKA)) {
        console.log(userData[0].AMKA, AMKA)
        triggerNotif("danger", "Υποχρεωτικό πεδίο", "Συμπλρώστε το ΑΜΚΑ σας")
        setAMKAError(true)
        failed = true
      }
      if (!(userData[0].phone || phone)) {
        triggerNotif("danger", "Υποχρεωτικό πεδίο", "Συμπλρώστε το τηλέφωνό σας")
        setPhoneError(true)
        failed = true
      }
      if (!(userData[0].gender || gender)) {
        triggerNotif("danger", "Υποχρεωτικό πεδίο", "Συμπλρώστε το φύλο σας")
        setGenderError(true)
        failed = true
      }
      if (!(userData[0].address || address)) {
        triggerNotif("danger", "Υποχρεωτικό πεδίο", "Συμπλρώστε τον δήμο σας")
        setAddressError(true)
        failed = true
      }
      if (!(userData[0].tk || tk)) {
        triggerNotif("danger", "Υποχρεωτικό πεδίο", "Συμπλρώστε τον ταχυδρομικό σας κώδικα")
        setTkError(true)
        failed = true
      }
      if (!(userData[0].city || city)) {
        triggerNotif("danger", "Υποχρεωτικό πεδίο", "Συμπλρώστε την πόλη σας")
        setCityError(true)
        failed = true
      }
      if (!(userData[0].area || area)) {
        triggerNotif("danger", "Υποχρεωτικό πεδίο", "Συμπλρώστε την περιοχή σας")
        setAreaError(true)
        failed = true
      }
      
      if (!childAMKA) {
        triggerNotif("danger", "Υποχρεωτικό πεδίο", "Συμπλρώστε το ΑΜΚΑ του παιδιού σας")
        setChildAMKAError(true)
        failed = true
      }
      if (!childAge) {
        setChildageError(true)
        triggerNotif("danger", "Υποχρεωτικό πεδίο", "Συμπλρώστε την ηλικία του παιδιού σας")
        failed = true
      }
      if (!childGender) {
        setChildgenderError(true)
        triggerNotif("danger", "Υποχρεωτικό πεδίο", "Συμπλρώστε το φύλο του παιδιού σας")
        failed = true
      }
      if (!childName) {
        setChildnameError(true)
        triggerNotif("danger", "Υποχρεωτικό πεδίο", "Συμπλρώστε το όνομα του παιδιού σας")
        failed = true
      }
      if (!childSurname) {
        setChildsurnameError(true)
        triggerNotif("danger", "Υποχρεωτικό πεδίο", "Συμπλρώστε το επώνυμο του παιδιού σας")
        failed = true
      }
      
      if (failed)
        return

    }
    if (page === 3) {
      if (!aggrement) {
        triggerNotif('danger', 'Σφάλμα', 'Ανεβάστε το συμφωνητικό συνεργασίας')
        failed= true
      }
      if (!startDay || !startMonth || !startYear || !endDay || !endMonth || !endYear) {
        triggerNotif('danger', 'Σφάλμα', 'Ορίστε ημερομηνίες έναρξης και τερματισμού συνεργασίας')
        failed= true
      }
      if (failed) {
        return
      }
    }
    if (page === 2) {
      if (!hours || !place) {
        triggerNotif('danger', 'Σφάλμα', 'Ορίστε την τοποθεσία εργασίας')
        return
      }
    }
    if (page === 4) {
      if (!(dilosi && apodoxi)) {
        triggerNotif('danger', 'Σφάλμα', 'Πρέπει να αποδεχτείτε τους όρους')
        return
      }
    }
    setPage(page+1)
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

  const submitApplication = async () => {
    let res

    const payments = []

    const startDate = new Date(startYear, parseInt(startMonth) - 1)
    const endDate = new Date(endYear, parseInt(endMonth))
    for (let date = startDate; date < endDate; date.setMonth(date.getMonth() + 1)) {
      const monthString = `${date.getMonth() + 1}/${date.getFullYear()}`
      payments.push({
        month: monthString,
        paydate: 0,
        voucher: 'https://example.com',
        payed: false
      })
    }


    let payload = {
        startDay: startDay,
        endDay: endDay,
        startMonth: startMonth,
        endMonth: endMonth,
        startYear: startYear,
        endYear: endYear,
        accepted: false,
        active: true,
        refused: false,
        parent_id: userId,
        prof_id: selectedDate.prof_id,
        parent_name: userData[0].name + ' ' + userData[0].surname,
        prof_name: selectedDate.prof_name,
        payments: payments
    }

    try {
        // get the professional data
        let prof_data
        try {
          const q = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', selectedDate.prof_id)) // Query only data matching the user's UID
          const querySnapshot = await getDocs(q)
          prof_data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          // console.log("user id: ", userId)
          console.log("prof data: ", prof_data)
        } catch (error) {
          console.error('Error fetching professional data:', error)
        }


        // Add the document and get the document reference
        res = await addDoc(collection(FIREBASE_DB, 'colabs'), payload)
        console.log('Successful update', res.id)

        // Add the colab to parent's data
        const parentQuery = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', userData[0].uid))
        const parentSnapshot = await getDocs(parentQuery)
        if (!parentSnapshot.empty) {
            const parentDocRef = doc(FIREBASE_DB, 'user_data', parentSnapshot.docs[0].id)
            let temp = userData[0].colabs
            if (!temp)
              temp = []
            temp.push(res.id)
            await updateDoc(parentDocRef, {
              colabs: temp
            })
        } else {
            console.log("No such document found with the specified uid!")
        }

        // Add the colab to prof's data
        const profQuery = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', selectedDate.prof_id))
        const profSnapshot = await getDocs(profQuery)
        if (!profSnapshot.empty) {
            const profDocRef = doc(FIREBASE_DB, 'user_data', profSnapshot.docs[0].id)
            let temp = prof_data[0].colabs
            if (!temp)
              temp = []
            temp.push(res.id)
            await updateDoc(profDocRef, {
              colabs: temp
            })
        } else {
            console.log("No such document found with the specified uid!")
        }

        // Add a notification to the prof
        const notifQuery = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', selectedDate.prof_id))
        const notifSnapshot = await getDocs(notifQuery)
        if (!notifSnapshot.empty) {
            const notifDocRef = doc(FIREBASE_DB, 'user_data', notifSnapshot.docs[0].id)
            let oldNotifs = prof_data[0].notifications
            if (!oldNotifs)
              oldNotifs = []
            const newNotif = {
                content: "υπέβαλε αίτηση για συνεργασία μαζί σας",
                ref_user: userData[0].name + ' ' + userData[0].surname,
                time: Math.floor(Date.now() / 1000) 
            }
            oldNotifs.push(newNotif)
            await updateDoc(notifDocRef, { notifications: oldNotifs })
        } else {
            console.log("No such document found with the specified uid!")
        }


        const whatiseventhat = {
          name: userData[0].name,
          surname: userData[0].surname,
          age: age || userData[0].age,
          gender: gender || userData[0].gender,
          AMKA: AMKA || userData[0].AMKA,
          AFM: userData[0].AFM,
          email: userData[0].email,
          phone: phone || userData[0].phone,
          address: address || userData[0].address, 
          tk: tk || userData[0].tk,
          city: city || userData[0].city,
          area:area || userData[0].area,
          childName: childName,
          childSurname:childSurname,
          childAge:childAge,
          childGender:childGender,
          childAMKA:childAMKA,
          hours: hours,
          startDay:startDay,
          startMonth:startMonth,
          startYear:startYear,
          endDay:endDay,
          endMonth:endMonth,
          endYear:endYear,
          place: place,
          dilosi: dilosi,
          apodoxi: apodoxi,
          aggrement: aggrement,
          prof_name: selectedDate.prof_name
        }
        // Add the colab to parent's data
        const parentQuery3 = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', userData[0].uid))
        const parentSnapshot3 = await getDocs(parentQuery3)
        if (!parentSnapshot3.empty) {
            const parentDocRef = doc(FIREBASE_DB, 'user_data', parentSnapshot3.docs[0].id)
            let temp = userData[0].applications
            if (!temp)
              temp = []
            temp.push(whatiseventhat)
            await updateDoc(parentDocRef, {
              applications: temp
            })
        } else {
            console.log("No such document found with the specified uid!")
        }



        triggerNotif('success', 'Επιτυχία!', 'Η αίτησή σας υποβλήθηκε επιτυχώς')
        setPage(0)
    } catch (error) {
        console.error("Error in submitApplication: ", error)
    }
}

  const days = Array.from({length:31}, (_,i) => i + 1)
  const months = Array.from({length:12}, (_,i) => i + 1)

  let index = -1

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
            { userData[0].applications && userData[0].applications.map((apple) => {
              index++
              return (
                <div style={{width:'fit-content', marginRight:'auto', marginLeft:'auto', marginTop:'50px', marginBottom:'500px'}}>
                  <h2 style={{ textAlign: 'left', marginLeft:'250px' }}>Ενεργές αιτήσεις</h2>
                  <div className='box1' style={{height:'fit-content', marginBottom:'50px', display:'flex', flexDirection:'row', marginLeft:'250px', width:'1200px'}}>
                    <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto'}}>
                      <div style={{fontSize:'20px', fontWeight:'700', marginBottom:'5px'}}>
                        <div>
                          Συνεργασία με {apple.prof_name}
                        </div>
                      </div>
                    </div>
                    <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto', marginLeft:'10px'}}>
                      <div className='arrow-box' ><div style={{marginLeft:'11px', paddingTop:'11px', fontWeight:700}}>Έχει υποβληθεί</div></div>
                    </div>

                    <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto', marginLeft:'auto'}}>
                      <button className='button-40' style={{ display: 'flex', alignItems: 'center', width:'fit-content', height:'fit-content' }} onClick={() => navigate(`/applications/preview/${index}`)}>
                        <img src='icons/layers.svg' width='20px' style={{ marginRight: '8px' }} />
                        <span>Λεπτομέρειες</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* <div style={{}}>
              <button className='button-40' style={{width:'200px', marginLeft:'auto', marginRight:'auto', display:'block'}} onClick={() => setPage(1)}>
                <img src='icons/pencil.svg' width='24px'/>
                <span>Νέα αίτηση</span>
              </button>
            </div> */}
          </div>
        : 
        <div>
          <div class="stepper-wrapper" style={{marginLeft:'250px'}}>
            <div class={page === 1 ? "stepper-item active" : "stepper-item completed"}>
              <div class="step-counter" onClick={() => {if (page > 1) setPage(1)}} style={{cursor: page > 1  ? 'pointer' : ''}}>1</div>
              <div class="step-name">Βασικά στοιχεία</div>
            </div>
            <div class={page > 2 ? "stepper-item completed" : page < 2 ? "stepper-item" : "stepper-item active"}>
              <div class="step-counter" onClick={() => {if (page > 2) setPage(2)}} style={{cursor: page > 2  ? 'pointer' : ''}}>2</div>
              <div class="step-name">Τόπος - χρόνος</div>
            </div>
            <div class={page > 3 ? "stepper-item completed" : page < 3 ? "stepper-item" : "stepper-item active"}>
              <div class="step-counter" onClick={() => {if (page > 3) setPage(3)}} style={{cursor: page > 3  ? 'pointer' : ''}}>3</div>
              <div class="step-name">Συμφωνητικό</div>
            </div>
            <div class={page > 4 ? "stepper-item completed" : page < 4 ? "stepper-item" : "stepper-item active"}>
              <div class="step-counter" onClick={() => {if (page > 4) setPage(4)}} style={{cursor: page > 4  ? 'pointer' : ''}}>4</div>
              <div class="step-name">Όροι και προϋποθέσεις</div>
            </div>
            <div class={page > 5 ? "stepper-item completed" : page < 5 ? "stepper-item" : "stepper-item active"}>
              <div class="step-counter" onClick={() => {if (page > 5) setPage(5)}} style={{cursor: page > 5  ? 'pointer' : ''}}>5</div>
              <div class="step-name">Προεπισκόπηση - υποβολή</div>
            </div>
          </div>
          <div>
            {(page === 1) ?
              <div className='main-content' style={{marginTop:'-80px'}}>
                <div style={{marginLeft:'250px'}}>
                <div style={{marginLeft:'auto', marginRight:'auto', width:'fit-content', fontSize:'25px', fontWeight:'700', marginBottom:'50px'}}>Στοιχεία γονέα</div>
                <form style={{width:'fit-content', marginLeft:'auto', marginRight:'auto', marginTop:'50px'}}>
                  <div className="input-row">
                    <div className="input_box">
                      <label htmlFor="name-field">Όνομα</label>
                      <input type="text" id="name-field" value={userData[0].name} disabled/>
                    </div>
                    <div className="input_box">
                      <label htmlFor="surname-field">Επώνυμο</label>
                      <input type="text" id="surname-field" value={userData[0].surname} disabled/>
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input_box">
                      <label htmlFor="age-field">Ηλικία</label>
                      <input type="number" id="age-field" disabled={userData[0].age} value={age || userData[0].age} onChange={(e) => {setAge(e.target.value); setAgeError(false)}} style={{borderColor: ageError ? '#ff0000' : ''}}/>
                    </div>
                    <div className="input_box">
                      <label htmlFor="sex-field">Φύλο</label>
                      <select name="cars" id="sex-field" disabled={userData[0].gender} value={gender || userData[0].gender} onChange={(e) => {setGender(e.target.value); setGenderError(false)}} style={{borderColor: genderError ? '#ff0000' : ''}} >
                        <option value="" hidden></option>
                        <option value="male">Άντρας</option>
                        <option value="female">Γυναίκα</option>
                      </select>
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input_box">
                      <label htmlFor="amka-field">ΑΜΚΑ</label>
                      <input type="number" id="amka-field" disabled={userData[0].AMKA} value={AMKA || userData[0].AMKA} onChange={(e) => {setAMKA(e.target.value); setAMKAError(false)}} style={{borderColor: AMKAError ? '#ff0000' : ''}}/>
                    </div>
                    <div className="input_box">
                      <label htmlFor="afm-field">ΑΦΜ</label>
                      <input type="number" id="afm-field" disabled value={userData[0].AFM} />
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input_box">
                      <label htmlFor="email-field">Email</label>
                      <input type="email" id="email-field" disabled value={userData[0].email}/>
                    </div>
                    <div className="input_box">
                      <label htmlFor="phone-field">Τηλέφωνο</label>
                      <input type="phone" id="phone-field"  disabled={userData[0].phone} value={phone || userData[0].phone} onChange={(e) => {setPhone(e.target.value); setPhoneError(false)}} style={{borderColor: phoneError ? '#ff0000' : ''}}/>
                    </div>
                  </div>
                  <div className="input-row">

                    <div className="input_box">
                      <label htmlFor="address-field">Δήμος</label>
                      <select name="cars" id="sex-field"  disabled={userData[0].address} value={address || userData[0].address} onChange={(e) => {setAddress(e.target.value); setAddressError(false)}} style={{borderColor: addressError ? '#ff0000' : ''}}>
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
                      <input type="text" id="taxidromikos-field" disabled={userData[0].tk} value={tk || userData[0].tk} onChange={(e) => {setTk(e.target.value); setTkError(false)}} style={{borderColor: tkError ? '#ff0000' : ''}}/>
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input_box">
                      <label htmlFor="city-field">Πόλη</label>
                      <input type="text" id="city-field"  disabled={userData[0].city} value={city || userData[0].city} onChange={(e) => {setCity(e.target.value); setCityError(false)}} style={{borderColor: cityError ? '#ff0000' : ''}}/>
                    </div>
                    <div className="input_box">
                      <label htmlFor="area-field">Περιοχή</label>
                      <input type="text" id="area-field"  disabled={userData[0].area} value={area || userData[0].area} onChange={(e) => {setArea(e.target.value); setAreaError(false)}} style={{borderColor: areaError ? '#ff0000' : ''}}/>
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
                      <input type="text" id="name-field" value={childName} onChange={(e) => {setChildName(e.target.value); setChildnameError(false)}} style={{borderColor: childnameError ? '#ff0000' : ''}}/>
                    </div>
                    <div className="input_box">
                      <label htmlFor="surname-field">Επώνυμο</label>
                      <input type="text" id="surname-field" value={childSurname} onChange={(e) => {setChildSurname(e.target.value); setChildsurnameError(false)}} style={{borderColor: childsurnameError ? '#ff0000' : ''}}/>
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input_box">
                      <label htmlFor="age-field">Ηλικία</label>
                      <input type="number" id="age-field" value={childAge} onChange={(e) => {setChildaAge(e.target.value); setChildageError(false)}} style={{borderColor: childageError ? '#ff0000' : ''}}/>
                    </div>
                    <div className="input_box">
                      <label htmlFor="sex-field">Φύλο</label>
                      <select name="cars" id="sex-field" value={childGender} onChange={(e) => {setChildGender(e.target.value); setChildgenderError(false)}} style={{borderColor: childgenderError ? '#ff0000' : ''}}>
                        <option value="" disabled hidden></option>
                        <option value="male">Άντρας</option>
                        <option value="female">Γυναίκα</option>
                      </select>
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input_box" style={{marginLeft:'auto', marginRight:'auto', width:'fit-content'}}>
                      <label htmlFor="amka-field">ΑΜΚΑ</label>
                      <input type="number" id="amka-field" value={childAMKA} onChange={(e) => {setChildAMKA(e.target.value); setChildAMKAError(false)}} style={{borderColor: childAMKAError ? '#ff0000' : ''}}/>
                    </div>
                  </div>
                </form>
                </div>
              </div>
            : (page === 2) ?
              <div className='main-content' style={{marginTop:'-80px'}}>
                <div style={{marginLeft:'250px'}}>
                  <h2>Ώρες απασχόλησης</h2>
                  <TimePicker hours={hours} setHours={setHours} />
                  <br />
                  <h2>Τοποθεσία απασχόλησης</h2>
                  <div className='pass-input-container' style={{display:'flex'}}>
                    <img style={{width:'42px'}} src='/icons/location_64.png'/>
                    <input
                      className='form-input'
                      style={{}}
                      placeholder='Διεύθυνση και αριθμός'
                      value={place}
                      onChange={(e) => {
                        setPlace(e.target.value)
                      }}
                    />
                  </div>
                </div>
              </div>
            : (page === 3) ?
              <div className='main-content' style={{marginTop:'-80px'}}>
                <div style={{marginLeft:'250px'}}>
                  <h1 style={{ textAlign: 'center', marginTop:'20px'  }}>Συμφωνητικό συνεργασίας</h1>
                  <p style={{ textAlign: 'center', marginTop:'-15px' }}>Ανεβάστε το συμφωνητικό για αποδοχή από τον επαγγελματία</p>
                  <label for="images" class="drop-container" id="dropcontainer">
                    <span class="drop-title">Σύρτε αρχεία εδώ</span>
                    ή
                    <input type="file" onChange={handleAggrement} />
                    <span class="file-message" id="fileMessage" style={{position:'absolute', marginTop:'65px', marginLeft:'30px'}}>{aggrement}</span>
                  </label>
                </div>
                <br />
                <div style={{marginLeft:'250px'}}>
                  <h2 style={{ textAlign: 'center'}}>Ισχύς συνεργασίας</h2>
                  <div style={{display:'flex'}}>
                    <div>
                      <h4>Από</h4>
                      <select onChange={(e) => setStartDay(e.target.value)} value={startDay}>
                        <option value="" disabled selected>Ημέρα</option> {/* days do not adjust with months */}
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select> / 
                      <select style={{marginLeft:'5px'}} onChange={(e) => setStartMonth(e.target.value)} value={startMonth}>
                        <option value="" disabled selected>Μήνας</option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select> /
                      <select style={{marginLeft:'5px'}} onChange={(e) => setStartYear(e.target.value)} value={startYear}>
                        <option value="" disabled selected>Έτος</option>
                        <option>2025</option>
                        <option>2026</option>
                      </select>
                    </div>
                    <div style={{marginLeft:'15px'}}>
                      <h4>Μέχρι</h4>
                      <select onChange={(e) => setEndDay(e.target.value)} value={endDay}>
                        <option value="" disabled selected>Ημέρα</option> {/* days do not adjust with months */}
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select> / 
                      <select style={{marginLeft:'5px'}} onChange={(e) => setEndMonth(e.target.value)} value={endMonth}>
                        <option value="" disabled selected>Μήνας</option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select> /
                      <select style={{marginLeft:'5px'}} onChange={(e) => setEndYear(e.target.value)} value={endYear}>
                        <option value="" disabled selected>Έτος</option>
                        <option>2025</option>
                        <option>2026</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            : (page === 4) ?
              <div className='main-content' style={{marginTop:'-80px'}}>
                <div style={{marginLeft:'250px'}}>
                <div style={{marginLeft:'auto', marginRight:'auto', width:'fit-content', fontSize:'25px', fontWeight:'700', marginBottom:'50px', marginTop:'00px'}}>Όροι και προϋποθέσεις</div>
                  <div>
                    <div style={{marginBottom:'50px'}} onClick={() => setDilosi(!dilosi)} className="clickable">
                      <input type="checkbox" checked={dilosi}/> <span>Δηλώνω υπεύθυνα ότι επιβεβαιώνω την εκυρότητα των υποβληθέντων στοιχείων</span>
                    </div>
                    <div onClick={() => setApodoxi(!apodoxi)} className="clickable">
                      <input type="checkbox" size="100" checked={apodoxi} /> <span>Αποδοχή <a href="/help/conditions" target='blank'>όρων και προϋποθέσεων</a></span>
                    </div>
                  </div>
                </div>
              </div>
            : (page === 5 ) ?
              <div className='main-content' style={{marginTop:'-80px'}}>
                <div style={{marginLeft:'250px'}}>
                <div style={{marginLeft:'auto', marginRight:'auto', width:'fit-content', fontSize:'25px', fontWeight:'700', marginBottom:'50px'}}>Στοιχεία γονέα</div>
                <form style={{width:'fit-content', marginLeft:'auto', marginRight:'auto', marginTop:'50px'}}>
                  <div className="input-row">
                    <div className="input_box">
                      <label htmlFor="name-field">Όνομα</label>
                      <input type="text" id="name-field" value={userData[0].name} disabled/>
                    </div>
                    <div className="input_box">
                      <label htmlFor="surname-field">Επώνυμο</label>
                      <input type="text" id="surname-field" value={userData[0].surname} disabled/>
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input_box">
                      <label htmlFor="age-field">Ηλικία</label>
                      <input type="number" id="age-field" disabled value={age || userData[0].age}/>
                    </div>
                    <div className="input_box">
                      <label htmlFor="sex-field">Φύλο</label>
                      <select name="cars" id="sex-field" disabled value={gender || userData[0].gender} >
                        <option value="" hidden></option>
                        <option value="male">Άντρας</option>
                        <option value="female">Γυναίκα</option>
                      </select>
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input_box">
                      <label htmlFor="amka-field">ΑΜΚΑ</label>
                      <input type="number" id="amka-field" disabled value={AMKA || userData[0].AMKA}/>
                    </div>
                    <div className="input_box">
                      <label htmlFor="afm-field">ΑΦΜ</label>
                      <input type="number" id="afm-field" disabled value={userData[0].AFM} />
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input_box">
                      <label htmlFor="email-field">Email</label>
                      <input type="email" id="email-field" disabled value={userData[0].email}/>
                    </div>
                    <div className="input_box">
                      <label htmlFor="phone-field">Τηλέφωνο</label>
                      <input type="phone" id="phone-field"  disabled value={phone || userData[0].phone} />
                    </div>
                  </div>
                  <div className="input-row">

                    <div className="input_box">
                      <label htmlFor="address-field">Δήμος</label>
                      <select name="cars" id="sex-field"  disabled value={address || userData[0].address} >
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
                      <input type="text" id="taxidromikos-field" disabled value={tk || userData[0].tk}/>
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input_box">
                      <label htmlFor="city-field">Πόλη</label>
                      <input type="text" id="city-field"  disabled value={city || userData[0].city} />
                    </div>
                    <div className="input_box">
                      <label htmlFor="area-field">Περιοχή</label>
                      <input type="text" id="area-field"  disabled value={area || userData[0].area} />
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
                      <input type="text" id="name-field" value={childName} disabled/>
                    </div>
                    <div className="input_box">
                      <label htmlFor="surname-field">Επώνυμο</label>
                      <input type="text" id="surname-field" value={childSurname} disabled/>
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input_box">
                      <label htmlFor="age-field">Ηλικία</label>
                      <input type="number" id="age-field" value={childAge} disabled/>
                    </div>
                    <div className="input_box">
                      <label htmlFor="sex-field">Φύλο</label>
                      <select name="cars" id="sex-field" value={childGender} disabled>
                        <option value="" disabled hidden></option>
                        <option value="male">Άντρας</option>
                        <option value="female">Γυναίκα</option>
                      </select>
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input_box" style={{marginLeft:'auto', marginRight:'auto', width:'fit-content'}}>
                      <label htmlFor="amka-field">ΑΜΚΑ</label>
                      <input type="number" id="amka-field" value={childAMKA} disabled/>
                    </div>
                  </div>
                </form>
                </div>
                <hr style={{marginRight:'-250px', marginTop:'50px'}}/>

                <div style={{marginLeft:'250px'}}>
                  <h2 style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>Ώρες απασχόλησης</h2>
                  <TimePickerDummy availability={hours} />
                  <br />
                  <h2 style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>Τοποθεσία απασχόλησης</h2>
                  <div className='pass-input-container' style={{display:'flex'}}>
                    <img style={{width:'42px'}} src='/icons/location_64.png'/>
                    <input
                      disabled
                      className='form-input'
                      style={{}}
                      placeholder='Διεύθυνση και αριθμός'
                      value={place}
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
                      {aggrement}
                  </div>
                </div>
                <br />
                <div style={{marginLeft:'250px'}}>
                  <h2 style={{ textAlign: 'center'}}>Ισχύς συνεργασίας</h2>
                  <div style={{display:'flex'}}>
                    <div>
                      <h4>Από</h4>
                      <select disabled onChange={(e) => setStartDay(e.target.value)} value={startDay}>
                        <option value="" disabled selected>Ημέρα</option> {/* days do not adjust with months */}
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select> / 
                      <select disabled style={{marginLeft:'5px'}} onChange={(e) => setStartMonth(e.target.value)} value={startMonth}>
                        <option value="" disabled selected>Μήνας</option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select> /
                      <select disabled style={{marginLeft:'5px'}} onChange={(e) => setStartYear(e.target.value)} value={startYear}>
                        <option value="" disabled selected>Έτος</option>
                        <option>2025</option>
                        <option>2026</option>
                      </select>
                    </div>
                    <div style={{marginLeft:'15px'}}>
                      <h4>Μέχρι</h4>
                      <select disabled onChange={(e) => setEndDay(e.target.value)} value={endDay}>
                        <option value="" disabled selected>Ημέρα</option> {/* days do not adjust with months */}
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select> / 
                      <select disabled style={{marginLeft:'5px'}} onChange={(e) => setEndMonth(e.target.value)} value={endMonth}>
                        <option value="" disabled selected>Μήνας</option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select> /
                      <select disabled style={{marginLeft:'5px'}} onChange={(e) => setEndYear(e.target.value)} value={endYear}>
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
                      <input type="checkbox" disabled checked={dilosi}/> <span>Δηλώνω υπεύθυνα ότι επιβεβαιώνω την εκυρότητα των υποβληθέντων στοιχείων</span>
                    </div>
                    <div>
                      <input type="checkbox" disabled size="100" checked={apodoxi} /> <span>Αποδοχή <a href="/help/conditions" target='blank'>όρων και προϋποθέσεων</a></span>
                    </div>
                  </div>
                </div>     
              </div>
            : <></>
            }
          </div>
          <div style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'-150px', marginBottom:'150px',gap:'40px', marginLeft:'250px'}}>
              <div style={{ width: 'fit-content'}}>
                <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => {setPage(page-1)}}>
                  <img src='/icons/left_arrow.svg' width='28px' style={{ marginRight: '8px' }} />
                  <span>Προηγούμενο</span>
                </button>
              </div>
              <div style={{ width: 'fit-content'}}>
                { page !== 5 ?
                  <button disabled={page>4} className='button-40' style={{ display: 'flex', alignItems: 'center', backgroundColor:'#ffffff', color:'#000000', border: '2px solid #111827' }} onClick={forwardPage}>
                    <span style={{marginLeft:'21px'}}>Επόμενο</span>
                    <img src='/icons/right_arrow.svg' width='28px' style={{ marginLeft: '8px', marginRight:'21px' }} />
                  </button>
                  :
                  <button className='button-40' style={{ display: 'flex', alignItems: 'center', backgroundColor:'#ffffff', color:'#000000', border: '2px solid #111827' }} onClick={submitApplication}>
                    <span style={{marginLeft:'21px'}}>Υποβολή αίτησης</span>
                    <img src='/icons/airplane.svg' width='28px' style={{ marginLeft: '8px', marginRight:'21px' }} />
                  </button>
                }
              </div>
              <div style={{ width: 'fit-content'}}>
                <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => {setPage(page-1)}}>
                  <img src='/icons/save.svg' width='28px' style={{ marginRight: '8px' }} />
                  <span>Αποθήκευση αίτησης</span>
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
      <Footer />
    </div>
  )
}

export default Applications