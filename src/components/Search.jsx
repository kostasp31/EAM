import React from 'react'
import Footer from "./Footer.jsx"
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_APP } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs, doc  } from 'firebase/firestore'

import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'

const DisplayStars = ({ n }) => {
  const render = () => {
    return Array.from({ length: n }, (_, i) => (
      <img style={{width:'24px', height:'24px'}} src='/icons/star_24.png' />
    ));
  }
  return <div>{render()} <h4 style={{marginTop:'0px', marginBottom:'0px'}}>{n} / 5.0</h4></div>;
}

const Search = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState(null)
  const [isProf, setIsProf] = useState('')
  const [clickedProfile, setClickedProfile] = useState(false)

  const [apasxolisi, setApasxolisi] = useState('')
  const [dhmos, setDhmos] = useState('')
  const [topothesia, setTopothesia] = useState('')
  const [age_start, setAge_start] = useState('')
  const [age_end, setAge_end] = useState('')

  const [rating1, setRating1] = useState(true)
  const [rating2, setRating2] = useState(true)
  const [rating3, setRating3] = useState(true)
  const [rating4, setRating4] = useState(true)
  const [rating5, setRating5] = useState(true)

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

  let ageOptions = []
  for (let i=18; i<=65; i++){
    ageOptions.push(i)
  }

  const submitFilters = async (e) => {
    try {
      const conditions = [
        where('user_category', '==', 'professional'),
      ]
      if (apasxolisi.length) {
        conditions.push(where('ad.jobType', '==', apasxolisi))
      }
      if (topothesia.length) {
        conditions.push(where('ad.location', '==', topothesia))
      }

      const q = query(
        collection(FIREBASE_DB, 'user_data'),
        ...conditions
      )
      const querySnapshot = await getDocs(q)
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      console.log(users)

      let users_real = users
      if (age_start !== '' && age_end !== '') 
        users_real = users.filter((el) => {el.age >= age_start && el.age <= age_end})

      // console.log("user id: ", userId)
      console.log("user data: ", users_real)
      // setUserData(users)


    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

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


      <div class="sidenav">
        <a href="/parent" ><span style={{verticalAlign:'middle'}}><img src='icons/home.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αρχική σελίδα</a>
        <a href="/search" style={{backgroundColor:'rgb(72,124,116)'}}><span style={{verticalAlign:'middle'}}><img src='icons/search.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αναζήτηση</a>
        <a href="/applications"><span style={{verticalAlign:'middle'}}><img src='icons/paper.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Αιτήσεις</a>
        <a href="/colabs"><span style={{verticalAlign:'middle'}}><img src='icons/arrows.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Συνεργασίες</a>
        <a href="/dates"><span style={{verticalAlign:'middle'}}><img src='icons/users.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ραντεβού</a>
        <a href="/notifs"><span style={{verticalAlign:'middle'}}><img src='icons/bell.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ειδοποιήσεις</a>
        <a href="/profile"><span style={{verticalAlign:'middle'}}><img src='icons/person.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Προφίλ</a>
        <a href="/help" style={{borderBottom:'1px solid white'}}><span style={{verticalAlign:'middle'}}><img src='icons/help.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Βοήθεια</a>
      </div>

      <div style={{ marginTop: "90px", marginLeft: "300px", height:'15px'}}>
        <a href='/'>Aρχική σελίδα</a>
        {'  >  '}
        <a href='/parent'>Γονείς</a>
        {'  >  Αναζήτηση'}
      </div>
      <h1 style={{ marginTop: "35px", marginLeft: "300px"}}>&emsp;Αναζήτηση</h1>

      {(userData[0] && userId && userData[0].user_category === "parent") ?
        <div style={{display:'flex'}}>
          <div className='box' style={{width: "300px",height: "1000px",marginTop: "50px",marginLeft:"450px",marginRight: "100px", marginBottom:"50px"}}>
            <h2 style={{textAlign:'center', paddingBottom:'10px'}}>Φίλτρα</h2>
            <form>
              <div>
                <h4>Απασχόληση</h4>
                <label>Μερική</label>
                <input style={{marginLeft:'7px'}} type='radio' name='time' value="partial" onChange={(e) => setApasxolisi(e.target.value)}></input>
                <br/>
                <label>Πλήρης</label>
                <input type='radio' name='time' value="full" onChange={(e) => setApasxolisi(e.target.value)}></input>
                
                <hr />

                <h4>Δήμος</h4>
                <select style={{padding:'7px', width:'300px', borderRadius:'6px'}} value={dhmos} onChange={(e) => setDhmos(e.target.value)}>
                  <option value="" disabled="disabled" hidden>Επιλέξτε Δήμο...</option>
                  <option value="Athena">Δήμος Αθηναίων</option>
                  <option value="Aigina">Δήμος Αίγινας</option>
                  <option value="Peristeri">Δήμος Περιστερίου</option>
                  <option value="Galatsi">Δήμος Γαλατσίου</option>
                  <option value="Zografou">Δήμος Ζωγράφου</option>
                  <option value="Irakleiou">Δήμος Ηρακλείου</option>
                </select>

                <hr />

                <h4>Τοποθεσία εργασίας</h4>
                <label>Σπίτι Γονέα</label>
                <input style={{marginLeft:'99px'}} type='radio' name='place' value="parent" onChange={(e) => setTopothesia(e.target.value)}></input>
                <br />
                <label>Σπίτι Επαγγελματία</label>
                <input style={{marginLeft:'40px'}} type='radio' name='place' value="professional" onChange={(e) => setTopothesia(e.target.value)}></input>

                <hr />
                
                <h4>Ηλικία επαγγελματία</h4>
                <select style={{padding:'7px', width:'45%', borderRadius:'6px',marginRight:'20px'}} value={age_start} onChange={(e) => setAge_start(e.target.value)}>
                  <option value="" hidden>Από</option>
                  {ageOptions.map((age) => (
                    <option key={age}>
                      {age}
                    </option>
                  ))}
                </select>
                <select style={{padding:'7px', width:'45%', borderRadius:'6px'}} value={age_end} onChange={(e) => setAge_end(e.target.value)}>
                <option value="" hidden>Μέχρι</option>
                {ageOptions.map((age) => (
                    <option key={age}>
                      {age}
                    </option>
                  ))}
                </select>

                <hr />

                <h4>Διαθεσιμότητα</h4>
                <button className='custom-button'>
                  <img style={{marginLeft:'30px', marginTop:'12px' }} src='/icons/calendar_24.png' />
                  <h4 style={{marginLeft:'30px', }}>Επιλέξτε διαθεσιμότητα</h4>
                </button>

                <hr />

                <h4>Αξιολόγηση</h4>
                <img src='/icons/star_24.png' />
                <input style={{marginLeft:'150px'}} type='checkbox' checked={rating1} onChange={(e) => {setRating1(!rating1)}}></input>
                <br />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <input style={{marginLeft:'126px'}} type='checkbox' checked={rating2} onChange={(e) => {setRating2(!rating2)}}></input>
                <br />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <input style={{marginLeft:'102px'}} type='checkbox' checked={rating3} onChange={(e) => {setRating3(!rating3)}}></input>
                <br />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <input style={{marginLeft:'78px'}} type='checkbox' checked={rating4} onChange={(e) => {setRating4(!rating4)}}></input>
                <br />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <img src='/icons/star_24.png' />
                <input style={{marginLeft:'54px'}} type='checkbox' checked={rating5} onChange={(e) => {setRating5(!rating5)}}></input>
              </div>
            </form>
            <div style={{ width: 'fit-content', marginLeft:'auto', marginRight:'auto', marginTop:'60px', marginBottom:'30px'}}>
              <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={(e) => {e.preventDefault(); submitFilters()}}>
                <img src='icons/filter.svg' width='28px' style={{ marginRight: '8px' }} />
                <span>Εφαρμογή φίλτρων</span>
              </button>
            </div>
          </div>
          <div style={{display:'block', width:"60%"}}>
            <div className='box' style={{display:'flex',height: "150px",padding:'20px',marginTop: "50px",marginLeft:"50px",marginRight: "150px", marginBottom:"50px"}}>
              <img style={{padding:'20px'}} src='data:image/jpeg;base64,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'/>
              <div style={{display:'block', width:'65%'}}>
                <h2 style={{marginTop:'0px', marginRight:'auto'}}>[Ονοματεπώνυμο]</h2>
                <DisplayStars n={4.1} />
                <a className='button-purple' style={{marginLeft:'300px'}}>Προβολή</a>
                <a className='button-purple' style={{}}>Ραντεβού</a>
              </div>
              <img src="icons/location.svg" style={{width:'32px', height:'32px'}}></img>
              <h3 style={{marginTop:'4px'}}>Δήμος Αθηναίων</h3>
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

      <Footer style={{marginTop:'20px'}}/>

    </div>  
  )
}

export default Search 