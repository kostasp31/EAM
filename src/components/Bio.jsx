import React from 'react'
import Footer from "./Footer.jsx"
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_APP } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs, doc, updateDoc  } from 'firebase/firestore'

import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'

import ScrollButton from './ScrollButton.jsx'

import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import 'animate.css/animate.min.css'

const Prof = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState(null)
  const [isProf, setIsProf] = useState('')
  const [clickedProfile, setClickedProfile] = useState(false)
  const [tab1, setTab1] = useState(true)

  const [education, setEducation] = useState([])
  const [newEdu, setNewEdu] = useState('')

  const [chars, setChars] = useState([])
  const [newChar, setNewChar] = useState('')

  const [experience, setExperience] = useState([])
  const [newExp, setNewExp] = useState('')

  const [descr, setDescr] = useState('')
  
  const [editing, setEditing] = useState(false)
  
  const [pathologos, setPathologos] = useState('Δεν επιλέχθηκε αρχείο')
  const [dermatologos, setDermatologos] = useState('Δεν επιλέχθηκε αρχείο')
  const [psyxiki, setPsyxiki] = useState('Δεν επιλέχθηκε αρχείο')
  const [firstAids, setFirstAids] = useState('Δεν επιλέχθηκε αρχείο')
  const [poiniko, setPoiniko] = useState('Δεν επιλέχθηκε αρχείο')
  const [systatikes, setSystatikes] = useState([])

  const [newSystatiki, setNewSyststiki] = useState('Δεν επιλέχθηκε αρχείο')

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
  }, [userId, editing])

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
        if (users[0].education)
          setEducation(users[0].education)
        if (users[0].chars)
          setChars(users[0].chars)
        if (users[0].experience)
          setExperience(users[0].experience)
        if (users[0].description)
          setDescr(users[0].description)
        if (users[0].bio_files) {
          if (users[0].bio_files.pathologos)
            setPathologos(users[0].bio_files.pathologos)
          if (users[0].bio_files.dermatologos)
            setDermatologos(users[0].bio_files.dermatologos)
          if (users[0].bio_files.psyxiki)
            setPsyxiki(users[0].bio_files.psyxiki)
          if (users[0].bio_files.firstAids)
            setFirstAids(users[0].bio_files.firstAids)
          if (users[0].bio_files.poiniko)
            setPoiniko(users[0].bio_files.poiniko)
          if (users[0].bio_files.systatikes)
            setSystatikes(users[0].bio_files.systatikes)
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

  const CircleWithInitialsProfile = ({ name, surname }) => {
    let initials = name[0]+surname[0]
    return (
      <div className="circle-profile-bio"  style={{marginLeft:'auto', marginRight:'auto'}}>
        {initials}  
    </div>
    )
  }

  const addEducation = (e) => {
    e.preventDefault()
    if (!newEdu)
      return

    const newEducation = education.slice()
    newEducation.push(newEdu)
    setNewEdu('')

    setEducation(newEducation)
  }

  const addChar = (e) => {
    e.preventDefault()
    if (!newChar)
      return

    const newwChar = chars.slice()
    newwChar.push(newChar)
    setNewChar('')

    setChars(newwChar)
  }

  const addExp = (e) => {
    e.preventDefault()
    if (!newExp)
      return

    const newwExp = experience.slice()
    newwExp.push(newExp)
    setNewExp('')

    setExperience(newwExp)
  }
  
  
  const submitChanges = async () => {
    try {
      // Create a query against the collection
      const q = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', userId))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const docRef = doc(FIREBASE_DB, 'user_data', querySnapshot.docs[0].id)

        // Update the document with the new value
        await updateDoc(docRef, {
          education: education,
          chars: chars,
          experience: experience,
          description: descr,
          bio_files: {
            pathologos: pathologos,
            dermatologos: dermatologos,
            psyxiki: psyxiki,
            firstAids: firstAids,
            poiniko: poiniko,
            systatikes: systatikes
          }
        })
        // console.log("Document updated successfully")
        triggerNotif("success", "Επιτυχία!", "Οι αλλαγές σας υποβλήθηκαν επιτυχώς")
        setEditing(false)
      } else {
        console.log("No such document found with the specified uid!")
      }
    } catch (error) {
      console.error("Error updating document: ", error)
    }
  }

  const removeListItem = (category, element) => {
    // console.log(category, element)
    if (category === 'education') {
      let newEducation
      newEducation = education.slice().filter((word) => word !== element)
      setEducation(newEducation)
      // console.log(education)
    }
    if (category === 'chars') {
      let newwChars
      newwChars = chars.slice().filter((word) => word !== element)
      setChars(newwChars)
    }
    if (category === 'exp') {
      let newwExp
      newwExp = experience.slice().filter((word) => word !== element)
      setExperience(newwExp)
    }
  }

  const handlePathologosUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setPathologos(file.name)
    } else {
      setPathologos('')
    }
  }

  const handleDermatologosUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setDermatologos(file.name)
    } else {
      setDermatologos('')
    }
  }

  const handlePsyxikiUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setPsyxiki(file.name)
    } else {
      setPsyxiki('')
    }
  }

  const handleFirsiAidsUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFirstAids(file.name)
    } else {
      setFirstAids('')
    }
  }

  const handlePoinikoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setPoiniko(file.name)
    } else {
      setPoiniko('')
    }
  }

  const handleSystatikiUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      let newwSystatiki
      newwSystatiki = systatikes.slice()
      newwSystatiki.push(file.name)
      setSystatikes(newwSystatiki)


      setNewSyststiki(file.name)
    } else {
      setNewSyststiki('')
    }
  }

  const style1 = {borderBottom:'1px solid #000000', padding:'0px 10px 5px 10px', cursor:'pointer'}
  const style2 = {borderBottom:'1px solid #c4c4c4', padding:'0px 10px 5px 10px', cursor:'pointer'}

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

  return (
    <div>
      <ReactNotifications />
      <nav className="navbar">
        <a href="/" className="logo">
          <img src="/logos/gov_gr_logo.svg" alt="GOV logo" />
        </a>
        <ul className="nav-links">
          <li className="nav-item"><a href="/">Αρχική σελίδα</a></li>
          <li className="nav-item" style={{ backgroundColor: 'rgb(206, 205, 205)', borderRadius: '7px' }}><a href="/profs">Επαγγελματίες</a></li>
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

    
      <div className="sidenav">
        <a href="/profs"><span style={{ verticalAlign: 'middle' }}><img src='icons/home.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Αρχική σελίδα</a>
        <a href="/ad"><span style={{ verticalAlign: 'middle' }}><img src='icons/volume.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Αγγελία</a>
        <a href="/bio" style={{ backgroundColor: 'rgb(50, 165, 154)' }}><span style={{ verticalAlign: 'middle' }}><img src='icons/paper.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Βιογραφικό</a>
        <a href="/colabs_profs"><span style={{ verticalAlign: 'middle' }}><img src='icons/arrows.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Συνεργασίες</a>
        <a href="/dates_profs"><span style={{ verticalAlign: 'middle' }}><img src='icons/users.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Ραντεβού</a>
        <a href="/notifs_profs"><span style={{ verticalAlign: 'middle' }}><img src='icons/bell.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Ειδοποιήσεις</a>
        <a href="/profile_profs"><span style={{ verticalAlign: 'middle' }}><img src='icons/person.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Προφίλ</a>
        <a href="/ratings"><span style={{ verticalAlign: 'middle' }}><img src='icons/thumbs.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Αξιολογήσεις</a>
        <a href="/help" style={{ borderBottom: '1px solid white' }}><span style={{ verticalAlign: 'middle' }}><img src='icons/help.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Βοήθεια</a>
      </div>

      <div style={{ paddingLeft: '270px', paddingTop: '90px' }}>
        <div style={{ height: '15px', alignItems: 'left' }}>
          <a href='/'>Aρχική σελίδα</a>
          {'  >  '}
          <a href='/profs'>Επαγγελματίες</a>
          {'  >  Βιογραφικό'}
        </div>
        <h1 style={{ marginTop: "35px" }}>&emsp;Βιογραφικό</h1>
        <hr style={{color:'turquoise', backgroundColor:'turquoise', border:'none', height:'4px', width:'90px', float:'left', marginTop:'-20px', marginLeft:'30px'}} />
      </div>


      {(userData[0] && userId && userData[0].user_category === "professional") ?
        <div className='main-content' style={{ maxWidth: 'fit-content', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '250px', paddingTop: '0px' }}>
          <div>
          <CircleWithInitialsProfile name={userData[0].name} surname={userData[0].surname} />
          <div style={{fontSize:"50px", fontWeight:'500', width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>{userData[0].name}  {userData[0].surname}</div>
          <div style={{display:'flex', flexDirection:'column', gap:'40px', marginLeft:'-500px', marginTop:'100px'}}>
            <div style={{}}>
              <span style={tab1 ? style1 : style2} onClick={() => setTab1(true)}>
                Πληροφορίες
              </span>
              <span style={tab1 ? style2 : style1} onClick={() => setTab1(false)}>
                Πιστοποιητικά
              </span>
            </div>
          </div>
        </div>

          { tab1 ? 
            editing ?
            <div style={{marginLeft:'-500px'}}>
              {/* <ScrollButton /> */}
              <br />
              <br />
              <h2 style={{ textAlign: 'left' }}>Δύο λόγια για τον εαυτό σας</h2>
              <p style={{ textAlign: 'left', marginTop:'-15px' }}>Σχετικά με εσάς</p>

                <div style={{marginTop:'20px', width:'100%', height:'100%'}}>
                  <textarea 
                    placeholder='Σύντομη περιγραφή σας'
                    cols="40"
                    rows="50"
                    className='form-input'
                    style={{width:'100%', height:'350px', fontSize:'20px', whiteSpace:'pre-wrap'}} 
                    value={descr}
                    onChange={(e) => {
                      setDescr(e.target.value)
                    }}
                  />
                </div>

                <h2 style={{ textAlign: 'left' }}>Εκπαίδευση</h2>
                <p style={{ textAlign: 'left', marginTop:'-15px' }}>Τίτλοι σπουδών, πιστοποιήσεις</p>
                <div>
                  {
                    education.map(el => {
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', fontSize:'1rem', padding:'.4rem 0.8rem' }}>
                          <img src='icons/cancel_red.svg' width='20px' style={{ marginRight: '15px', cursor:'pointer' }} onClick={() => removeListItem('education' ,el)} />
                          <span>{el}</span>
                          {/* <img src='icons/check.svg' width='20px' style={{ marginRight: '15px' }} />
                          <span>{el}</span>
                          <img src='icons/cancel_red.svg' width='20px' style={{cursor:'pointer', marginLeft:'auto', marginRight:'400px'}} onClick={() => removeListItem('education' ,el)}/> */}
                        </div>
                      )
                    })
                  }
                </div>
                <form onSubmit={addEducation}>
                  <input 
                    className='form-input'
                    style={{width:'fit-content', marginTop:'20px '}}
                    value={newEdu}
                    onChange={(e) => {
                      setNewEdu(e.target.value)
                    }}
                  />
                </form>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'left', alignItems:'center', marginTop:'10px', gap:'40px', marginBottom:'50px'}}>
                  <div style={{ width: 'fit-content'}}>
                    <button className='button-40' style={{ display: 'flex', alignItems: 'center', fontSize:'1rem', padding:'.4rem 0.8rem' }} onClick={addEducation} >
                      <img src='icons/add.svg' width='24px' style={{ marginRight: '8px' }} />
                      <span>Προσθήκη</span>
                    </button>
                  </div>
                </div>

                <h2 style={{ textAlign: 'left' }}>Χαρακτηριστικά</h2>
                <p style={{ textAlign: 'left', marginTop:'-15px' }}>Ιδιότητες και δεξιότητές σας</p>
                <div>
                  {
                    chars.map(el => {
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', fontSize:'1rem', padding:'.4rem 0.8rem' }}>
                          <img src='icons/cancel_red.svg' width='20px' style={{ marginRight: '15px', cursor:'pointer' }} onClick={() => removeListItem('chars' ,el)} />
                          <span>{el}</span>
                          {/* <img src='icons/cancel_red.svg' width='20px' style={{cursor:'pointer', marginLeft:'auto', marginRight:'400px'}} onClick={() => removeListItem('chars', el)}/> */}
                        </div>
                      )
                    })
                  }
                </div>

                <form onSubmit={addChar}>
                  <input 
                    className='form-input'
                    style={{width:'fit-content', marginTop:'20px '}}
                    value={newChar}
                    onChange={(e) => {
                      setNewChar(e.target.value)
                    }}
                  />
                </form>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'left', alignItems:'center', marginTop:'10px', gap:'40px' , marginBottom:'50px'}}>
                  <div style={{ width: 'fit-content'}}>
                    <button className='button-40' style={{ display: 'flex', alignItems: 'center', fontSize:'1rem', padding:'.4rem 0.8rem' }} onClick={addChar}>
                      <img src='icons/add.svg' width='24px' style={{ marginRight: '8px' }} />
                      <span>Προσθήκη</span>
                    </button>
                  </div>
                </div>

                <h2 style={{ textAlign: 'left' }}>Εμπειρία</h2>
                <p style={{ textAlign: 'left', marginTop:'-15px' }}>Η σχετική εμπειρίας σας ως παιδαγωγός</p>
                <div>
                  {
                    experience.map(el => {
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', fontSize:'1rem', padding:'.4rem 0.8rem' }}>
                          <img src='icons/cancel_red.svg' width='20px' style={{ marginRight: '15px', cursor:'pointer' }} onClick={() => removeListItem('exp' ,el)} />
                          <span>{el}</span>
                          {/* <img src='icons/cancel_red.svg' width='20px' style={{cursor:'pointer', marginLeft:'auto', marginRight:'400px'}} onClick={() => removeListItem('exp', el)}/> */}
                        </div>
                      )
                    })
                  }
                </div>

                <form onSubmit={addExp}>
                  <input 
                    className='form-input'
                    style={{width:'fit-content', marginTop:'20px '}}
                    value={newExp}
                    onChange={(e) => {
                      setNewExp(e.target.value)
                    }}
                  />
                </form>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'left', alignItems:'center', marginTop:'30px', gap:'40px' , marginBottom:'50px'}}>
                  <div style={{ width: 'fit-content'}}>
                    <button className='button-40' style={{ display: 'flex', alignItems: 'center', fontSize:'1rem', padding:'.4rem 0.8rem' }} onClick={addExp}>
                      <img src='icons/add.svg' width='24px' style={{ marginRight: '8px' }} />
                      <span>Προσθήκη</span>
                    </button>
                  </div>
                </div>

                <h2 style={{ textAlign: 'left' }}>Συστατικές επιστολές</h2>
                <p style={{ textAlign: 'left', marginTop:'-15px' }}>Υπογεγραμένες επιστολές σχετικά με τα προσόντα σας</p>
                <div style={{ display: 'flex', flexDirection:'row', gap:'30px', marginBottom:'30px'}}>
                  {
                    systatikes.map(el => {
                      return (
                        <div>
                        <button className='box2' style={{ display: 'flex', flexDirection:'column',alignItems: 'center', fontSize:'1rem', padding:'.4rem 0.8rem', cursor:'pointer' }}>
                          <img src='icons/email.svg' width='28x' style={{ marginRight: '15px' }} />
                          <span>{el}</span>
                        </button  >
                        </div>
                      )
                    })
                  }
                </div>
                <label for="images" class="drop-container" id="dropcontainer">
                  <span class="drop-title">Σύρτε αρχεία εδώ</span>
                  ή
                  <input type="file" onChange={handleSystatikiUpload} />
                  <span class="file-message" id="fileMessage" style={{position:'absolute', marginTop:'65px', marginLeft:'30px'}}>{newSystatiki}</span>
                  {/* <span class="file-message" style={{position:'absolute', marginTop:'65px', marginLeft:'-255px', color:'#ffffff'}}>Περιήγηση</span> */}
                </label>

                <div style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'100px', gap:'40px' }}>
                  <div style={{ width: 'fit-content'}}>
                    <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={submitChanges}>
                      <img src='icons/save.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>Αποθήκευση</span>
                    </button>
                  </div>
                  <div style={{ width: 'fit-content'}}>
                    <button className='persona2-button' style={{ display: 'flex', alignItems: 'center', width:'auto' }} onClick={() => setEditing(false)}>
                      <img src='icons/cancel.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>Ακύρωση</span>
                    </button>
                  </div>
                </div>
                </div>


            </div>
            :
            <div style={{marginLeft:'-500px'}}>
              {/* <ScrollButton /> */}
              <br />
              <br />
              <h2 style={{ textAlign: 'left' }}>Δύο λόγια για τον εαυτό σας</h2>
              <p style={{ textAlign: 'left', marginTop:'-15px' }}>Σχετικά με εσάς</p>

                <div className='box1' style={{width:'100%', height:'100%'}}>
                  <div style={{width:'100%', height:'100%', fontSize:'20px', fontFamily:"monospace", marginLeft:'21px', whiteSpace:'pre-line'}}>
                    {descr}
                  </div>
                </div>

                <h2 style={{ textAlign: 'left', marginTop:'70px' }}>Εκπαίδευση</h2>
                <p style={{ textAlign: 'left', marginTop:'-15px' }}>Τίτλοι σπουδών, πιστοποιήσεις</p>
                <div>
                  {
                    education.map(el => {
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', fontSize:'1rem', padding:'.4rem 0.8rem' }}>
                          <img src='icons/check.svg' width='20px' style={{ marginRight: '15px' }} />
                          <span>{el}</span>
                        </div>
                      )
                    })
                  }
                </div>

                <h2 style={{ textAlign: 'left', marginTop:'70px' }}>Χαρακτηριστικά</h2>
                <p style={{ textAlign: 'left', marginTop:'-15px' }}>Ιδιότητες και δεξιότητές σας</p>
                <div>
                  {
                    chars.map(el => {
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', fontSize:'1rem', padding:'.4rem 0.8rem' }}>
                          <img src='icons/check.svg' width='20px' style={{ marginRight: '15px' }} />
                          <span>{el}</span>
                          {/* <img src='icons/cancel_red.svg' width='20px' style={{cursor:'pointer', marginLeft:'auto', marginRight:'400px'}} onClick={() => removeListItem('chars', el)}/> */}
                        </div>
                      )
                    })
                  }
                </div>


                <h2 style={{ textAlign: 'left', marginTop:'70px'  }}>Εμπειρία</h2>
                <p style={{ textAlign: 'left', marginTop:'-15px' }}>Η σχετική εμπειρίας σας ως παιδαγωγός</p>
                <div>
                  {
                    experience.map(el => {
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', fontSize:'1rem', padding:'.4rem 0.8rem' }}>
                          <img src='icons/check.svg' width='20px' style={{ marginRight: '15px' }} />
                          <span>{el}</span>
                          {/* <img src='icons/cancel_red.svg' width='20px' style={{cursor:'pointer', marginLeft:'auto', marginRight:'400px'}} onClick={() => removeListItem('exp', el)}/> */}
                        </div>
                      )
                    })
                  }
                </div>


                <h2 style={{ textAlign: 'left', marginTop:'70px'  }}>Συστατικές επιστολές</h2>
                <p style={{ textAlign: 'left', marginTop:'-15px' }}>Υπογεγραμένες επιστολές σχετικά με τα προσόντα σας</p>
                <div style={{ display: 'flex', flexDirection:'row', gap:'30px'}}>
                  {
                    systatikes.map(el => {
                      return (
                        <button className='box2' style={{ display: 'flex', flexDirection:'column',alignItems: 'center', fontSize:'1rem', padding:'.4rem 0.8rem', cursor:'pointer' }}>
                          <img src='icons/email.svg' width='28x' style={{ marginRight: '15px' }} />
                          <span>{el}</span>
                        </button  >
                      )
                    })
                  }
                </div>


                <div style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'100px', gap:'40px' }}>
                  <div style={{ width: 'fit-content'}}>
                    <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => setEditing(true)}>
                      <img src='icons/pencil_white.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>Επεξεργασία</span>
                    </button>
                  </div>
                </div>
                </div>
            </div>
          :
            <div>
              { editing ?
              <div style={{marginLeft:'-500px'}}>
                <br />
                <br />
                <h2 style={{ textAlign: 'left', marginTop:'70px'  }}>Πιστοποιητικά υγείας</h2>
                <p style={{ textAlign: 'left', marginTop:'-15px' }}>Παθολόγος/Γενικός γιατρός</p>
                <label for="images" class="drop-container" id="dropcontainer">
                  <span class="drop-title">Σύρτε αρχεία εδώ</span>
                  ή
                  <input type="file" onChange={handlePathologosUpload} />
                  <span class="file-message" id="fileMessage" style={{position:'absolute', marginTop:'65px', marginLeft:'30px'}}>{pathologos}</span>
                  {/* <span class="file-message" style={{position:'absolute', marginTop:'65px', marginLeft:'-255px', color:'#ffffff'}}>Περιήγηση</span> */}
                </label>
                <p style={{ textAlign: 'left', marginTop:'35px' }}>Δερματολόγος</p>
                <label for="images" class="drop-container" id="dropcontainer">
                  <span class="drop-title">Σύρτε αρχεία εδώ</span>
                  ή
                  <input type="file" onChange={handleDermatologosUpload}  />
                  <span class="file-message" id="fileMessage" style={{position:'absolute', marginTop:'65px', marginLeft:'30px'}}>{dermatologos}</span>
                  {/* <span class="file-message" style={{position:'absolute', marginTop:'65px', marginLeft:'-255px', color:'#ffffff'}}>Περιήγηση</span> */}
                </label>
                <p style={{ textAlign: 'left', marginTop:'35px' }}>Ψυχικής υγείας</p>
                <label for="images" class="drop-container" id="dropcontainer">
                  <span class="drop-title">Σύρτε αρχεία εδώ</span>
                  ή
                  <input type="file"  onChange={handlePsyxikiUpload} />
                  <span class="file-message" id="fileMessage" style={{position:'absolute', marginTop:'65px', marginLeft:'30px'}}>{psyxiki}</span>
                  {/* <span class="file-message" style={{position:'absolute', marginTop:'65px', marginLeft:'-255px', color:'#ffffff'}}>Περιήγηση</span> */}
                </label>

                <br />
                <br />
                <h2 style={{ textAlign: 'left', marginTop:'70px'  }}>Πιστοποίηση σε πρώτες βοήθειες</h2>
                {/* <p style={{ textAlign: 'left', marginTop:'-15px' }}>Υπογεγραμένες επιστολές σχετικά με τα προσόντα σας</p> */}
                <label for="images" class="drop-container" id="dropcontainer">
                  <span class="drop-title">Σύρτε αρχεία εδώ</span>
                  ή
                  <input type="file" onChange={handleFirsiAidsUpload}  />
                  <span class="file-message" id="fileMessage" style={{position:'absolute', marginTop:'65px', marginLeft:'30px'}}>{firstAids}</span>
                  {/* <span class="file-message" style={{position:'absolute', marginTop:'65px', marginLeft:'-255px', color:'#ffffff'}}>Περιήγηση</span> */}
                </label>

                <br />
                <br />
                <h2 style={{ textAlign: 'left', marginTop:'70px'  }}>Απόσπασμα ποινικού μητρώου γενικής χρήσης</h2>
                {/* <p style={{ textAlign: 'left', marginTop:'-15px' }}>Υπογεγραμένες επιστολές σχετικά με τα προσόντα σας</p> */}
                <label for="images" class="drop-container" id="dropcontainer">
                  <span class="drop-title">Σύρτε αρχεία εδώ</span>
                  ή
                  <input type="file" onChange={handlePoinikoUpload}  />
                  <span class="file-message" id="fileMessage" style={{position:'absolute', marginTop:'65px', marginLeft:'30px'}}>{poiniko }</span>
                  {/* <span class="file-message" style={{position:'absolute', marginTop:'65px', marginLeft:'-255px', color:'#ffffff'}}>Περιήγηση</span> */}
                </label>
                  

                <div style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'100px', gap:'40px' }}>
                  <div style={{ width: 'fit-content'}}>
                    <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={submitChanges}>
                      <img src='icons/save.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>Αποθήκευση</span>
                    </button>
                  </div>
                  <div style={{ width: 'fit-content'}}>
                    <button className='persona2-button' style={{ display: 'flex', alignItems: 'center', width:'auto' }} onClick={() => setEditing(false)}>
                      <img src='icons/cancel.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>Ακύρωση</span>
                    </button>
                  </div>
                </div>
                </div>

              </div>
              :
              <div style={{marginLeft:'-500px'}}>
                <br />
                <br />
                <h2 style={{ textAlign: 'left', marginTop:'70px'  }}>Πιστοποιητικά υγείας</h2>
                <p style={{ textAlign: 'left', marginTop:'-15px' }}>Παθολόγος/Γενικός γιατρός</p>
                <div style={{ width: 'fit-content', cursor:'pointer'}}>
                  {userData[0].bio_files && userData[0].bio_files.pathologos  ?
                    <div className='box2' style={{ display: 'flex', alignItems: 'center', width:'auto' }}>
                      <img src='icons/paper_black.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>{userData[0].bio_files.pathologos }</span>
                    </div>
                  :
                    <div className='box1' style={{ display: 'flex', alignItems: 'center', width:'auto', cursor:'default' }}>
                      <span>Δεν έχετε ανεβάσει αρχείο</span>
                    </div>
                  }

                </div>
                <p style={{ textAlign: 'left', marginTop:'35px' }}>Δερματολόγος</p>
                <div style={{ width: 'fit-content', cursor:'pointer'}}>
                  {userData[0].bio_files && userData[0].bio_files.dermatologos ?
                    <div className='box2' style={{ display: 'flex', alignItems: 'center', width:'auto' }}>
                      <img src='icons/paper_black.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>{userData[0].bio_files.dermatologos}</span>
                    </div>
                  :
                    <div className='box1' style={{ display: 'flex', alignItems: 'center', width:'auto', cursor:'default' }}>
                      <span>Δεν έχετε ανεβάσει αρχείο</span>
                    </div>
                  }
                </div>
                <p style={{ textAlign: 'left', marginTop:'35px' }}>Ψυχικής υγείας</p>
                <div style={{ width: 'fit-content', cursor:'pointer'}}>
                  {userData[0].bio_files && userData[0].bio_files.psyxiki  ?
                    <div className='box2' style={{ display: 'flex', alignItems: 'center', width:'auto' }}>
                      <img src='icons/paper_black.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>{userData[0].bio_files.psyxiki }</span>
                    </div>
                  :
                    <div className='box1' style={{ display: 'flex', alignItems: 'center', width:'auto', cursor:'default' }}>
                      <span>Δεν έχετε ανεβάσει αρχείο</span>
                    </div>
                  }
                </div>
                <br />
                <br />
                <h2 style={{ textAlign: 'left', marginTop:'70px'  }}>Πιστοποίηση σε πρώτες βοήθειες</h2>
                <div style={{ width: 'fit-content', cursor:'pointer'}}>
                  {userData[0].bio_files && userData[0].bio_files.firstAids   ?
                    <div className='box2' style={{ display: 'flex', alignItems: 'center', width:'auto' }}>
                      <img src='icons/paper_black.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>{userData[0].bio_files.firstAids  }</span>
                    </div>
                  :
                    <div className='box1' style={{ display: 'flex', alignItems: 'center', width:'auto', cursor:'default' }}>
                      <span>Δεν έχετε ανεβάσει αρχείο</span>
                    </div>
                  }
                </div>
                <br />
                <br />
                <h2 style={{ textAlign: 'left', marginTop:'70px'  }}>Απόσπασμα ποινικού μητρώου γενικής χρήσης</h2>
                <div style={{ width: 'fit-content', cursor:'pointer'}}>
                  {userData[0].bio_files && userData[0].bio_files.poiniko    ?
                    <div className='box2' style={{ display: 'flex', alignItems: 'center', width:'auto' }}>
                      <img src='icons/paper_black.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>{userData[0].bio_files.poiniko   }</span>
                    </div>
                  :
                    <div className='box1' style={{ display: 'flex', alignItems: 'center', width:'auto', cursor:'default' }}>
                      <span>Δεν έχετε ανεβάσει αρχείο</span>
                    </div>
                  }
                </div>




                <div style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'100px', gap:'40px' }}>
                  <div style={{ width: 'fit-content'}}>
                    <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => setEditing(true)}>
                      <img src='icons/pencil_white.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>Επεξεργασία</span>
                    </button>
                  </div>
                </div>
                </div>
              </div>
              }
            </div>
          }
        </div>
        :

        (isProf === 'parent') ?
          <div className='main-content' style={{height:'20vh', marginBottom:'500px'}}>
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
          <div className='main-content' style={{marginBottom:'500px'}}>
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

export default Prof