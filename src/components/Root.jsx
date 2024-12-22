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
          {/* <li class="nav-item-log"><a href="/register">Εγγραφή</a></li> */}
        </ul>
      </nav>

      {/* height = 100vh for above the fold*/}
      <div style={{height:'90vh', backgroundColor:'white'}}>

        <div className='main-elements'>
          <div className='personas-buttons'>
            <div style={{display:'flex', flexDirection:'row', gap:'5px'}}>
              <button className='persona1-button'>Για γονείς</button>
              <button className='persona2-button'>Για επαγγελματίες</button>
            </div>
          </div>
          <div className='searchbar-main'>
            <div className='searchbar-main-icon'>
              <img src='/icons/calendar_32.png' />
            </div>
            <div style={{display:'flex', alignItems:'center'}}>
              <input
                className='searchbar-main-input'
                placeholder='Ημέρες / Ώρες'
              />
            </div>
            <div className='searchbar-main-icon'>
              <img src='/icons/vertical-line_32.png' />
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
            <div className='searchbar-main-icon'>
              <img src='/icons/search_32.png' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Root