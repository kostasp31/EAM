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

const CircleWithInitialsProfile = ({ name, surname }) => {
  let initials = name[0]+surname[0]
  return (
    <div className="circle-profile-bio"  style={{marginLeft:'auto', marginRight:'auto'}}>
      {initials}  
  </div>
  )
}

const Public_Profile = ({selectedDate, setSelectedDate}) => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const [userData1, setUserData1] = useState([])
  const [userId, setUserId] = useState(null)
  const [isProf, setIsProf] = useState('')
  const [clickedProfile, setClickedProfile] = useState(false)

  const [reload, setReload] = useState(false)

  const [tab, setTab] = useState(1)

  const visited_id = useParams().id

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
  }, [userId, reload])

  useEffect(() => {
    if (visited_id) {
      fetchUserData1() // Fetch user data only after the user_id is available
    }
  }, [])



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

  const fetchUserData1 = async () => {
    console.log('id='+visited_id)
    try {
      const q = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', visited_id)) // Query only data matching the user's UID
      const querySnapshot = await getDocs(q)
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      console.log("visited user: ", users)
      setUserData1(users)

    } catch (error) {
      console.error('Error fetching user data:', error)
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

  const style1 = {borderBottom:'1px solid #000000', padding:'0px 10px 5px 10px', cursor:'pointer'}
  const style2 = {borderBottom:'1px solid #c4c4c4', padding:'0px 10px 5px 10px', cursor:'pointer'}

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
        <a href="/parent" ><span style={{verticalAlign:'middle'}}><img src='/icons/home.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αρχική σελίδα</a>
        <a href="/search" style={{backgroundColor:'rgb(50, 165, 154)'}}><span style={{verticalAlign:'middle'}}><img src='/icons/search.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αναζήτηση</a>
        <a href="/applications"><span style={{verticalAlign:'middle'}}><img src='/icons/paper.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αιτήσεις</a>
        <a href="/colabs"><span style={{verticalAlign:'middle'}}><img src='/icons/arrows.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Συνεργασίες</a>
        <a href="/dates"><span style={{verticalAlign:'middle'}}><img src='/icons/users.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ραντεβού</a>
        <a href="/notifs"><span style={{verticalAlign:'middle'}}><img src='/icons/bell.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ειδοποιήσεις</a>
        <a href="/profile"><span style={{verticalAlign:'middle'}}><img src='/icons/person.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Προφίλ</a>
        <a href="/help" style={{borderBottom:'1px solid white'}}><span style={{verticalAlign:'middle'}}><img src='/icons/help.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Βοήθεια</a>
      </div>


      {(userData1[0] && userId) ?
        <div>
          <div style={{ paddingLeft: '270px', paddingTop: '90px' }}>
            <div style={{ height: '15px', alignItems: 'left' }}>
              <a href='/'>Aρχική σελίδα</a>
              {'  >  '}
              <a href='/parent'>Γονείς</a>
              {'  >  '}
              <a href='/search'>Αναζήτηση</a>
              {`  >  Προφίλ ${userData1[0].name} ${userData1[0].surname}`}
            </div>
            <h1 style={{ marginTop: "35px" }}>&emsp;{`Προφίλ ${userData1[0].name} ${userData1[0].surname}`}</h1>
            <hr style={{color:'turquoise', backgroundColor:'turquoise', border:'none', height:'4px', width:'90px', float:'left', marginTop:'-20px', marginLeft:'30px'}} />
          </div>





      <div className="profile-comp-content">
        <CircleWithInitialsProfile name={userData1[0].name} surname={userData1[0].surname} />
        <div className="username-section">
          <span>{userData1[0].name} {userData1[0].surname}</span>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:'40px', marginTop:'0px', marginBottom:'60px',alignItems:'left', alignContent:'left', marginLeft:'150px'}}>
          <div style={{}}>
            <span style={tab === 1 ? style1 : style2} onClick={() => setTab(1)}>
              Προφίλ
            </span>
            <span style={tab === 2 ? style1 : style2 } onClick={() => setTab(2)}>
              Βιογραφικό
            </span>
            <span style={tab === 3 ? style1 : style2} onClick={() => setTab(3)}>
              Πιστοποιητικά
            </span>
          </div>
        </div>

        {tab === 1 ?
          <div className="profile-comp__container">
            <form style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
              <div className="input-row">
                <div className="input_box">
                  <label htmlFor="name-field">Όνομα</label>
                  <input type="text" id="name-field" value={userData1[0].name} disabled="disabled"/>
                </div>
                <div className="input_box">
                  <label htmlFor="surname-field">Επώνυμο</label>
                  <input type="text" id="surname-field" value={userData1[0].surname} disabled="disabled"/>
                </div>
              </div>
              <div className="input-row">
                <div className="input_box">
                  <label htmlFor="age-field">Ηλικία</label>
                  <input type="number" id="age-field" value={userData1[0].age} disabled="disabled "/>
                </div>
                <div className="input_box">
                  <label htmlFor="sex-field">Φύλο</label>
                  <select name="cars" id="sex-field" disabled="disabled" value={userData1[0].gender} >
                    <option value="" disabled hidden></option>
                    <option value="male">Άντρας</option>
                    <option value="female">Γυναίκα</option>
                  </select>
                </div>
              </div>
              <div className="input-row">
                <div className="input_box">
                  <label htmlFor="amka-field">ΑΜΚΑ</label>
                  <input type="number" id="amka-field" disabled="disabled" value={userData1[0].AMKA}/>
                </div>
                <div className="input_box">
                  <label htmlFor="afm-field">ΑΦΜ</label>
                  <input type="text" id="afm-field" value={userData1[0].AFM} disabled="disabled"/>
                </div>
              </div>
              <div className="input-row">
                <div className="input_box">
                  <label htmlFor="email-field">Email</label>
                  <input type="email" id="email-field" disabled="disabled" value={userData1[0].email}/>
                </div>
                <div className="input_box">
                  <label htmlFor="phone-field">Τηλέφωνο</label>
                  <input type="phone" id="phone-field" disabled="disabled " value={userData1[0].phone}/>
                </div>
              </div>
              <div className="input-row">

                <div className="input_box">
                  <label htmlFor="address-field">Δήμος</label>
                  <select name="cars" id="sex-field" disabled="disabled" value={userData1[0].address}>
                    <option value="" disabled="disabled" hidden></option>
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
                  <input type="text" id="taxidromikos-field" disabled="disabled" value={userData1[0].tk}/>
                </div>
              </div>
              <div className="input-row">
                <div className="input_box">
                  <label htmlFor="city-field">Πόλη</label>
                  <input type="text" id="city-field" disabled="disabled" value={userData1[0].city}/>
                </div>
                <div className="input_box">
                  <label htmlFor="area-field">Περιοχή</label>
                  <input type="text" id="area-field" disabled="disabled " value={userData1[0].area}/>
                </div>
              </div>
            </form>
          </div>
        :
        tab === 2 ?
          <div className="profile-comp__container">
              <div style={{marginLeft:'-500px'}}>
                <br />
                <br />
                <h2 style={{ textAlign: 'left' }}>Σύντομη περιγραφή του/της {userData1[0].name} {userData1[0].surname}</h2>

                {userData1[0].description ?
                  <div className='box1' style={{width:'100%', height:'100%'}}>
                    <div style={{width:'100%', height:'100%', fontSize:'20px', fontFamily:"monospace", marginLeft:'21px', whiteSpace:'pre-line'}}>
                       {userData1[0].description}
                    </div>
                  </div>
                  :
                  <div>
                    Ο/Η {userData1[0].name} {userData1[0].surname} δεν έχει συμπληρώσει περιγραφή
                  </div>
                }


                  <h2 style={{ textAlign: 'left', marginTop:'70px' }}>Εκπαίδευση</h2>
                  {userData1[0].education && userData1[0].education.length ?
                  <div>
                    {
                      userData1[0].education.map(el => {
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', fontSize:'1rem', padding:'.4rem 0.8rem' }}>
                            <img src='/icons/check.svg' width='20px' style={{ marginRight: '15px' }} />
                            <span>{el}</span>
                          </div>
                        )
                      })
                    }
                  </div>
                  :
                  <div>
                    Ο/Η {userData1[0].name} {userData1[0].surname} δεν έχει συμπληρώσει στοιχεία της εκπαίδευσής του
                  </div>
                }                  

                  <h2 style={{ textAlign: 'left', marginTop:'70px' }}>Χαρακτηριστικά</h2>
                  {userData1[0].chars && userData1[0].chars.length ?
                  <div>
                    {
                      userData1[0].chars.map(el => {
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', fontSize:'1rem', padding:'.4rem 0.8rem' }}>
                            <img src='/icons/check.svg' width='20px' style={{ marginRight: '15px' }} />
                            <span>{el}</span>
                            {/* <img src='/icons/cancel_red.svg' width='20px' style={{cursor:'pointer', marginLeft:'auto', marginRight:'400px'}} onClick={() => removeListItem('chars', el)}/> */}
                          </div>
                        )
                      })
                    }
                  </div>
                  :
                  <div>
                    Ο/Η {userData1[0].name} {userData1[0].surname} δεν έχει συμπληρώσει χαρακτηριστικά
                  </div>
                }                  


                  <h2 style={{ textAlign: 'left', marginTop:'70px'  }}>Εμπειρία</h2>
                  {userData1[0].experience && userData1[0].length ?
                  <div>
                    {
                      userData1[0].experience && userData1[0].experience.map(el => {
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', fontSize:'1rem', padding:'.4rem 0.8rem' }}>
                            <img src='/icons/check.svg' width='20px' style={{ marginRight: '15px' }} />
                            <span>{el}</span>
                            {/* <img src='/icons/cancel_red.svg' width='20px' style={{cursor:'pointer', marginLeft:'auto', marginRight:'400px'}} onClick={() => removeListItem('exp', el)}/> */}
                          </div>
                        )
                      })
                    }
                  </div>
                  :
                  <div>
                    Ο/Η {userData1[0].name} {userData1[0].surname} δεν έχει συμπληρώσει την εμπειρία του/της
                  </div>
                }     

                  <h2 style={{ textAlign: 'left', marginTop:'70px'  }}>Συστατικές επιστολές</h2>
                  {userData1[0].systatikes && userData1[0].systatikes.length ?
                  <div style={{ display: 'flex', flexDirection:'row', gap:'30px'}}>
                    {
                      userData1[0].systatikes && userData1[0].systatikes.map(el => {
                        return (
                          <button className='box2' style={{ display: 'flex', flexDirection:'column',alignItems: 'center', fontSize:'1rem', padding:'.4rem 0.8rem', cursor:'pointer' }}>
                            <img src='/icons/email.svg' width='28x' style={{ marginRight: '15px' }} />
                            <span>{el}</span>
                          </button  >
                        )
                      })
                    }
                  </div>
                  :
                  <div>
                    Ο/Η {userData1[0].name} {userData1[0].surname} δεν έχει ανεβάσει συστατικές επιστολές
                  </div>
                }   

              </div>
          </div>
        :
        <div className="profile-comp__container">
              <div style={{marginLeft:'-500px', marginTop:'-100px'}}>
                <br />
                <br />
                <h2 style={{ textAlign: 'left', marginTop:'70px'  }}>Πιστοποιητικά υγείας</h2>
                <p style={{ textAlign: 'left', marginTop:'-15px' }}>Παθολόγος/Γενικός γιατρός</p>
                <div style={{ width: 'fit-content', cursor:'pointer'}}>
                  {userData1[0].bio_files && userData1[0].bio_files.pathologos  ?
                    <div className='box2' style={{ display: 'flex', alignItems: 'center', width:'auto' }}>
                      <img src='/icons/paper_black.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>{userData1[0].bio_files.pathologos }</span>
                    </div>
                  :
                    <div className='box1' style={{ display: 'flex', alignItems: 'center', width:'auto', cursor:'default' }}>
                      <span>Δεν έχει υποβληθεί αρχείο</span>
                    </div>
                  }

                </div>
                <p style={{ textAlign: 'left', marginTop:'35px' }}>Δερματολόγος</p>
                <div style={{ width: 'fit-content', cursor:'pointer'}}>
                  {userData1[0].bio_files && userData1[0].bio_files.dermatologos ?
                    <div className='box2' style={{ display: 'flex', alignItems: 'center', width:'auto' }}>
                      <img src='/icons/paper_black.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>{userData1[0].bio_files.dermatologos}</span>
                    </div>
                  :
                    <div className='box1' style={{ display: 'flex', alignItems: 'center', width:'auto', cursor:'default' }}>
                      <span>Δεν έχει υποβληθεί αρχείο</span>
                    </div>
                  }
                </div>
                <p style={{ textAlign: 'left', marginTop:'35px' }}>Ψυχικής υγείας</p>
                <div style={{ width: 'fit-content', cursor:'pointer'}}>
                  {userData1[0].bio_files && userData1[0].bio_files.psyxiki  ?
                    <div className='box2' style={{ display: 'flex', alignItems: 'center', width:'auto' }}>
                      <img src='/icons/paper_black.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>{userData1[0].bio_files.psyxiki }</span>
                    </div>
                  :
                    <div className='box1' style={{ display: 'flex', alignItems: 'center', width:'auto', cursor:'default' }}>
                      <span>Δεν έχει υποβληθεί αρχείο</span>
                    </div>
                  }
                </div>
                <br />
                <br />
                <h2 style={{ textAlign: 'left', marginTop:'70px'  }}>Πιστοποίηση σε πρώτες βοήθειες</h2>
                <div style={{ width: 'fit-content', cursor:'pointer'}}>
                  {userData1[0].bio_files && userData1[0].bio_files.firstAids   ?
                    <div className='box2' style={{ display: 'flex', alignItems: 'center', width:'auto' }}>
                      <img src='/icons/paper_black.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>{userData1[0].bio_files.firstAids  }</span>
                    </div>
                  :
                    <div className='box1' style={{ display: 'flex', alignItems: 'center', width:'auto', cursor:'default' }}>
                      <span>Δεν έχει υποβληθεί αρχείο</span>
                    </div>
                  }
                </div>
                <br />
                <br />
                <h2 style={{ textAlign: 'left', marginTop:'70px'  }}>Απόσπασμα ποινικού μητρώου γενικής χρήσης</h2>
                <div style={{ width: 'fit-content', cursor:'pointer'}}>
                  {userData1[0].bio_files && userData1[0].bio_files.poiniko    ?
                    <div className='box2' style={{ display: 'flex', alignItems: 'center', width:'auto' }}>
                      <img src='/icons/paper_black.svg' width='28px' style={{ marginRight: '8px' }} />
                      <span>{userData1[0].bio_files.poiniko   }</span>
                    </div>
                  :
                    <div className='box1' style={{ display: 'flex', alignItems: 'center', width:'auto', cursor:'default' }}>
                      <span>Δεν έχει υποβληθεί αρχείο</span>
                    </div>
                  }
                </div>
              </div>
        </div>

        }

        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'-100px', marginBottom:'100px',gap:'40px' }}>
          <div style={{ width: 'fit-content'}}>
            <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => {setSelectedDate(userData1[0]); navigate('/dates')}}>
              <img src='/icons/person.svg' width='28px' style={{ marginRight: '8px' }} />
              <span>Ραντεβού</span>
            </button>
          </div>
          <div style={{ width: 'fit-content'}}>
            <button className='persona2-button' style={{ display: 'flex', alignItems: 'center', width:'auto' }} onClick={() => navigate('/search')}>
              <img src='/icons/back_black.svg' width='28px' style={{ marginRight: '8px' }} />
              <span>Επιστροφή</span>
            </button>
          </div>
        </div>        

      </div>

        </div>
        :
          <div className='main-content'>
            <img style={{marginLeft:'250px'}} src='/gifs/loading.svg' />
          </div>
      }

      <Footer />

    </div>
  )
}

export default Public_Profile