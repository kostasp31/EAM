import Footer from "./Footer"

const Bio = () => {
  return (
    <div>
      <nav className="navbar">
        <a href="/" className="logo">
          <img src="/logos/gov_gr_logo.svg" alt="GOV logo" />
        </a>
        <ul className="nav-links">
          <li className="nav-item"><a href="/">Αρχική σελίδα</a></li>
          <li className="nav-item" style={{ backgroundColor: 'rgb(206, 205, 205)', borderRadius: '7px' }}><a href="/profs">Επαγγελματίες</a></li>
          <li className="nav-item"><a href="/parent">Γονείς</a></li>
          <li className="nav-item"><a href="/announcements">Ανακοινώσεις</a></li>
          <li className="nav-item"><a href="/help">Βοήθεια</a></li>
          <li className="nav-item"><a href="/login">Σύνδεση</a></li>
        </ul>
      </nav>


      <div className="sidenav">
        <a href="/profs" ><span style={{ verticalAlign: 'middle' }}><img src='icons/home.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Αρχική σελίδα</a>
        <a href="/ad"><span style={{ verticalAlign: 'middle' }}><img src='icons/volume.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Αγγελία</a>
        <a href="/bio" style={{ backgroundColor: 'rgb(50, 165, 154)' }}><span style={{ verticalAlign: 'middle' }}><img src='icons/paper.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Βιογραφικό</a>
        <a href="/colabs_profs"><span style={{ verticalAlign: 'middle' }}><img src='icons/arrows.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Συνεργασίες</a>
        <a href="/dates_profs"><span style={{ verticalAlign: 'middle' }}><img src='icons/users.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Ραντεβού</a>
        <a href="/notifs_profs"><span style={{ verticalAlign: 'middle' }}><img src='icons/bell.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Ειδοποιήσεις</a>
        <a href="/profile_profs"><span style={{ verticalAlign: 'middle' }}><img src='icons/person.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Προφίλ</a>
        <a href="/ratings"><span style={{ verticalAlign: 'middle' }}><img src='icons/thumbs.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Αξιολογήσεις</a>
        <a href="/help" style={{ borderBottom: '1px solid white' }}><span style={{ verticalAlign: 'middle' }}><img src='icons/help.svg' style={{ width: '28px', height: '28px', paddingRight: '10px' }} /></span>Βοήθεια</a>
      </div>

      <Footer />
    </div>
  )
}

export default Bio