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
          <li class="nav-item" style={{backgroundColor:'rgb(206, 205, 205)', borderRadius:'7px'}}><a href="/">Αρχική σελίδα</a></li>
          <li class="nav-item"><a href="/profs">Επαγγελματίες</a></li>
          <li class="nav-item"><a href="/parent">Γονείς</a></li>
          <li class="nav-item"><a href="/announcements">Ανακοινώσεις</a></li>
          <li class="nav-item"><a href="/help">Βοήθεια</a></li>
          <li class="nav-item"><a href="/login">Σύνδεση</a></li>
          {/* <li class="nav-item-log"><a href="/register">Εγγραφή</a></li> */}
        </ul>
      </nav>

      {/* height = 100vh for above the fold*/}
      <div style={{height:'90vh'}}>

        <div className='main-elements'>
          <div className='personas-buttons'>
            <div style={{display:'flex', flexDirection:'row', gap:'5px'}}>
              <button className='persona1-button' onClick={() => navigate('parent')}>Για γονείς</button>
              <button className='persona2-button'>Για επαγγελματίες</button>
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
            <div class="verticalLine">
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

        {/* <table style={{position:'absolute', border:'2px solid #000000', padding:'15px', borderCollapse:'collapse'}}>
          <tr>
            <td style={{color:'#ffffff'}} className='calendar-cell'>
              a/a
            </td >
            <td className='calendar-cell'>
              Δ
            </td>
            <td className='calendar-cell'>
              Τ
            </td>
            <td className='calendar-cell'> 
              Τ
            </td>
            <td className='calendar-cell'>
              Π
            </td>
            <td className='calendar-cell'>
              Π
            </td>
            <td className='calendar-cell'> 
              Σ
            </td>
            <td className='calendar-cell'> 
              Κ
            </td>
          </tr>
          <tr>
            <td className='calendar-cell'>
              08:00 - 16:00
            </td >
            <td className='calendar-cell'>
              
            </td>
            <td className='calendar-cell'>
              
            </td>
            <td className='calendar-cell'> 
              
            </td>
            <td className='calendar-cell'>
              
            </td>
            <td className='calendar-cell'>
              
            </td>
            <td className='calendar-cell'> 
              
            </td>
            <td className='calendar-cell'> 
              
            </td>
          </tr>
          <tr>
            <td className='calendar-cell'>
              16:00 - 00:00
            </td >
            <td className='calendar-cell'>
              
            </td>
            <td className='calendar-cell'>
              
            </td>
            <td className='calendar-cell'> 
              
            </td>
            <td className='calendar-cell'>
              
            </td>
            <td className='calendar-cell'>
              
            </td>
            <td className='calendar-cell'> 
              
            </td>
            <td className='calendar-cell'> 
              
            </td>
          </tr>
          <tr>
            <td className='calendar-cell'>
              00:00 - 08:00
            </td >
            <td className='calendar-cell'>
              
            </td>
            <td className='calendar-cell'>
              
            </td>
            <td className='calendar-cell'> 
              
            </td>
            <td className='calendar-cell'>
              
            </td>
            <td className='calendar-cell'>
              
            </td>
            <td className='calendar-cell'> 
              
            </td>
            <td className='calendar-cell'> 
              
            </td>
          </tr>


        </table> */}

        <div>
          <div style={{
              marginTop: '110vh',
              position: 'absolute',
              left: '50%', // Center horizontally
              transform: 'translate(-50%, -50%)', // Adjust back by half its width and height
              // border: '1px solid #000000',
              width: '600px',
              textAlign: 'center' // Center text inside the div
          }}>
              <div className='idk'>Διαδικασία αναζήτησης επαγγελματία</div>

            <img src='rizz1.png' style={{width:'100%'}}/>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Root