import React from 'react'

const Notofications = () => {

  return (    
    <div>
      <nav class="navbar">
        <a href="/" class="logo">
          <img src="/logos/gov_gr_logo.svg" alt="GOV logo" />
        </a>
        <ul class="nav-links">
          <li class="nav-item"><a href="/">Αρχική σελίδα</a></li>
          <li class="nav-item"><a href="/profs">Επαγγελματίες</a></li>
          <li class="nav-item" style={{backgroundColor:'rgb(206, 205, 205)', borderRadius:'7px'}}><a href="/parent">Γονείς</a></li>
          <li class="nav-item"><a href="/announcements">Ανακοινώσεις</a></li>
          <li class="nav-item"><a href="/help">Βοήθεια</a></li>
          <li class="nav-item"><a href="/login">Σύνδεση</a></li>
        </ul>
      </nav>


      <div class="sidenav">
        <a href="/parent">Αρχική σελίδα</a>
        <a href="/search">Αναζήτηση</a>
        <a href="/applications">Αιτήσεις</a>
        <a href="/colabs">Συνεργασίες</a>
        <a href="/dates">Ραντεβού</a>
        <a href="/notifs" style={{backgroundColor:'rgb(50, 165, 154)'}}>Ειδοποιήσεις</a>
        <a href="/profile">Προφίλ</a>
        <a href="/help" style={{borderBottom:'1px solid white'}}>Βοήθεια</a>
      </div>
    </div>
  )
}

export default Notofications