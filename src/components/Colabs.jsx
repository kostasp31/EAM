import React from 'react'
import Footer from "./Footer.jsx"
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_APP } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore'

import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'

import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import 'animate.css/animate.min.css'

import Popup from 'reactjs-popup'
import QRCode from 'react-qr-code'

import StarRatings from 'react-star-ratings'

const Colab = ({colab_data, refuse_colab, accept_colab, setShowingColab, setTitle, triggerNotif, reload, setReload, userData}) => {
  const [ratingTitle, setRatingTitle] = useState('')
  const [ratingBody, setRatingBody] = useState('')
  const [rating, setRating] = useState(0)
  const [reset, setReset] = useState(1)

  const payMonth = async(month) => {
    try {
      // Create a query against the collection

      const docRef = doc(FIREBASE_DB, 'colabs', colab_data.id);  

      let new_colab_data = structuredClone(colab_data.payments)
      for (let i=0; i<new_colab_data.length; i++) {
        if (new_colab_data[i].month === month) {
          new_colab_data[i].payed = true
          new_colab_data[i].paydate = Math.floor(Date.now() / 1000)  
        }
      }

      // Update the document with the new value
      await updateDoc(docRef, {
        payments: new_colab_data
      })


      // get the professional data
      let prof_data
      try {
        const q = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', colab_data.prof_id))
        const querySnapshot = await getDocs(q)
        prof_data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      } catch (error) {
        console.error('Error fetching professional data:', error)
      }


      // Add a notification to the prof
      const notifQuery = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', colab_data.prof_id))
      const notifSnapshot = await getDocs(notifQuery)
      if (!notifSnapshot.empty) {
          const notifDocRef = doc(FIREBASE_DB, 'user_data', notifSnapshot.docs[0].id)
          let oldNotifs = prof_data[0].notifications
          if (!oldNotifs)
            oldNotifs = []
          const newNotif = {
            content: "πλήρωσε για τον μήνα " + month,
            ref_user: colab_data.parent_name,
            time: Math.floor(Date.now() / 1000) 
          }
          oldNotifs.push(newNotif)
          await updateDoc(notifDocRef, { notifications: oldNotifs })
      } else {
          console.log("No such document found with the specified uid!")
      }

      setReload(Math.random())
      setReset(Math.random())
      setShowingColab(false)
      console.log("Document updated successfully")
      triggerNotif("success", "Επιτυχής πληρωμή", "Η πληρωμή σας ολοκληρώθηκε με επιτυχία")

    } catch (error) {
      console.error("Error updating document: ", error)
    }
  }

  const payedAll = () => {
    let payed = true
    for (let el=0; el<colab_data.payments.length; el++) {
      if (!colab_data.payments[el].payed)
        payed = false
    }

    return payed
  }

  const canRate = payedAll()
  
  const submitRating = async () => {
    if (rating === 0) {
      triggerNotif('danger', 'Συμπληρώστε την αξιολόγησή σας', 'Δεν μπορείτε να υποβάλλετε αξιολόγηση με 0 αστέρια')
      return
    }
    if (!ratingTitle) {
      triggerNotif('danger', 'Συμπληρώστε την αξιολόγησή σας', 'Δεν μπορείτε να υποβάλλετε αξιολόγηση χωρίς τίτλο')
      return
    }
    if (!ratingBody) {
      triggerNotif('danger', 'Συμπληρώστε την αξιολόγησή σας', 'Δεν μπορείτε να υποβάλλετε αξιολόγηση χωρίς σώμα')
      return
    }

    try {
      
      // update ratings with a new one
      const notifQuery1 = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', userData[0].uid))
      const notifSnapshot1 = await getDocs(notifQuery1)
      if (!notifSnapshot1.empty) {
        const ratingRefDoc = doc(FIREBASE_DB, 'user_data', notifSnapshot1.docs[0].id)
        // my ratings
        let oldRatings = userData[0].myRatings
        let newRatings = oldRatings
        if (!oldRatings)
          newRatings = []
        
        newRatings.push(colab_data.prof_id)
        await updateDoc(ratingRefDoc, { myRatings: newRatings })
      } else {
          console.log("No such document found with the specified uid!")
      }
  
  
  
      // get the professional data
      let prof_data
      try {
        const q = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', colab_data.prof_id))
        const querySnapshot = await getDocs(q)
        prof_data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      } catch (error) {
        console.error('Error fetching professional data:', error)
      }
  
      // Add a notification to the prof
      const notifQuery2 = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', colab_data.prof_id))
      const notifSnapshot2 = await getDocs(notifQuery2)
      if (!notifSnapshot2.empty) {
          const ratingDocRef = doc(FIREBASE_DB, 'user_data', notifSnapshot2.docs[0].id)
          let oldRatings = prof_data[0].ratings
          if (!oldRatings)
            oldRatings = []
          const newRating = {
            author: userData[0].name + ' ' + userData[0].surname,
            content: ratingBody,
            title: ratingTitle,
            rating: rating,
            review_date: Math.floor(Date.now() / 1000) 
          }
          oldRatings.push(newRating)
          await updateDoc(ratingDocRef, { ratings: oldRatings })
      } else {
          console.log("No such document found with the specified uid!")
      }


      // Add a notification to the prof
      const notifQuery = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', colab_data.prof_id))
      const notifSnapshot = await getDocs(notifQuery)
      if (!notifSnapshot.empty) {
          const notifDocRef = doc(FIREBASE_DB, 'user_data', notifSnapshot.docs[0].id)
          let oldNotifs = prof_data[0].notifications
          if (!oldNotifs)
            oldNotifs = []
          const newNotif = {
            content: "σας αξιολόγησε",
            ref_user: colab_data.parent_name,
            time: Math.floor(Date.now() / 1000) 
          }
          oldNotifs.push(newNotif)
          await updateDoc(notifDocRef, { notifications: oldNotifs })
      } else {
          console.log("No such document found with the specified uid!")
      }
  
      setReload(Math.random())
      setReset(Math.random())
      console.log("Document updated successfully")
      triggerNotif("success", "Επιτυχία", "Η αξιολόγησή σας υποβλήθηκε")
  
    } catch (error) {
      console.error("Error updating document: ", error)
    }

  }

  const completeColab = async() => {
    if (!canRate) {
      triggerNotif('danger', 'Δεν μπορείτε να ολοκληρώσετε τη συνεργασία','Πραγματοποιήστε πρώτα όλες τις απαραίτητες πληρωμές στον επαγγελματία')
      return
    }
    try {
      const docRef = doc(FIREBASE_DB, 'colabs', colab_data.id);  
      // Update the document with the new value
      await updateDoc(docRef, {
        active: false
      })
      
      triggerNotif('success', 'Επιτυχία','Η συνεργασία σας ολοκληρώθηκε με επιτυχία')
      setShowingColab(false)
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      {colab_data.refused ?
      <div className='main-content'>
        <div style={{marginLeft:'250px'}}>
          <h1 style={{ marginTop: "35px" }}>&emsp;Έχετε απορρίψει αυτή την πρόταση συνεργασίας</h1>
          <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
            <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => {setShowingColab(false); setTitle('Συνεργασίες')}}>
              <img src='icons/back.svg' width='28px' style={{ marginRight: '8px' }} />
              <span>Επιστροφή</span>
            </button>
          </div>
        </div>
      </div>
      :
      <div>
      {!colab_data.accepted ?
        <div className='main-content'>
          <div style={{width:'fit-content', marginRight:'auto', marginLeft:'auto', marginBottom:'50px', marginTop:'-50px  '}}>
            <h2 style={{marginLeft:'250px'}}>Ο/Η επαγγελματίας δεν έχει αποδεχτεί ακόμη τη συνεργασία</h2>
          </div>
          <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto', marginTop:'50px' }}>
            <button className='button-40' style={{ display: 'flex', alignItems: 'center', marginLeft:'250px', width:'fit-content' }} onClick={() => {setShowingColab(false); setTitle('Συνεργασίες')}}>
              <img src='icons/back.svg' width='28px' style={{ marginRight: '8px' }} />
              <span>Επιστροφή</span>
            </button>
          </div>
        </div>
        :
        <div style={{marginLeft:'300px', display:'flex', flexDirection:'column',gap:'50px', marginBottom:'100px'}}>
          <div style={{fontSize:'25px', fontWeight:600}}>
            Ισχύς συνεργασίας: {colab_data.startDay}/{colab_data.startMonth}/{colab_data.startYear} - {colab_data.endDay}/{colab_data.endMonth}/{colab_data.endYear}
          </div>

          <div>
            <h2 style={{ textAlign: 'left' }}>Συμφωνητικό</h2>
            <p style={{ textAlign: 'left', marginTop:'-15px' }}>Επισκόπηση του ενεργού συμφωνητικού σας με τον/την {colab_data.prof_name}</p>
            <button className='box2' style={{ display: 'flex', flexDirection:'row',alignItems: 'center', fontSize:'1rem', padding:'1.4rem 1rem', cursor:'pointer' }}>
              <img src='icons/paper_black.svg' width='40' style={{ marginRight: '15px' }} />
              <span style={{fontSize:'20px'}}>Συμφωνητικό.pdf</span>  
            </button>
          </div>

          <div>
          <div>
            <h2 style={{ textAlign: 'left' }}>Πληρωμές</h2>
            <p style={{ textAlign: 'left', marginTop:'-15px' }}>Επισκόπηση των πληρωμών σας μέσω Voucher</p>
          </div>
          <div>
            <table style={{ width: '60%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{fontSize:'20px'}}>
                  <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: 'rgb(50, 165, 154)', color: 'white', width:'100px' }}>Μήνας</th>
                  <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: 'rgb(50, 165, 154)', color: 'white', width:'100px' }}>Πραγματοποιήθηκε</th>
                  <th style={{ border: '1px solid #ddd', padding: '12px', backgroundColor: 'rgb(50, 165, 154)', color: 'white', width:'100px' }}>Voucher</th>
                </tr>
              </thead>
              <tbody>
                {colab_data.payments.map((el) => {
                  return(
                  <tr style={{ backgroundColor: '#f9f9f9' }}>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>{el.month}</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>{el.payed ? <FormattedTimestamp timestamp={el.paydate}/> : '-'}</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                      <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto'}}>
                        <Popup
                          trigger={
                            <button className='button-40' style={{ display: 'flex', alignItems: 'center', height:'40px', backgroundColor:!el.payed ? '#111827' : '#c4c4c4', cursor:!el.payed ? 'pointer' : 'default'}} disabled={el.payed}>
                              <img src='icons/wallet.svg' width='28px' style={{ marginRight: '8px' }} />
                              <span>Πληρωμή</span>
                            </button>
                          }
                          modal
                          nested
                          width={1000}
                          disabled={el.payed}
                          style={{marginLeft:'250px'}}
                        >
                          {close => (
                            <div className="modal">
                              <button className="close" onClick={close}>
                                <img src='icons/cancel.svg' />
                              </button>
                              <div className="header1">Σαρώστε τον παρακάτω κωδικό για την πληρωμή στον επαγγελματία</div>
                              <div className="header" style={{marginTop:'-20px', marginBottom:'50px'}}>Η ενέργεια αυτή θα σας ανακατευθύνει σε ασφαλές τραπεζικό περιβάλλον</div>
                              <div className="content1">
                                <QRCode value= {el.voucher}/>
                              </div>
                              <div className="actions">
                                <button
                                  style={{width:'200px'}}
                                  className="button-41"
                                  onClick={() => {
                                    payMonth(el.month)
                                    close()
                                    setReload(Math.random())
                                    setReset(Math.random())
                                  }}
                                >
                                  Ολοκλήρωση πληρωμής
                                </button>
                              </div>
                            </div>
                          )}
                        </Popup>
                      </div>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>

            { canRate && (!userData[0].myRatings || !userData[0].myRatings.filter((rat) => rat === colab_data.prof_id).length) ?
            <div style={{marginTop:'80px'}}>
              <div>
                <h2>Αξιολόγηση επαγγελματία</h2>
                <h3 style={{color:'#939393'}}>Μετά το πέρας της συνεργασίας σας, μπορείτε να αξιολογήσετε τον/την επαγγελματία που συνεργαστήκατε</h3>
              </div>
              <div>
                <StarRatings
                  rating={rating}
                  starRatedColor="gold"
                  starEmptyColor="gray"
                  changeRating={(r) => setRating(r)}
                  numberOfStars={5}
                  name='rating'
                  starDimension="30px"
                  starSpacing="5px"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className='form-input'
                    style={{width:'600px',fontSize:'18px', fontFamily:'monospace'}}
                    placeholder='Τίτλος'
                    value={ratingTitle}
                    onChange={(e) => setRatingTitle(e.target.value)}
                  />
                </div>
                <div>
                <textarea
                  placeholder='Η αξιολόγησή σας'
                  cols="40"
                  rows="50"
                  className='form-input'
                  style={{width:'600px', height:'300px', fontSize:'20px', whiteSpace:'pre-wrap'}} 
                  onChange={(e) => setRatingBody(e.target.value)}
                  value={ratingBody}
                  />
                </div>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'left', alignItems:'left', marginTop:'20px', gap:'40px' }}>
                  <div style={{ width: 'fit-content'}}>
                    <button className='button-40' style={{ display: 'flex', alignItems: 'left', float:'left' }} onClick={submitRating}>
                      <img src='icons/star.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>Αξιολόγηση</span>
                    </button>
                  </div>
                </div>

            </div>
            : canRate && userData[0].myRatings && (userData[0].myRatings.filter((rat) => rat === colab_data.prof_id).length) ?
            <div>
              <div>
                <h2>Αξιολόγηση επαγγελματία</h2>
                <h3 style={{color:'#939393'}}>Μετά το πέρας της συνεργασίας σας, μπορείτε να αξιολογήσετε τον/την επαγγελματία που συνεργαστήκατε</h3>
              </div>
              <hr style={{marginRight:'50%'}}/>
              <h3>Έχετε υποβάλλει την αξιολόγησή σας</h3>
            </div>
            :
            <></>
            }

            <div style={{marginTop:'80px'}}>
              <h2>Ολοκλήρωση συνεργασίας</h2>
              <h3 style={{color:'#939393'}}>Ολοκληρώστε τη συνεργασία σας, και θέστε την ανενεργή</h3>
            </div>       
            <div style={{display:'flex', flexDirection:'row', justifyContent:'left', alignItems:'left', marginTop:'20px', gap:'40px' }}>
              <div style={{ width: 'fit-content'}}>
                <button className='button-40' style={{ display: 'flex', alignItems: 'left', float:'left', backgroundColor:!colab_data.active ? '#c4c4c4' : '#111827' }} onClick={completeColab} disabled={!colab_data.active}>
                  <span>Ολοκλήρωση</span>
                </button>
              </div>
            </div>

          </div>
          </div>

          <div>
            <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto', marginTop:'50px' }}>
              <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => {setShowingColab(false); setTitle('Συνεργασίες')}}>
                <img src='icons/back.svg' width='28px' style={{ marginRight: '8px' }} />
                <span>Επιστροφή</span>
              </button>
            </div>
          </div>



        </div>
      }
      </div>
      }
    </div>
  )
}

const FormattedTimestamp = ({timestamp}) => {
  const date = new Date(timestamp*1000)
  console.log(date)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return (
  <>
    {`${day}-${month}-${year}`}
  </>
  )
}

const Colabs = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState(null)
  const [isProf, setIsProf] = useState('')
  const [clickedProfile, setClickedProfile] = useState(false)

  const [colabRefs, setColabRefs] = useState([])
  const [colabs, setColabs] = useState([])

  const [showingColab, setShowingColab] = useState(false)
  const [currentColab, setCurrentColab] = useState(null)

  const [reload, setReload] = useState(1)

  const [title, setTitle] = useState('Συνεργασίες')

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
    const fetchData = async () => {
      if (userId) {
        try {
          await fetchUserData() // Wait for fetchUser Data to complete
        } catch (error) {
          console.error("Error fetching data:", error)
        }
      }
    }

    fetchData() // Call the async function
  }, [userId])

  useEffect(() => {
    const fetchData = async () => {
      if (userId && userData) {
        try {
          await fetchColabData() // Wait for fetchUser Data to complete
        } catch (error) {
          console.error("Error fetching data:", error)
        }
      }
    }

    fetchData() // Call the async function
  }, [userData, showingColab])

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('haha')
        await fetchColabData() // Wait for fetchUser Data to complete
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData() // Call the async function
  }, [reload])

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

      if (users[0] && users[0].user_category === 'parent') {
        setIsProf('parent')
        if (users[0].colabs) {
          setColabRefs(users[0].colabs)
        }
      }
      else
        setIsProf('proffesional')

    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const fetchColabData = async () => {
    try {

      const colabs_all = []
      for (const id of colabRefs) {
        const docRef = doc(FIREBASE_DB, 'colabs', id);  
        const docSnap = await getDoc(docRef)
    
        if (docSnap.exists()) {
          colabs_all.push({ id: docSnap.id, ...docSnap.data() })
        }
        else {  
          console.log(`No document found with ID: ${id}`)
        }
      }

      console.log("colabrefs:", colabRefs)

      setColabs(colabs_all)

      console.log("colab_data: ", colabs_all)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const refuseColab = async (colab_id) => {
    try {
      const docRef = doc(FIREBASE_DB, 'colabs', colab_id)

      // Update the document with the new value
      await updateDoc(docRef, {
        accepted: true,
        active: false,
        refused: true,
      })
      // console.log("Document updated successfully")
      setShowingColab(false)
      triggerNotif("success", "Επιτυχία", "Αρνηθήκατε τη συνεργασία")
    } catch (error) {
      console.error("Error updating document: ", error)
    }
  }

  const accept_colab = async (colab_id) => {
    try {
      const docRef = doc(FIREBASE_DB, 'colabs', colab_id)

      // Update the document with the new value
      await updateDoc(docRef, {
        accepted: true,
        active: true,
        refused: false,
      })
      // console.log("Document updated successfully")
      setShowingColab(false)
      triggerNotif("success", "Επιτυχία", "Δεχτήκατε τη συνεργασία")
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
        <a href="/parent" ><span style={{verticalAlign:'middle'}}><img src='icons/home.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αρχική σελίδα</a>
        <a href="/search"><span style={{verticalAlign:'middle'}}><img src='icons/search.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αναζήτηση</a>
        <a href="/applications"><span style={{verticalAlign:'middle'}}><img src='icons/paper.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αιτήσεις</a>
        <a href="/colabs" style={{backgroundColor:'rgb(50, 165, 154)'}}><span style={{verticalAlign:'middle'}}><img src='icons/arrows.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Συνεργασίες</a>
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
          {'  >  Συνεργασίες'}
        </div>
        <h1 style={{ marginTop: "35px" }}>&emsp;{title}</h1>
        <hr style={{color:'turquoise', backgroundColor:'turquoise', border:'none', height:'4px', width:'90px', float:'left', marginTop:'-20px', marginLeft:'30px'}} />
      </div>

      {(userData[0] && userId && userData[0].user_category === "parent" && colabs) ?
        !showingColab ?
          <div>
            {!userData[0].colabs || userData[0].colabs.length === 0 ?
              <div className='main-content' style={{marginBottom:'500px'}}>
                <div style={{marginLeft:'250px'}}>
                  <h1 style={{ marginTop: "35px" }}>&emsp;Δεν έχετε συνάψει συνεργασίες</h1>
                  <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
                  </div>
                </div>
              </div>
              : 
              <div>
                <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto'}}>
                <div style={{width:'fit-content', marginRight:'auto', marginLeft:'auto', marginTop:'50px'}}>
                  <h2 style={{ textAlign: 'left', marginLeft:'250px' }}>Ενεργές συνεργασίες</h2>
                </div>
                </div>
                {colabs.filter((el) => el.active === true).length ?
                  colabs.filter((el) => el.active === true).map((el) => {
                    return (
                      <div style={{width:'fit-content', marginRight:'auto', marginLeft:'auto', marginTop:'50px'}}>
                        <div className='box1' style={{height:'fit-content', marginBottom:'50px', display:'flex', flexDirection:'row', marginLeft:'250px', width:'1200px'}}>
                          <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto'}}>
                            <div style={{fontSize:'20px', fontWeight:'700', marginBottom:'5px'}}>
                              <div>
                                Συνεργασία με {el.prof_name}
                              </div>
                            </div>
                          </div>
                          <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto', marginLeft:'10px'}}>
                            <img src='icons/warning.png' style={el.accepted ? {visibility:'hidden'} : {visibility:'visible'}} width='28'/>
                          </div>
                          <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto', marginLeft:'10px'}}>
                            <div className='arrow-box' style={el.accepted ? {visibility:'hidden'} : {visibility:'visible'}}><div style={{marginLeft:'11px', paddingTop:'11px', fontWeight:700}}>Εκκρεμεί αποδοχή</div></div>
                          </div>

                          <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto', marginLeft:'auto'}}>
                            <button className='button-40' style={{ display: 'flex', alignItems: 'center', width:'fit-content', height:'fit-content' }} onClick={() => {setCurrentColab(el); setShowingColab(true); setTitle('Συνεργασία με ' + el.prof_name)}}>
                              <img src='icons/layers.svg' width='20px' style={{ marginRight: '8px' }} />
                              <span>Λεπτομέρειες</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                : 
                <div className='main-content'>
                  <h1 style={{textAlign: 'left', marginLeft:'250px'}}>Δεν υπάρχουν ενεργές συνεργασίες</h1>
                </div>
                }

              <div>
                <div style={{width:'fit-content', marginRight:'auto', marginLeft:'auto', marginTop:'50px'}}>
                  <h2 style={{ textAlign: 'left', marginLeft:'250px' }}>Ανενεργές συνεργασίες</h2>
                </div>
                {colabs.filter((el) => el.active === false).length ?
                  colabs.filter((el) => el.active === false).map((el) => {
                    return (
                      <div style={{width:'fit-content', marginRight:'auto', marginLeft:'auto', marginTop:'50px'}}>
                      <div className='box1' style={{height:'fit-content', marginBottom:'50px', display:'flex', flexDirection:'row', marginLeft:'250px', width:'1200px', color:'#c4c4c4'}}>
                        <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto'}}>
                          <div style={{fontSize:'20px', fontWeight:'700', marginBottom:'5px'}}>
                            <div>
                              Συνεργασία με {el.prof_name}
                            </div>
                          </div>
                        </div>
                        <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto', marginLeft:'10px'}}>
                          <img src='icons/warning.png' width='28' style={el.accepted ? {visibility:'hidden'} : {visibility:'visible'}}/>
                        </div>
                        <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto', marginLeft:'10px'}}>
                            <div className='arrow-box' style={el.accepted ? {visibility:'hidden'} : {visibility:'visible'}}><div style={{marginLeft:'11px', paddingTop:'11px', fontWeight:700}}>Εκκρεμεί αποδοχή</div></div>
                        </div>
                        <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto', marginLeft:'auto'}}>
                          <button className='button-40' style={{ display: 'flex', alignItems: 'center', width:'fit-content', height:'fit-content', backgroundColor:'#c4c4c4' }} onClick={() => {setCurrentColab(el); setShowingColab(true); setTitle('Συνεργασία με ' + el.prof_name)}}>
                            <img src='icons/layers.svg' width='20px' style={{ marginRight: '8px' }} />
                            <span>Λεπτομέρειες</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )

                  })
                : 
                <div className='main-content'>
                  <h2 style={{ textAlign: 'left', marginLeft:'250px' }}>Δεν υπάρχουν ανενεργές συνεργασίες</h2>
                </div>
                }
              </div>
            </div>
            }
          </div>
          :
          <div>
            <Colab colab_data={currentColab} refuse_colab={refuseColab} accept_colab={accept_colab} setShowingColab={setShowingColab} setTitle={setTitle} triggerNotif={triggerNotif} reload={reload} setReload={setReload} userData={userData}/>
            <button onClick={() => {setCurrentColab(null); setShowingColab(false)}}>Επιστροφή</button>
          </div>
        :
        (isProf === 'professional') ?
          <div className='main-content' style={{marginBottom:'500px'}}>
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
          <div className='main-content' style={{marginBottom:'500px'}}>
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

export default Colabs
