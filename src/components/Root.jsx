import { useNavigate } from 'react-router-dom'
import {useState }from 'react'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import React from "react"
import Slider from "react-slick"

import StarRatings from 'react-star-ratings'

import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion'
import '../accordion.css' // Import default styles

import Footer from './Footer'

const Root = () => {
  const navigate = useNavigate()

  let carouselSettings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
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
          <li className="nav-item"><a href="/announcements">Ανακοινώσεις</a></li>
          <li className="nav-item"><a href="/help">Βοήθεια</a></li>
          <li className="nav-item"><a href="/login">Σύνδεση</a></li>
          {/* <li className="nav-item-log"><a href="/re gister">Εγγραφή</a></li> */}
        </ul>
      </nav>

      <ScrollButton />

      <div className='aboveFold'>
        <div style={{visibility:'hidden'}}>1</div>

        <div className='main-elements'>
          <div className='personas-buttons'>
            <div style={{display:'flex', flexDirection:'row', gap:'5px'}}>
              <button className='persona1-button' onClick={() => navigate('parent')}>Για γονείς</button>
              <button className='persona2-button' onClick={() => navigate('prof')}>Για επαγγελματίες</button>
            </div>
          </div>
          <div className='searchbar-main'>
            <div className='searchbar-main-icon' style={{marginLeft:'20px'}}>
              <img src='/icons/calendar_24.png' />
            </div>
            <div style={{display:'flex', alignItems:'center'}}>
              <input
                className='searchbar-main-input'
                placeholder='Ημέρες / Ώρες'
              />
            </div>
            <div className="verticalLine">
            </div>
            <div className='searchbar-main-icon'>
              <img src='/icons/location_32.png' />
            </div>
            <div style={{display:'flex', alignItems:'center'}}>
              <input
                className='searchbar-main-input'
                placeholder='Τοποθεσία'
              />
            </div>
            <div className='searchbar-main-icon' style={{marginRight:'20px'}}>
              <img src='/icons/search_24.png' />
            </div>
          </div>
        </div>
      </div>  {/*End of above the fold elements*/}
      <div style={{textAlign:'center'}}>
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
                  Αγγελλία
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
        <Slider {...carouselSettings} style={{margin:'0 auto', marginBottom:'200px', width:'70%'}}>
          <div className='slide' style={{display:'flex', flexDirection:'column', textAlign:'left'}}>
            <StarRatings
              rating={3.5}
              starRatedColor="gold"
              starDimension="30px"
              starSpacing="5px"
              numberOfStars={5}
              name='rating'
              style={{alignItems:'left'}}
            />

            <div style={{margin:'0 auto', justifyContent:'center',   maxWidth:'fit-content', marginLeft:'auto', marginRight:'auto'}}>

            <h2 style={{textAlign:'left'}}>Καλή δουλειά</h2>
            <h4 style={{textAlign:'left'}}>Θα προτιμούσα πιο ευέλικτο ωράριο</h4>

            <div style={{display:'flex', flexDirection:'row'}}>
              <div style={{marginRight:'10px', textAlign:'left'}}>
                <img src='icons/pfp.svg' width={48} />
              </div>
              <div>
                <div>
                  Περικλής Εξηντάρης
                </div>
                <div style={{textAlign:'left'}}>
                  27/05/2024
                </div>
              </div>
            </div>

            </div>
          </div>
          <div className='slide' style={{display:'flex', flexDirection:'column', textAlign:'left'}}>
            <StarRatings
              rating={3.5}
              starRatedColor="gold"
              starDimension="30px"
              starSpacing="5px"
              numberOfStars={5}
              name='rating'
              style={{alignItems:'left'}}
            />

            <div style={{margin:'0 auto', justifyContent:'center',   maxWidth:'fit-content', marginLeft:'auto', marginRight:'auto'}}>

            <h2 style={{textAlign:'left'}}>Καλή δουλειά</h2>
            <h4 style={{textAlign:'left'}}>Θα προτιμούσα πιο ευέλικτο ωράριο</h4>

            <div style={{display:'flex', flexDirection:'row'}}>
              <div style={{marginRight:'10px', textAlign:'left'}}>
                <img src='icons/pfp.svg' width={48} />
              </div>
              <div>
                <div>
                  Περικλής Εξηντάρης
                </div>
                <div style={{textAlign:'left'}}>
                  27/05/2024
                </div>
              </div>
            </div>

            </div>
          </div>
          <div className='slide' style={{display:'flex', flexDirection:'column', textAlign:'left'}}>
            <StarRatings
              rating={3.5}
              starRatedColor="gold"
              starDimension="30px"
              starSpacing="5px"
              numberOfStars={5}
              name='rating'
              style={{alignItems:'left'}}
            />

            <div style={{margin:'0 auto', justifyContent:'center',   maxWidth:'fit-content', marginLeft:'auto', marginRight:'auto'}}>

            <h2 style={{textAlign:'left'}}>Καλή δουλειά</h2>
            <h4 style={{textAlign:'left'}}>Θα προτιμούσα πιο ευέλικτο ωράριο</h4>

            <div style={{display:'flex', flexDirection:'row'}}>
              <div style={{marginRight:'10px', textAlign:'left'}}>
                <img src='icons/pfp.svg' width={48} />
              </div>
              <div>
                <div>
                  Περικλής Εξηντάρης
                </div>
                <div style={{textAlign:'left'}}>
                  27/05/2024
                </div>
              </div>
            </div>

            </div>
          </div>

        </Slider>




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


const ScrollButton = () => {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop
      if (scrolled > 300) {
          setVisible(true)
      } else if (scrolled <= 300) {
          setVisible(false)
      }
  }

  const scrollToTop = () => {
      window.scrollTo({
          top: 0,
          behavior: "smooth"
          /* you can also use 'auto' behaviour
       in place of 'smooth' */
      })
  }

  window.addEventListener("scroll", toggleVisible)

  return (
      <button className='scrollButton' onClick={scrollToTop} style={{visibility: visible ? "visible" : "hidden"}}>
        <img width="30px" src='icons/uparrow.svg' />
      </button>
  )
}


export default Root