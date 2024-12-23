import React from 'react'

const Help = () => {

  return (    
    <div>
      <nav class="navbar">
        <a href="/" class="logo">
          <img src="/logos/gov_gr_logo.svg" alt="GOV logo" />
        </a>
        <ul class="nav-links">
          <li class="nav-item"><a href="/">Αρχική σελίδα</a></li>
          <li class="nav-item"><a href="/profs">Επαγγελματίες</a></li>
          <li class="nav-item"><a href="/parent">Γονείς</a></li>
          <li class="nav-item"><a href="/announcements">Ανακοινώσεις</a></li>
          <li class="nav-item" style={{backgroundColor:'rgb(206, 205, 205)', borderRadius:'7px'}}><a href="/help">Βοήθεια</a></li>
          <li class="nav-item"><a href="/login">Σύνδεση</a></li>
        </ul>
      </nav>
    </div>
  )
}

export default Help