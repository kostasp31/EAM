import Footer from "./Footer"
import ScrollButton from "./ScrollButton"
import "../help.css"

const FAQ_Parents = () => {
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
          <li className="nav-item"><a href="/announcements">Ανακοινώσεις</a></li>
          <li className="nav-item" style={{backgroundColor:'rgb(206, 205, 205)', borderRadius:'7px'}}><a href="/help">Βοήθεια</a></li>
          <li className="nav-item"><a href="/login">Σύνδεση</a></li>
        </ul>
      </nav>

      <ScrollButton />

      <div style={{marginLeft:'25%', marginRight:'25%', paddingBottom:'100px'}}>
        hi
      </div>

      <Footer />
    </div>

  )
}

export default FAQ_Parents