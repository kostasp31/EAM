import React from 'react'
import Footer from "./Footer.jsx"
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_APP } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'

import StarRatings from 'react-star-ratings'

import MyDoughnutChart from './MyDoughnutChart.jsx'

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


const Ratings = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState(null)
  const [isProf, setIsProf] = useState('')
  const [clickedProfile, setClickedProfile] = useState(false)

  const [meanRating, setMeanRating] = useState(null)
  
  const [tab, setTab] = useState('recent')

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

      if (users[0] && users[0].user_category === 'professional') {
        setIsProf('professional')
        let count = 0
        if (users[0].ratings) {
          for (let i=0; i<users[0].ratings.length; i++) {
            count += users[0].ratings[i].rating
          }
          setMeanRating(count / users[0].ratings.length)
        }
        setMeanRating(0)
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

  const CircleWithInitialsRev = ({ name, surname }) => {
    let initials = name[0]+surname[0]
    return (
      <div className="circle-profile-review">
        {initials}  
      </div>
    )
  }

  const style1 = {borderBottom:'1px solid #000000', padding:'0px 10px 5px 10px', cursor:'pointer'}
  const style2 = {borderBottom:'1px solid #c4c4c4', padding:'0px 10px 5px 10px', cursor:'pointer'}

  if (userData[0] && userData[0].ratings) {
    if (tab === 'recent') {
      userData[0].ratings.sort((a, b) => b.review_date - a.review_date)
    }
    else if (tab === 'best') {
      userData[0].ratings.sort((a, b) => b.rating - a.rating)
    }
    else {
      userData[0].ratings.sort((a, b) => a.rating - b.rating)
    }
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
        <a href="/colabs_profs"><span style={{verticalAlign:'middle'}}><img src='icons/arrows.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Συνεργασίες</a>
        <a href="/dates_profs"><span style={{verticalAlign:'middle'}}><img src='icons/users.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ραντεβού</a>
        <a href="/notifs_profs"><span style={{verticalAlign:'middle'}}><img src='icons/bell.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Ειδοποιήσεις</a>
        <a href="/profile_profs"><span style={{verticalAlign:'middle'}}><img src='icons/person.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Προφίλ</a>
        <a href="/ratings" style={{backgroundColor:'rgb(50, 165, 154)'}}><span style={{ verticalAlign: 'middle' }}><img src='icons/thumbs.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Αξιολογήσεις</a>     
        <a href="/help" style={{borderBottom:'1px solid white'}}><span style={{verticalAlign:'middle'}}><img src='icons/help.svg' style={{width:'28px', height:'28px', paddingRight:'10px'}} /></span>Βοήθεια</a>
      </div>

      <div style={{ paddingLeft: '270px', paddingTop: '90px' }}>
        <div style={{ height: '15px', alignItems: 'left' }}>
          <a href='/'>Aρχική σελίδα</a>
          {'  >  '}
          <a href='/profs'>Επαγγελματίες</a>
          {'  >  Αξιολογήσεις'}
        </div>
        <h1 style={{ marginTop: "35px" }}>&emsp;Αξιολογήσεις</h1>
        <hr style={{color:'turquoise', backgroundColor:'turquoise', border:'none', height:'4px', width:'90px', float:'left', marginTop:'-20px', marginLeft:'30px'}} />
      </div>

      {(userData[0] && userId && userData[0].user_category === "professional") ?
        userData[0].ratings && meanRating ?
        <div style={{marginLeft:'250px'}}>
          {/* <div className='box1' style={{marginTop:'100px', marginBottom:'100px'}}> */}
          <div className='box1' style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
            <div>
              <div style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
                <div style={{width:'250px', height:'250px', marginBottom:'30px'}}>
                  <MyDoughnutChart rating={meanRating} style={{paddingBottom:'5px'}} />
                </div>
                {<b style={{position:'absolute', marginLeft:'90px', marginTop:'-164px', fontWeight:'700', fontSize:'22px'}}>{meanRating.toFixed(1)}/5.0</b>}

                <div style={{marginLeft:'5px'}}>
                  <StarRatings
                    rating={meanRating}
                    starRatedColor="gold"
                    starDimension="40px"  
                    starSpacing="5px"
                    numberOfStars={5}
                    name='rating'
                  />
                </div>
              </div>

            </div>            
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:'40px', marginTop:'100px', marginBottom:'60px',alignItems:'left', alignContent:'left', marginLeft:'150px'}}>
            <div style={{}}>
              <span style={tab === 'recent' ? style1 : style2} onClick={() => setTab('recent')}>
                Πιο πρόσφατες
              </span>
              <span style={tab === 'best' ? style1 : style2 } onClick={() => setTab('best')}>
                Θετικές
              </span>
              <span style={tab === 'worst' ? style1 : style2} onClick={() => setTab('worst')}>
                Αρνητικές
              </span>
            </div>
          </div>

            <div style={{marginBottom:'100px'}}>
              {userData[0].ratings.map((rev) => {
                let initials = rev.author.split(" ")
                return (
                <div className='box1' style={{height:'fit-content', marginBottom:'50px', display:'flex', flexDirection:'row', marginRight:'200px', marginLeft:'200px'}}>
                  <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto'}}>
                    <CircleWithInitialsRev name={initials[0]} surname={initials[1]}/>
                  </div>
                  <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto', marginLeft:'60px'}}>
                    <div style={{display:'flex', flexDirection:'column'}}>
                      <div style={{fontSize:'20px', fontWeight:'600', marginBottom:'5px'}}>
                        <div style={{width:'fit-content'}}>
                          <div>
                            {rev.author}  
                          </div>
                          <hr style={{marginTop:'-3px'}} />
                        </div>
                      </div>
                      <div style={{fontSize:'20px', fontWeight:'600'}}>
                        {rev.title}
                      </div>
                      <div style={{fontSize:'16px'}}>
                        {rev.content}
                      </div>
                    </div>
                  </div>
                  <div style={{height:'fit-content', marginTop:'auto', marginBottom:'auto', marginLeft:'auto'}}>
                    <div style={{display:'flex', flexDirection:'column'}}>
                      <div style={{fontSize:'20px', color:'#616161', marginLeft:'auto', marginBottom:'30px'}}>
                        <FormattedTimestamp timestamp={rev.review_date} />
                      </div>
                      <div className=''>
                        <StarRatings
                          rating={rev.rating}
                          starRatedColor="gold"
                          starDimension="30px"  
                          starSpacing="5px"
                          numberOfStars={5}
                          name='rating'
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                  </div>
                  <div>
                  </div>
                </div>
                )
              })}
            </div>
        </div>
        :
        <div className='main-content' style={{marginBottom:'500px'}}>
          <div style={{marginLeft:'250px'}}>
            <h1 style={{ marginTop: "35px" }}>&emsp;Δεν υπάρχουν αξιολογήσεις</h1>
            <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' }}>
            </div>
          </div>
        </div>
      :
      (isProf === 'parent') ?
        <div className='main-content' style={{height:'20vh',marginBottom:'500px'}}>
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

export default Ratings