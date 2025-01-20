import { useNavigate } from 'react-router-dom'
import {useState, useEffect }from 'react'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import React from "react"
import Slider from "react-slick"

import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_APP } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

import StarRatings from 'react-star-ratings'

import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion'
import '../accordion.css' // Import default styles

import Footer from './Footer'

import ScrollButton from './ScrollButton'

import Popup from 'reactjs-popup'
import TimePicker from './TimePicker.jsx'

const CircleWithInitialsProfile = ({ name, surname, size }) => {
  let initials = name[0]+surname[0]
  return (
    <div className="circle-profile-bio"  style={{marginLeft:'auto', marginRight:'auto', width:size, height:size, fontSize:size/2}}>
      {initials}  
  </div>
  )
}


const Root = ({filters, setFilters}) => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState(null)
  const [isProf, setIsProf] = useState('')
  const [clickedProfile, setClickedProfile] = useState(false)
  const [filledDate, setFillDate] = useState(false)

  const [featuredRatings, setFeaturedRatings] = useState([])

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
  const [dhmos, setDhmos] = useState('')

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

  useEffect(() => {
    if (userId) {
      fetchRatings()
    }
  }, [userId])

  const fetchRatings = async () => {
    try {
      const q = query(collection(FIREBASE_DB, 'user_data')) // Query only data matching the user's UID
      const querySnapshot = await getDocs(q)
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      // console.log("user id: ", userId)

      let ratingsList = []
      for (let i=0; i<users.length; i++) {
        if (users[i].ratings) {
          for (let j=0; j<users[i].ratings.length; j++) {
            if (users[i].ratings[j].rating >= 4) {
              console.log(users[i].ratings[j])
              ratingsList.push(users[i].ratings[j])
            }
          }
        }
      }

      if (ratingsList.length === 0 || ratingsList.length === 1 || ratingsList.length === 2) {
        ratingsList = []
      }
      if (ratingsList.length > 3) {
        ratingsList = ratingsList.slice(0, 3);
      }

      setFeaturedRatings(ratingsList)

    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }


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

  let carouselSettings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
  }

  const searchDada = () => {
    let temp = structuredClone(filters)
    temp.hours = hours
    temp.dhmos = dhmos

    console.log(temp)

    setFilters(temp)
    navigate('/search')
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

  return (
    <div>
      <nav className="navbar" id='top'>
        <a href="/" className="logo">
          <img src="/logos/gov_gr_logo.svg" alt="GOV logo" />
        </a>
        <ul className="nav-links">
          <li className="nav-item" style={{backgroundColor:'rgb(206, 205, 205)', borderRadius:'7px'}}><a href="/">Αρχική σελίδα</a></li>
          <li className="nav-item"><a href="/profs">Επαγγελματίες</a></li>
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

      <ScrollButton />

      <div className='aboveFold'>
        <div style={{visibility:'hidden'}}>1</div>

        {/* <h1 style={{marginTop:'100px', marginLeft:'100px'}}>Ntantades feat Kai Cenat</h1> */}

        <div className='main-elements'>
          <div className='personas-buttons'>
            <div style={{display:'flex', flexDirection:'row', gap:'5px'}}>
              <button className='persona1-button' onClick={() => navigate('parent')}>Για γονείς</button>
              <button className='persona2-button' onClick={() => navigate('profs')}>Για επαγγελματίες</button>
            </div>
          </div>
          <div className='searchbar-main'>
    

            <Popup
                trigger={
                  <div className='searchbar-main-icon' style={{marginLeft:'20px'}}>
                    <img src='/icons/calendar_24.png' />
                  </div>
                }
                modal
                nested
                style={{ marginLeft: '250px', width: '500px' }}
              >
                {close => (
                  <div className="modal">
                    <button className="close" onClick={close}>
                      <img src='icons/cancel.svg' />
                    </button>
                    <div className="header1">Συμπληρώστε την επιθυμητή διαθεσιμότητα</div>
                    <TimePicker
                      hours={hours}
                      setHours={setHours}
                    />
                    <div className="actions">

                      <button
                        style={{ marginTop: '20px', marginLeft: 'auto', marginRight: '30px' }}
                        className="persona1-button"
                        onClick={() => {
                          setFillDate(true)
                          close()
                        }}
                      >
                        Εφαρμογή
                      </button>
                      <button
                        style={{ marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}
                        className="persona2-button"
                        onClick={() => {
                          console.log('cancel')
                          setHours({
                            "friday-end": 16,
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
                          close()
                        }}
                      >
                        Ακύρωση
                      </button>
                    </div>
                  </div>
                )}
              </Popup>

            <div style={{display:'flex', alignItems:'center', color:'rgba(0, 0, 0, 1.0)'}}>
              <input
                className='searchbar-main-input'
                placeholder='Ημέρες / Ώρες'
                disabled="disabled"
                value={filledDate ? 'Επιλέξατε διαθεσιμότητα' : ''}
              />
            </div>
            <div className="verticalLine">
            </div>
            <div className='searchbar-main-icon' >
              <img src='/icons/location_32.png' />
            </div>
            <div style={{display:'flex', alignItems:'center'}} className='searchbar-main-input'>
            <select 
            onChange={(e) => {setDhmos(e.target.value)}}
            name="cars"
            id="sex-field"
            style={{
              backgroundColor: 'transparent',
              // border: 'none',
              fontSize: '1.125rem',
              color: '#535353',
              fontWeight: '600',
              padding: '0px 10px'
            }}>
              <option value="">Επιλέξτε Δήμο...</option>
              <option value="Athena">Δήμος Αθηναίων</option>
              <option value="Aigina">Δήμος Αίγινας</option>
              <option value="Peristeri">Δήμος Περιστερίου</option>
              <option value="Galatsi">Δήμος Γαλατσίου</option>
              <option value="Zografou">Δήμος Ζωγράφου</option>
              <option value="Irakleiou">Δήμος Ηρακλείου</option>
            </select>
            </div>
            <div className='searchbar-main-icon' style={{marginLeft:'70px'}} onClick={searchDada}>
              <img src='/icons/search_24.png' />
            </div>
          </div>
        </div>
      </div>  {/*End of above the fold elements*/}
      <div style={{textAlign:'center'}} id='diadikasia_prof'>
        <div style={{margin:'0 auto', paddingBottom:'100px'}}>
          <div className='diadikasia-text'>Διαδικασία αναζήτησης επαγγελματία</div>
          <hr style={{width:'10%', marginBottom:'30px'}} />
          {/* <img src='rizz1.png' style={{width:'60%'}}/> */}
          <div className='directions-main'>
            <div className='directions-element'>
              <div className='numberCircle'>1</div>
              <div className='odigia-title'>
                Πληροφόρηση
                <hr style={{width:'80%'}} />
              </div>
              <div className='odigia-text'>
                Ενημερωθείτε για τα κριτήρια επιλεξιμότητας και την διαδικασία εγγραφής στην υπηρεσία
              </div>
            </div>
            <div className='directions-element' style={{backgroundColor: '#7dcfff'}}>
              <div className="arrow-right"></div>
              <div className='numberCircle'>2</div>
              <div className='odigia-title'>
                Αναζήτηση
                <hr style={{width:'80%'}} />
              </div>
              <div className='odigia-text'>
                Βρείτε τον κατάλληλο επαγγελματία για εσάς με βάση κατάλληλα κριτήρια.
              </div>
            </div>
            <div className='directions-element'>
              <div className="arrow-right" style={{borderLeft: '32px solid #7dcfff'}}></div>
                <div className='numberCircle'>3</div>
                <div className='odigia-title'>
                  Ραντεβού
                  <hr style={{width:'80%'}} />
                </div>
                <div className='odigia-text'>
                  Κλείστε ραντεβού γνωριμίας με τον επαγγελματία πριν την συνεργασία.
                </div>
            </div>
            <div className='directions-element' style={{backgroundColor: '#7dcfff'}}>
              <div className="arrow-right"></div>
              <div className='numberCircle'>4</div>
              <div className='odigia-title'>
                Αίτηση
                <hr style={{width:'80%'}} />
              </div>
              <div className='odigia-text'>
                Συμπληρώστε την αίτηση συνεργασίας.
              </div>
            </div>
            <div className='directions-element'>
              <div className="arrow-right" style={{borderLeft: '32px solid #7dcfff'}}></div>
              <div className='numberCircle'>5</div>
              <div className='odigia-title'>
                Συμφωνητικό
                <hr style={{width:'80%'}} />
              </div>
              <div className='odigia-text'>
                Συνάψτε και υπογράψτε το συμφωνητικό συνεργασίας.
              </div>
            </div>
            <div className='directions-element' style={{backgroundColor: '#7dcfff'}}>
              <div className="arrow-right"></div>
              <div className='numberCircle'>6</div>
              <div className='odigia-title'>
                Πληρωμή
                <hr style={{width:'80%'}} />
              </div>
              <div className='odigia-text'>
                Πραγματοποιήστε τις πληρωμές μέσω voucher.
              </div>
            </div>
          </div>
        </div>
        <div style={{margin:'0 auto'}}>
        <div className='diadikasia-text'>Διαδικασία εύρεσης εργασίας</div>
        <hr style={{width:'10%', marginBottom:'30px'}} />
          {/* <img src='rizz1.png' style={{width:'60%'}}/> */}
          <div className='directions-main' style={{marginBottom:'200px'}}>
            <div className='directions-element'>
              <div className='numberCircle'>1</div>
              <div className='odigia-title'>
                Πληροφόρηση
                <hr style={{width:'80%'}} />
              </div>
              <div className='odigia-text'>
                Ενημερωθείτε για τα κριτήρια επιλεξιμότητας και την διαδικασία εγγραφής στην υπηρεσία
              </div>
            </div>
            <div className='directions-element' style={{backgroundColor: '#7dcfff'}}>
              <div className="arrow-right"></div>
              <div className='numberCircle'>2</div>
              <div className='odigia-title'>
                Βιογραφικό
                <hr style={{width:'80%'}} />
              </div>
              <div className='odigia-text'>
                Δημιουργήστε βιογραφικό με τις προσωπικές σας πληροφορίες.
              </div>
            </div>
            <div className='directions-element'>
              <div className="arrow-right" style={{borderLeft: '32px solid #7dcfff'}}></div>
                <div className='numberCircle'>3</div>
                <div className='odigia-title'>
                  Αγγελία
                  <hr style={{width:'80%'}} />
                </div>
                <div className='odigia-text'>
                  Δημιουργήστε την προσωπική σας αγγελία.
                </div>
            </div>
            <div className='directions-element' style={{backgroundColor: '#7dcfff'}}>
              <div className="arrow-right"></div>
              <div className='numberCircle'>4</div>
              <div className='odigia-title'>
                Ραντεβού
                <hr style={{width:'80%'}} />
              </div>
              <div className='odigia-text'>
                Συναντηθείτε και γνωριστείτε με τον γονέα.
              </div>
            </div>
            <div className='directions-element'>
              <div className="arrow-right" style={{borderLeft: '32px solid #7dcfff'}}></div>
              <div className='numberCircle'>5</div>
              <div className='odigia-title'>
                Συμφωνητικό
                <hr style={{width:'80%'}} />
              </div>
              <div className='odigia-text'>
                Συνάψτε και υπογράψτε το συμφωνητικό συνεργασίας.
              </div>
            </div>
            <div className='directions-element' style={{backgroundColor: '#7dcfff'}}>
              <div className="arrow-right"></div>
              <div className='numberCircle'>6</div>
              <div className='odigia-title'>
                Πληρωμή
                <hr style={{width:'80%'}} />
              </div>
              <div className='odigia-text'>
                Λάβετε κάθε μήνα το voucher για την πληρωμή σας.
              </div>
            </div>
          </div>
        </div>

        <div className='diadikasia-text' style={{marginBottom:'10px'}}>Αξιολογήσεις</div>
        <hr style={{width:'10%', marginBottom:'30px'}} />
        {/*https://kenwheeler.github.io/slick/*/}

        { featuredRatings  &&
        <Slider {...carouselSettings} style={{margin:'0 auto', marginBottom:'200px', width:'70%'}}>
          { featuredRatings.map((el) => {
            return (
              <div className='slide' style={{display:'flex', flexDirection:'column', textAlign:'left'}}>
                <StarRatings
                  rating={el.rating}
                  starRatedColor="gold"
                  starDimension="30px"
                  starSpacing="5px"
                  numberOfStars={5}
                  name='rating'
                  style={{alignItems:'left'}}
                />

                <div style={{margin:'0 auto', justifyContent:'center',   maxWidth:'fit-content', marginLeft:'auto', marginRight:'auto'}}>

                <h2 style={{textAlign:'left'}}>{el.title}</h2>
                <h4 style={{textAlign:'left', marginTop:'-20px'}}>{el.content}</h4>

                <div style={{display:'flex', flexDirection:'row'}}>
                  <div style={{marginRight:'10px', textAlign:'left'}}>
                    {/* <img src='icons/pfp.svg' width={48} /> */}
                    <CircleWithInitialsProfile name={el.author.split(" ")[0]} surname={el.author.split(" ")[1]} size={48} />
                  </div>
                  <div>
                    <div>
                      {el.author}
                    </div>
                    <div style={{textAlign:'left'}}>
                      <FormattedTimestamp timestamp={el.review_date} />
                    </div>
                  </div>
                </div>

                </div>
              </div>
            )

        })}
        </Slider>
      }




        <div className='diadikasia-text' style={{marginBottom:'10px'}}>Συχνές ερωτήσεις</div>
        <hr style={{width:'10%', marginBottom:'30px'}} />
        <Accordion allowZeroExpanded>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>
                Ποιοι έχουν δικαίωμα εγγραφής στο Μητρώο Επιμελητών/τριών;
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>
              ✓ έχουν συμπληρώσει το 18ο έτος της ηλικίας τους, <br />
              ✓ είναι Έλληνες ή αλλοδαποί πολίτες, που διαμένουν νόμιμα στην Ελλάδα και
              έχουν πρόσβαση στην αγορά εργασίας, και <br />
              ✓ πληρούν τις προϋποθέσεις της υπ’ αριθμ: 41866/24-04-2023 Τροποποίηση
              Πρόσκλησης Εκδήλωσης Ενδιαφέροντος προς υποψήφιους/ες
              Επιμελητές/τριες που είναι διαθέσιμη στην ιστοσελίδα του Έργου
              ntantades.gov.gr.
              </p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>
                Ο τόπος διαμονής μου αποτελεί προϋπόθεση για την εγγραφή μου στο
                Μητρώο Επιμελητών/τριών;
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>
              Θα πρέπει να είστε σίγουρος ότι μπορείτε να παράσχετε τις υπηρεσίες σας στους
              δήμους που θα εφαρμοστεί το πρόγραμμα. Δηλαδή ότι μπορείτε να μεταβαίνετε
              καθημερινά στο σπίτι του παιδιού από το σπίτι σας και να παράσχετε τις
              υπηρεσίες σας.
              </p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>
              Πόσο χρόνο διαρκεί η διαδικασία εξέτασης της αίτησης εγγραφής μου στο
              Μητρώο Επιμελητών/τριών;
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>
              Εντός διαστήματος δέκα (10) εργάσιμων ημερών, από την οριστική υποβολή της
              αίτησης, διενεργείται από τη ΓΓΔΟΠΙΦ ο ουσιαστικός έλεγχος των
              υποβληθέντων στοιχείων και δικαιολογητικών και, όπου απαιτείται, η
              διασταύρωση αυτών, μέσω της άντλησης των απαιτούμενων δεδομένων, από το
              Κέντρο Διαλειτουργικότητας της Γενικής Γραμματείας Πληροφοριακών
              Συστημάτων Δημόσιας Διοίκησης του Υπουργείου Ψηφιακής Διακυβέρνησης.
              </p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>
              Εάν η αίτησή μου απορριφθεί, μπορώ να υποβάλλω νέα αίτηση;
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>
              Ναι, εφόσον εκλείψουν οι λόγοι απόρριψης έτσι ώστε να πληρούνται οι όροι
              και οι προϋποθέσεις εγγραφής στο Μητρώο Επιμελητών/τριών.
              </p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>
              Εργάζομαι ήδη. Μπορώ να κάνω αίτηση εγγραφής στο Μητρώο
              Επιμελητών/τριών;
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>
              Ναι, μπορείτε, εφόσον σας το επιτρέπει το ωράριο εργασίας σας και πληροίτε
              τα κριτήρια.
              </p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>
              Πόσο χρόνο διαρκεί η διαδικασία εξέτασης της αίτησης εγγραφής μου στο
              Μητρώο Επιμελητών/τριών;
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>
              Εντός διαστήματος δέκα (10) εργάσιμων ημερών, από την οριστική υποβολή της
              αίτησης, διενεργείται από τη ΓΓΔΟΠΙΦ ο ουσιαστικός έλεγχος των
              υποβληθέντων στοιχείων και δικαιολογητικών και, όπου απαιτείται, η
              διασταύρωση αυτών, μέσω της άντλησης των απαιτούμενων δεδομένων, από το
              Κέντρο Διαλειτουργικότητας της Γενικής Γραμματείας Πληροφοριακών
              Συστημάτων Δημόσιας Διοίκησης του Υπουργείου Ψηφιακής Διακυβέρνησης.
              </p>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>

  
        <Footer />


      </div>
    </div>
  )
}

export default Root