import { useNavigate } from 'react-router-dom'

const Root = () => {
  const navigate = useNavigate()

  return (
    <div>
      <nav class="navbar">
        <a href="/" class="logo">
          <img src="/logos/gov_gr_logo.svg" alt="GOV logo" />
        </a>
        <ul class="nav-links">
          <li class="nav-item"><a href="#">Αρχική σελίδα</a></li>
          <li class="nav-item"><a href="#">Επαγγελματίες</a></li>
          <li class="nav-item"><a href="#">Γονείς</a></li>
          <li class="nav-item"><a href="#">Ανακοινώσεις</a></li>
          <li class="nav-item"><a href="#">Βοήθεια</a></li>
          <li class="nav-item"><a href="/login">Σύνδεση</a></li>
        </ul>
      </nav>

      {/* <button  onClick={() => navigate('/register')}>Εγγραφή</button>
      <button  onClick={() => navigate('/login')}>Σύνδεση</button> */}
    </div>
  )
}

export default Root