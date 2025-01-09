import React from 'react'
import Footer from "./Footer.jsx"
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_APP } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'

const Colab = ({colab_data}) => {
  return (
    <div>
      {!colab_data.accepted ?
        <div className='main-content'>
          <div style={{width:'fit-content', marginRight:'auto', marginLeft:'auto', marginBottom:'50px', marginTop:'-50px  '}}>
            <h2 style={{marginLeft:'250px'}}>Διαβάστε το συμβόλαιο πριν την  αποδοχή της συνεργασίας</h2>
          </div>
          <div style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
          <button className='box2' style={{ display: 'flex', flexDirection:'row',alignItems: 'center', fontSize:'1rem', padding:'1.4rem 1rem', marginLeft:'250px' }}>
            <img src='icons/paper_black.svg' width='40' style={{ marginRight: '15px' }} />
            <span style={{fontSize:'20px'}}>Συμφωνητικό.pdf</span>  
          </button>
          </div>

          <div style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'100px', gap:'40px', marginLeft:'250px' }}>
              <div style={{ width: 'fit-content'}}>
                <button className='button-40' style={{ display: 'flex', alignItems: 'center' }}>
                  <img src='icons/check_circle.svg' width='28px' style={{ marginRight: '8px' }} />
                  <span>Αποδοχή</span>
                </button>
              </div>
              <div style={{ width: 'fit-content'}}>
                <button className='persona2-button' style={{ display: 'flex', alignItems: 'center', width:'auto' }}>
                  <img src='icons/cancel.svg' width='28px' style={{ marginRight: '8px' }} />
                  <span>Απόρριψη</span>
                </button>
              </div>
            </div>
          </div>

        </div>
        :
        <div>
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

  const [showingColab, setShowingColab] = useState(false)
  const [currentColab, setCurrentColab] = useState(null)

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
      // console.log("user data: ", users)
      setUserData(users)

      if (users[0] && users[0].user_category === 'professional') {
        setIsProf('professional')
        if (users[0].colabs) {
          let act = users[0].colabs.slice()
          act = act.slice().filter((el) => el.active === true)
          setActiveColabs(act)
          
          const inact = users[0].colabs.slice().filter((el) => el.active === false)
          setInactiveColabs(inact)
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
          <li className="nav-item"><a href="/announcements">Ανακοινώσεις</a></li>
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

                  <li onClick={handleLogout} style={{color:'#ff0000'}}>Αποσύνδεση</li>
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
        <h1 style={{ marginTop: "35px" }}>&emsp;Συνεργασίες</h1>
        <hr style={{color:'turquoise', backgroundColor:'turquoise', border:'none', height:'4px', width:'90px', float:'left', marginTop:'-20px', marginLeft:'30px'}} />
      </div>

      {(userData[0] && userId && userData[0].user_category === "professional") ?
        !showingColab ?
          <div>
            {!userData[0].colabs || userData[0].colabs.length === 0 ?
              <div className='main-content'>
                <div style={{marginLeft:'250px'}}>
                  <h1 style={{ marginTop: "35px" }}>&emsp;Δεν έχετε συνάψει συνεργασίες</h1>
                  <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
                  </div>
                </div>
              </div>
              : 
              <div>
                {userData[0].colabs.filter((el) => el.active === true).length ?
                  userData[0].colabs.filter((el) => el.active === true).map((el) => {
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
                            <button className='button-40' style={{ display: 'flex', alignItems: 'center', width:'fit-content', height:'fit-content' }} onClick={() => {setCurrentColab(el); setShowingColab(true)}}>
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
                {userData[0].colabs.filter((el) => el.active === false).length ?
                  userData[0].colabs.filter((el) => el.active === false).map((el) => {
                  return (
                    <div style={{width:'fit-content', marginRight:'auto', marginLeft:'auto', marginTop:'50px'}}>
                      <h2 style={{ textAlign: 'left', marginLeft:'250px' }}>Ανενεργές συνεργασίες</h2>
                      <div className='box1' style={{height:'fit-content', marginBottom:'50px', display:'flex', flexDirection:'row', marginLeft:'250px', width:'1200px'}}>
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
                          <button className='button-40' style={{ display: 'flex', alignItems: 'center', width:'fit-content', height:'fit-content' }} onClick={() => {setCurrentColab(el); setShowingColab(true)}}>
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
            <Colab colab_data={currentColab} />
            <button onClick={() => {setCurrentColab(null); setShowingColab(false)}}>Επιστροφή</button>
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

export default Colabs_profs