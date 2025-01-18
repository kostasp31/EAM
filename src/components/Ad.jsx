import React from 'react'
import Footer from "./Footer.jsx"
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_APP } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'

import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'

import Modal from './Modal.jsx'


import TimePicker from './TimePicker.jsx'
import TimePicker_Dummy from './TimePicker_Dummy.jsx'

import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import 'animate.css/animate.min.css'

const Ad = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState(null)
  const [isProf, setIsProf] = useState('')
  const [editing, setEditing] = useState(false)
  
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
  const [info, setInfo] = useState('')
  const [loc, setLoc] = useState(null)
  const [jobType, setJobType] = useState(null)

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
  }, [userId, editing]) // if we stopped editing (saved, reload)

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH)
      navigate('/')
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
        setJobType(users[0].ad["jobType"])
        setLoc(users[0].ad["location"])
        setInfo(users[0].ad["info"])
      }
      else
        setIsProf('parent')
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleInfoChange = (e) => {
    setInfo(e.target.value)
  }

  const submitAd = async () => {
    const advertisment = {
      "hours": hours,
      "location": loc,
      "jobType": jobType,
      "info": info
    }

    // console.log(advertisment)

    try {
      // Create a query against the collection
      const q = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', userId))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        // Assuming you want to update the first document found
        const docRef = doc(FIREBASE_DB, 'user_data', querySnapshot.docs[0].id)

        // Update the document with the new value
        await updateDoc(docRef, {
          ad: advertisment,
          has_uploaded_ad: true
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
        <a href="/profs" ><span style={{ verticalAlign: 'middle' }}><img src='icons/home.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Αρχική σελίδα</a>
        <a href="/ad" style={{ backgroundColor: 'rgb(50, 165, 154)' }}><span style={{ verticalAlign: 'middle' }}><img src='icons/volume.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Αγγελία</a>
        <a href="/bio"><span style={{ verticalAlign: 'middle' }}><img src='icons/paper.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Βιογραφικό</a>
        <a href="/colabs_profs"><span style={{ verticalAlign: 'middle' }}><img src='icons/arrows.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Συνεργασίες</a>
        <a href="/dates_profs"><span style={{ verticalAlign: 'middle' }}><img src='icons/users.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Ραντεβού</a>
        <a href="/notifs_profs"><span style={{ verticalAlign: 'middle' }}><img src='icons/bell.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Ειδοποιήσεις</a>
        <a href="/profile_profs"><span style={{ verticalAlign: 'middle' }}><img src='icons/person.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Προφίλ</a>
        <a href="/ratings"><span style={{ verticalAlign: 'middle' }}><img src='icons/thumbs.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Αξιολογήσεις</a>
        <a href="/help" style={{ borderBottom: '1px solid white' }}><span style={{ verticalAlign: 'middle' }}><img src='icons/help.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Βοήθεια</a>
      </div>

      {/* <Modal text={'Υποβολή'} /> */}

      <div style={{ paddingLeft: '270px', paddingTop: '90px' }}>
        <div style={{ height: '15px', alignItems: 'left' }}>
          <a href='/'>Aρχική σελίδα</a>
          {'  >  '}  <a href='profs'>Επαγγελματίες</a>
          {'  >  Αγγελία'}
        </div>
        <h1 style={{ marginTop: "35px" }}>&emsp;Αγγελία</h1>
        <hr style={{color:'turquoise', backgroundColor:'turquoise', border:'none', height:'4px', width:'90px', float:'left', marginTop:'-20px', marginLeft:'30px'}} />
      </div>

      {(userData[0] && userId && userData[0].user_category === "professional") ?

        <div>
          {userData[0].has_uploaded_ad || editing ?
            <div>
              {editing ?
                <div className='main-content' style={{ maxWidth: 'fit-content', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '250px', paddingTop: '0px', marginTop:'50px' }}>





                  <div style={{display:'flex', flexDirection:'column', gap:'70px'}}>
                    <div style={{display:'flex', flexDirection:'row', gap:'70px'}}>
                      <div className='box1' style={{width:'650px', height:'600px'}}>


                        <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto', marginBottom:'30px' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }} >
                            <span style={{fontSize:'20px', fontWeight:'700', verticalAlign:'middle', marginTop:'0px'}}>Διαθεσιμότητα</span>
                            <img src='icons/availability.svg' style={{ marginLeft: '8px', width:'32px' }} />
                          </div>
                        </div>


                        <TimePicker 
                          hours={hours}
                          setHours={setHours}
                        />




                      </div>
                      <div style={{display:'flex', flexDirection:'column', gap:'70px'}}>

                        <div className='box1' style={{width:'250px', height:'150px'}}>
                          <div style={{ width:'fit-content', marginLeft:'auto', marginRight:'auto' }}>

                            <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }} >
                                <span style={{fontSize:'20px', fontWeight:'700', verticalAlign:'middle', marginTop:'0px'}}>Τοποθεσία εργασίας</span>
                                <img src='icons/location.svg' style={{ marginLeft: '8px', width:'30px' }} />
                              </div>
                            </div>

                            <div className='radio-group' style={{marginTop:'35px'}}>
                              <div>
                                <input type="radio" name="category" id="parent_loc" value="parent" checked={loc === 'parent'} onClick={() => {
                                  setLoc('parent')
                                }}/>
                                <label for="parent_loc" style={{marginRight:'40px'}} onClick={() => {
                                  setLoc('parent')
                                }}>Τοποθεσία γονέα</label>
                                <br />
                                <input type="radio" name="category" id="prof_loc" value="proffesional" checked={loc !== 'parent'}  onClick={() => {
                                  setLoc('professional')
                                }}/>
                                <label for="prof_loc" onClick={() => {
                                  setLoc('professional')
                                  }}>Τοποθεσία επαγγελματία</label>
                              </div>
                            </div>

                          </div>
                          <br />
                          
                        </div>
                        <div className='box1' style={{width:'250px', height:'150px'}}>
                        <div style={{ width:'fit-content', marginLeft:'auto', marginRight:'auto' }}>

                          <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }} >
                              <span style={{fontSize:'20px', fontWeight:'700', verticalAlign:'middle', marginTop:'0px'}}>Χρόνος απασχόλησης</span>
                              <img src='icons/watch.svg' style={{ marginLeft: '8px', width:'26px' }} />
                            </div>
                          </div>

                          <div className='radio-group' style={{marginTop:'35px'}}>
                            <div>
                              <input type="radio" name="apasxolisi" id="partial" value="parent" checked={jobType === 'partial'} onClick={() => {
                                setJobType("partial")
                              }}/>
                              <label for="partial" style={{marginRight:'40px'}} onClick={() => {
                                setJobType("partial")
                              }}>Μερική</label>
                              <br />
                              <input type="radio" name="apasxolisi" id="full" value="proffesional" checked={jobType !== 'partial'}  onClick={() => {
                                setJobType("full")
                              }}/>
                              <label for="full" onClick={() => {
                                setJobType("full")
                                }}>Πλήρης</label>
                            </div>
                          </div>

                          </div>
                          <br />
                        </div>
                      </div>
                    </div>
                    <div className='box1' style={{height:'300px'}}>
                      <div style={{ width:'fit-content', marginLeft:'auto', marginRight:'auto' }}>

                        <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }} >
                            <span style={{fontSize:'20px', fontWeight:'700', verticalAlign:'middle', marginTop:'0px'}}>Επιπλέον πληροφορίες</span>
                            <img src='icons/extra_info.svg' style={{ marginLeft: '8px', width:'30px' }} />
                          </div>
                        </div>


                      </div>
                      <div style={{marginTop:'20px', width:'100%', height:'100%'}}>
                        <textarea placeholder='Επιπλέον πληροφορίες σχετικά με εσάς' cols="40" rows="50" className='form-input' style={{width:'100%', height:'80%', fontSize:'20px', whiteSpace:'pre-wrap'}} 
                          onChange={handleInfoChange}
                          value={info} />
                      </div>

                    </div>
                  </div>


                  <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'100px', gap:'40px' }}>

                    <div style={{ width: 'fit-content'}}>
                      <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={submitAd}>
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
              :
                <div>









                    <div className='main-content' style={{ maxWidth: 'fit-content', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '250px', paddingTop: '0px', marginTop:'50px' }}>
                    <div style={{display:'flex', flexDirection:'column', gap:'70px'}}>
                      <div style={{display:'flex', flexDirection:'row', gap:'70px'}}>
                        <div className='box1' style={{width:'650px', height:'600px'}}>


                          <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto', marginBottom:'30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }} >
                              <span style={{fontSize:'20px', fontWeight:'700', verticalAlign:'middle', marginTop:'0px'}}>Διαθεσιμότητα</span>
                              <img src='icons/availability.svg' style={{ marginLeft: '8px', width:'32px' }} />
                            </div>
                          </div>


                          <TimePicker_Dummy availability={userData[0].ad.hours} />


                        </div>
                        <div style={{display:'flex', flexDirection:'column', gap:'70px'}}>

                          <div className='box1' style={{width:'250px', height:'150px'}}>
                            <div style={{ width:'fit-content', marginLeft:'auto', marginRight:'auto' }}>

                              <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }} >
                                  <span style={{fontSize:'20px', fontWeight:'700', verticalAlign:'middle', marginTop:'0px'}}>Τοποθεσία εργασίας</span>
                                  <img src='icons/location.svg' style={{ marginLeft: '8px', width:'30px' }} />
                                </div>
                              </div>

                              <div className='profile-key' style={{width:'fit-content', marginLeft:'auto', marginRight:'auto', marginTop:'50px', fontWeight:'700'}}>
                                {userData[0].ad.location === 'professional' ?
                                    <div>
                                      Τοποθεσία επαγγελματία
                                    </div>
                                  :
                                    <div>
                                      Τοποθεσία γονέα
                                    </div>
                                }
                              </div>

                            </div>
                            <br />
                            
                          </div>
                          <div className='box1' style={{width:'250px', height:'150px'}}>
                          <div style={{ width:'fit-content', marginLeft:'auto', marginRight:'auto' }}>

                            <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }} >
                                <span style={{fontSize:'20px', fontWeight:'700', verticalAlign:'middle', marginTop:'0px'}}>Χρόνος απασχόλησης</span>
                                <img src='icons/watch.svg' style={{ marginLeft: '8px', width:'26px' }} />
                              </div>
                            </div>

                            <div className='profile-key' style={{width:'fit-content', marginLeft:'auto', marginRight:'auto', marginTop:'50px', fontWeight:'700'}}>
                                {userData[0].ad["jobType"] === 'partial' ?
                                    <div>
                                      Μερική απασχόληση
                                    </div>
                                  :
                                    <div>
                                      Πλήρης απασχόληση
                                    </div>
                                }
                              </div>

                            </div>
                            <br />
                          </div>
                        </div>
                      </div>
                      <div className='box1' style={{height:'300px', width:'1000px'}}>
                        <div style={{ width:'500px', marginLeft:'auto', marginRight:'auto' }}>

                          <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }} >
                              <span style={{fontSize:'20px', fontWeight:'700', verticalAlign:'middle', marginTop:'0px'}}>Επιπλέον πληροφορίες</span>
                              <img src='icons/extra_info.svg' style={{ marginLeft: '8px', width:'30px' }} />
                            </div>
                          </div>


                        </div>
                        <div style={{marginTop:'34px', width:'100%', height:'100%', fontSize:'20px', fontFamily:"monospace", marginLeft:'21px', whiteSpace:'pre-line'}}>
                          {info}
                        </div>

                      </div>
                    </div>


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
          :
            <div className='main-content'>
              <div style={{marginLeft:'250px'}}>
                <h1 style={{ marginTop: "35px" }}>&emsp;Δεν έχετε καταχωρήσει αγγελία</h1>
                <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
                  <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => setEditing(true)}>
                    <img src='icons/add.svg' width='28px' style={{ marginRight: '8px' }} />
                    <span>Δημιουργία αγγελίας</span>
                  </button>
                </div>
              </div>
            </div>
        }
        </div>

      :

      (isProf === 'parent') ?
        <div className='main-content'>
          <div style={{marginLeft:'250px'}}>
            <h1 style={{ marginTop: "35px" }}>&emsp;Συνδεθείτε ως επαγγελματίας</h1>
            <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
              <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => {handleLogout()}}>
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
              <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => {handleLogout()}}>
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

export default Ad