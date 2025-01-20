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

const Colab = ({colab_data, refuse_colab, accept_colab, setShowingColab, setTitle}) => {
  const verifyPayment = async(month) => {
    try {
      // Create a query against the collection
      const q = query(collection(FIREBASE_DB, 'colabs'), where('id', '==', colab_data.id))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const docRef = doc(FIREBASE_DB, 'colabs', querySnapshot.docs[0].id)

        // Update the document with the new value
        // await updateDoc(docRef, {
        //   payments:true
        // })
        console.log("Document updated successfully")
        // triggerNotif("success", "Επιτυχία!", "Οι αλλαγές σας υποβλήθηκαν επιτυχώς")
        // setEditing(false)
      } else {
        console.log("No such document found with the specified uid!")
      }
    } catch (error) {
      console.error("Error updating document: ", error)
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
            <h2 style={{marginLeft:'250px'}}>Διαβάστε το συμβόλαιο πριν την  αποδοχή της συνεργασίας</h2>
          </div>
          <div style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
          <button className='box2' style={{ display: 'flex', flexDirection:'row',alignItems: 'center', fontSize:'1rem', padding:'1.4rem 1rem', marginLeft:'250px', cursor:'pointer' }}>
            <img src='icons/paper_black.svg' width='40' style={{ marginRight: '15px' }} />
            <span style={{fontSize:'20px'}}>Συμφωνητικό.pdf</span>  
          </button>
          </div>

          <div style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'100px', gap:'40px', marginLeft:'250px' }}>
              <div style={{ width: 'fit-content'}}>
                <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => accept_colab(colab_data.id)}>
                  <img src='icons/check_circle.svg' width='28px' style={{ marginRight: '8px' }} />
                  <span>Αποδοχή</span>
                </button>
              </div>
              <div style={{ width: 'fit-content'}}>
                <button className='persona2-button' style={{ display: 'flex', alignItems: 'center', width:'auto' }} onClick={() => refuse_colab(colab_data.id)}>
                  <img src='icons/cancel.svg' width='28px' style={{ marginRight: '8px' }} />
                  <span>Απόρριψη</span>
                </button>
              </div>
            </div>
          </div>

        </div>
        :
        <div style={{marginLeft:'300px', display:'flex', flexDirection:'column',gap:'50px', marginBottom:'100px'}}>
          <div style={{fontSize:'25px', fontWeight:600}}>
            Ισχύς συνεργασίας: {colab_data.startDay}/{colab_data.startMonth}/{colab_data.startYear} - {colab_data.endDay}/{colab_data.endMonth}/{colab_data.endYear}
          </div>

          <div>
            <h2 style={{ textAlign: 'left' }}>Συμφωνητικό</h2>
            <p style={{ textAlign: 'left', marginTop:'-15px' }}>Επισκόπηση του ενεργού συμφωνητικού σας με τον/την {colab_data.parent_name}</p>
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
                            <button className='button-40' style={{ display: 'flex', alignItems: 'center', height:'40px', backgroundColor:el.payed ? '#111827' : '#c4c4c4', cursor:el.payed ? 'pointer' : 'default'}} disabled={!el.payed}>
                              <img src='icons/payment.svg' width='28px' style={{ marginRight: '8px' }} />
                              <span>Voucher</span>
                            </button>
                          }
                          modal
                          nested
                          disabled={!el.payed}
                          style={{marginLeft:'250px'}}
                        >
                          {close => (
                            <div className="modal">
                              <button className="close" onClick={close}>
                                <img src='icons/cancel.svg' />
                              </button>
                              <div className="header1">Σαρώστε τον παρακάτω κωδικό για την παραλαβή της πληρωμής σας</div>
                              <div className="header" style={{marginTop:'-20px', marginBottom:'50px'}}>Η ενέργεια αυτή θα σας ανακατευθύνει σε ασφαλές τραπεζικό περιβάλλον</div>
                              <div className="content1">
                                <QRCode value= {el.voucher}/>
                              </div>
                              <div className="actions">
                                <button
                                  style={{width:'200px'}}
                                  className="button-41"
                                  onClick={() => {
                                    verifyPayment(el.month)
                                    close()
                                  }}
                                >
                                  Λήψη πληρωμής
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

const Colabs_profs = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState(null)
  const [isProf, setIsProf] = useState('')
  const [clickedProfile, setClickedProfile] = useState(false)

  const [colabRefs, setColabRefs] = useState([])
  const [colabs, setColabs] = useState([])

  const [showingColab, setShowingColab] = useState(false)
  const [currentColab, setCurrentColab] = useState(null)

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
        if (users[0].colabs) {
          setColabRefs(users[0].colabs)
        }
      }
      else
        setIsProf('parent')

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
        <a href="/profs" ><span style={{verticalAlign:'middle'}}><img src='icons/home.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αρχική σελίδα</a>
        <a href="/ad"><span style={{verticalAlign:'middle'}}><img src='icons/volume.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αγγελία</a>
        <a href="/bio"><span style={{verticalAlign:'middle'}}><img src='icons/paper.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Βιογραφικό</a>
        <a href="/colabs_profs" style={{backgroundColor:'rgb(50, 165, 154)'}}><span style={{verticalAlign:'middle'}}><img src='icons/arrows.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Συνεργασίες</a>
        <a href="/dates_profs"><span style={{verticalAlign:'middle'}}><img src='icons/users.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ραντεβού</a>
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
          {'  >  Συνεργασίες'}
        </div>
        <h1 style={{ marginTop: "35px" }}>&emsp;{title}</h1>
        <hr style={{color:'turquoise', backgroundColor:'turquoise', border:'none', height:'4px', width:'90px', float:'left', marginTop:'-20px', marginLeft:'30px'}} />
      </div>

      {(userData[0] && userId && userData[0].user_category === "professional" && colabs) ?
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
                {colabs.filter((el) => el.active === true).length ?
                  colabs.filter((el) => el.active === true).map((el) => {
                    return (
                      <div style={{width:'fit-content', marginRight:'auto', marginLeft:'auto', marginTop:'50px'}}>
                        <h2 style={{ textAlign: 'left', marginLeft:'250px' }}>Ενεργές συνεργασίες</h2>
                        <div className='box1' style={{height:'fit-content', marginBottom:'50px', display:'flex', flexDirection:'row', marginLeft:'250px', width:'1200px'}}>
                          <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto'}}>
                            <div style={{fontSize:'20px', fontWeight:'700', marginBottom:'5px'}}>
                              <div>
                                Συνεργασία με {el.parent_name}
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
                            <button className='button-40' style={{ display: 'flex', alignItems: 'center', width:'fit-content', height:'fit-content' }} onClick={() => {setCurrentColab(el); setShowingColab(true); setTitle('Συνεργασία με ' + el.parent_name)}}>
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
                {colabs.filter((el) => el.active === false).length ?
                  colabs.filter((el) => el.active === false).map((el) => {
                    return (
                      <div style={{width:'fit-content', marginRight:'auto', marginLeft:'auto', marginTop:'50px'}}>
                      <h2 style={{ textAlign: 'left', marginLeft:'250px' }}>Ανενεργές συνεργασίες</h2>
                      <div className='box1' style={{height:'fit-content', marginBottom:'50px', display:'flex', flexDirection:'row', marginLeft:'250px', width:'1200px', color:'#c4c4c4'}}>
                        <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto'}}>
                          <div style={{fontSize:'20px', fontWeight:'700', marginBottom:'5px'}}>
                            <div>
                              Συνεργασία με {el.parent_name}
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
                          <button className='button-40' style={{ display: 'flex', alignItems: 'center', width:'fit-content', height:'fit-content', backgroundColor:'#c4c4c4' }} onClick={() => {setCurrentColab(el); setShowingColab(true); setTitle('Συνεργασία με ' + el.parent_name)}}>
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
            <Colab colab_data={currentColab} refuse_colab={refuseColab} accept_colab={accept_colab} setShowingColab={setShowingColab} setTitle={setTitle}/>
            <button onClick={() => {setCurrentColab(null); setShowingColab(false)}}>Επιστροφή</button>
          </div>
        :
        (isProf === 'parent') ?
          <div className='main-content' style={{height:'20vh', marginBottom:'250px'}}>
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

export default Colabs_profs