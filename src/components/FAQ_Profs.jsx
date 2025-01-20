import Footer from "./Footer"
import ScrollButton from "./ScrollButton"
import "../help.css"

import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion'
import '../accordion.css' // Import default styles  

import { useNavigate } from "react-router"
import { useState, useEffect } from "react"

import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_APP } from '../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'

const FAQ_Profs = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState(null)
  const [isProf, setIsProf] = useState('')
  const [clickedProfile, setClickedProfile] = useState(false)

  const [submittedDate, setSubmittedDate] = useState(false)

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
  }, [userId, submittedDate])

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

  return (
    <div>
      <nav className="navbar" style={{marginBottom:'100px'}}>
        <a href="/" className="logo">
          <img src="/logos/gov_gr_logo.svg" alt="GOV logo" />
        </a>
        <ul className="nav-links">
          <li className="nav-item"><a href="/">Αρχική σελίδα</a></li>
          <li className="nav-item"><a href="/profs">Επαγγελματίες</a></li>
          <li className="nav-item"><a href="/parent">Γονείς</a></li>
          {/* <li className="nav-item"><a href="/announcements">Ανακοινώσεις</a></li> */}
          <li className="nav-item" style={{backgroundColor:'rgb(206, 205, 205)', borderRadius:'7px'}}><a href="/help">Βοήθεια</a></li>
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

      <div style={{paddingBottom:'0px'}}>
        <div className='main-heading' style={{paddingTop:'150px'}}>
          Συχνές ερωτήσεις - Επαγγελματίες
        </div>
        <hr style={{width:'50%'}}/>
        <div className='heading' style={{paddingBottom:'100px'}}>
          Ερωτήσεις και απαντήσεις για τη χρήση της πλατφόρμας
        </div>

        <Accordion allowZeroExpanded >
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>
                Ποιοι έχουν δικαίωμα εγγραφής στο Μητρώο Επιμελητών/τριών;
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>
              Όσοι έχουν συμπληρώσει το 18ο έτος της ηλικίας τους,
              είναι Έλληνες ή αλλοδαποί πολίτες που διαμένουν νόμιμα στην Ελλάδα και
              έχουν πρόσβαση στην αγορά εργασίας, και
              πληρούν τις προϋποθέσεις της υπ’ αριθμ: 41866/24-04-2023 Τροποποίησης
              της Πρόσκλησης Εκδήλωσης Ενδιαφέροντος προς υποψήφιους/ες
              Επιμελητές/τριες που είναι διαθέσιμη στην ιστοσελίδα του Έργου
              ntantades.gov.gr.
              </p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>
              Πώς μπορώ να εγγραφώ στο Μητρώο Επιμελητών/τριών;
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>
              Για την εγγραφή σας στο Μητρώο, θα μεταβείτε στην ηλεκτρονική διεύθυνση
              ntantades.gov.gr «Εγγραφή στο μητρώο επιμελητών (επιμελητή/τρια)» και με τη
              χρήση των κωδικών σας taxisnet θα υποβάλλετε ηλεκτρονικά την αίτησή σας. Εκεί
              υπάρχουν και αναλυτικές οδηγίες για την υποβολή της αίτησης.

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
              Εντός διαστήματος δέκα 10 εργάσιμων ημερών, από την οριστική υποβολή της
αίτησης, διενεργείται από τη ΓΓΙΑΔ ο ουσιαστικός έλεγχος των υποβληθέντων
στοιχείων και δικαιολογητικών και, όπου απαιτείται, η διασταύρωση αυτών, μέσω
της άντλησης των απαιτούμενων δεδομένων, από το Κέντρο Διαλειτουργικότητας
της Γενικής Γραμματείας Πληροφοριακών Συστημάτων Δημόσιας Διοίκησης του
Υπουργείου Ψηφιακής Διακυβέρνησης.
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
              Ναι, εφόσον εκλείψουν οι λόγοι απόρριψης έτσι ώστε να πληρούνται οι όροι και
οι προϋποθέσεις εγγραφής στο Μητρώο Επιμελητών/τριών.

              </p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>
              Τα προσωπικά δεδομένα που περιέχονται στην αίτησή μου προστατεύονται;
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>
              Ναι, τα προσωπικά σας δεδομένα προστατεύονται σύμφωνα με το Ν. 4624/2019
(ΦΕΚ 137/Α/2019) «Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα, μέτρα
εφαρμογής του Κανονισμού (ΕΕ) 2016/679 του Ευρωπαϊκού Κοινοβουλίου και του
Συμβουλίου της 27ης Απριλίου 2016 για την προστασία των φυσικών προσώπων
έναντι της επεξεργασίας δεδομένων προσωπικού χαρακτήρα και ενσωμάτωση στην
εθνική νομοθεσία της Οδηγίας (ΕΕ) 2016/680 του Ευρωπαϊκού Κοινοβουλίου και του
Συμβουλίου της 27ης Απριλίου 2016 και άλλες διατάξεις», όπως κάθε φορά ισχύει.
              </p>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>
              Υπάρχει δυνατότητα επικοινωνίας για επιπλέον διευκρινίσεις;
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>
              Για οποιαδήποτε περαιτέρω διευκρίνιση κι επίλυση τυχόν προβλημάτων των
αιτούντων, διατίθεται υπηρεσία Helpdesk (τηλ.: 210 3258 080, 210 3258 090, e-mail:
ntantades@yeka.gr
              </p>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      </div>

      <div style={{ width: 'fit-content', marginLeft: 'auto', marginRight: 'auto', marginBottom:'100px', marginTop:'-100px' }}>
        <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={() => navigate('/help')}>
          <img src='/icons/back.svg' width='28px' style={{ marginRight: '8px' }} />
          <span>Επιστροφή</span>
        </button>
      </div>

      <Footer />
    </div>

  )
}

export default FAQ_Profs