import React from 'react'
import { useNavigate } from 'react-router-dom'
import "../help.css"

import Footer from './Footer'

const Help = () => {
  const navigate = useNavigate()

  // TODO; fix onClick
  return (    
    <div>
      <nav className="navbar">
        <a href="/" className="logo">
          <img src="/logos/gov_gr_logo.svg" alt="GOV logo" />
        </a>
        <ul className="nav-links">
          <li className="nav-item"><a href="/">Αρχική σελίδα</a></li>
          <li className="nav-item"><a href="/profs">Επαγγελματίες</a></li>
          <li className="nav-item"><a href="/parent">Γονείς</a></li>
          <li className="nav-item"><a href="/announcements">Ανακοινώσεις</a></li>
          <li className="nav-item" style={{backgroundColor:'rgb(206, 205, 205)', borderRadius:'7px'}}><a href="/help">Βοήθεια</a></li>
          <li className="nav-item"><a href="/login">Σύνδεση</a></li>
        </ul>
      </nav>

      <div className='main-content'>
        <div className='main-heading'>
          Χρειάζεστε Βοήθεια;
        </div>

        <div className='searchbar-main-0'>
          <div className='searchbar-main-1'>
            <div className='input-container'>
              <input
                className='input-form'
                placeholder='Αναζήτηση βοήθειας'
                />
            </div>
            <div className='searchbar-main-icon' style={{marginRight:'20px'}}>
              <img src='/icons/search_24.png' />
            </div>
          </div>
        </div>

        <hr />
        <div className='panel-grid'>
          <div className='first-row'>
            <div className='first-row-element' onClick={() => navigate('/')}>
              <div className='heading'>Για γονείς</div>
              <div className='content'>
                Πληροφορίες σχετικά με τα κριτήρια επιλεξιμότητας και την διαδικασία υποβολής αίτησης.
              </div>
            </div>
            <div className='first-row-element' onClick={() => navigate('/')}>
              <div className='heading'>Για Επαγγελματίες</div>
              <div className='content'>
              Πληροφορίες σχετικά με τα κριτήρια επιλεξιμότητας τη δημιουργία αγγελίας και τη σύναψη συμφωνητικού.
              </div>
            </div>
          </div>
          <div className='second-row'>
            <div className='second-row-element' onClick={() => navigate('/')}>
            <div className='heading'>FAQ - Γονείς</div>
            <div className='content'>
            Συχνές ερωτήσεις σχετικά με τη χρήση της πλατφόρμας και τι προϋποθέσεις δήλωσης από τους ενδιαφερόμενους γονείς.
              </div>
            </div>
            <div className='second-row-element' onClick={() => navigate('/')}>
            <div className='heading'>FAQ - Επαγγελματίες</div>
            <div className='content'>
            Συχνές ερωτήσεις σχετικά με τη χρήση της πλατφόρμας και τι προϋποθέσεις δήλωσης από τους ενδιαφερόμενους επαγγελματίες.
              </div>
            </div>
            <div className='second-row-element' onClick={() => navigate('/help/conditions')}>
            <div className='heading'>Όροι Χρήσης</div>
            <div className='content'>
            Όροι χρήσης της πλατφόρμας και δήλωση προσωπικών δεδομένων.
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

    </div>
  )
}

export default Help