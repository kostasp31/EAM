
const Footer = () => {
  return (
    <div style={{display:'flex', flexDirection:'row', gap:'80px', justifyContent:'center', backgroundColor:'rgb(245, 245, 245)', paddingBottom:'50px', marginTop:'200px', position:'sticky', height:'400px', top: 'calc( 100vh - 400px)'}}>
    <div style={{display:'flex', flexDirection:'column',width:'20%', gap:'20px', marginTop:'60px'}}>
      <div>
        <a href='https://european-union.europa.eu/live-work-study/funding-grants-subsidies_el' target='blank'><img src='/logos/epanadvm_footer_2.png' width="200px" style={{marginLeft:"auto", marginRight:"auto", marginBottom:'60px'}}/></a>
      </div>
      <div>
        <a href='/'><img src='/logos/gov_gr_logo.svg' width="200px" style={{marginLeft:"auto", marginRight:"auto"}} /></a>
      </div>
      <div>
        <a href='https://ypergasias.gov.gr/' target='blank'><img src='/logos/ypeky.png' width="200px" style={{marginLeft:"auto", marginRight:"auto"}}/></a>
      </div>
    </div>
    <div style={{display:'flex', flexDirection:'column', textAlign:'left', gap:'10px'}}>
      <h2>Για γονείς</h2>
      <div><a href='/help/FAQ_parents' target='blank'>Κριτήρια επιλεξιμότητας</a></div>
      <div><a href='/help' target='blank'>Βοήθεια</a></div>
      <div><a href='/search'>Αναζήτηση επαγγελματία</a></div>
      <div><a href='/colabs'>Συμφωνητικά</a></div>
      <div><a href='/colabs'>Πληρωμές</a></div>
      <div><a href='/colabs'>Ιστορικό δηλώσεων</a></div>
      <div><a href='/help/FAQ_parents' target='blank'>Συχνές ερωτήσεις</a></div>
    </div>
    <div style={{display:'flex', flexDirection:'column', textAlign:'left', gap:'10px'}}>
    <h2>Για επαγγελματίες</h2>
      <div><a href='/help/FAQ_professionals' target='blank'>Κριτήρια επιλεξιμότητας</a></div>
      <div><a href='/help' target='blank'>Βοήθεια</a></div>
      <div><a href='/bio'>Δημιουργία βιογραφικού</a></div>
      <div><a href='/ad'>Δημιουργία αγγελίας</a></div>
      <div><a href='/colabs_profs'>Συμφωνητικά</a></div>
      <div><a href='/ratings'>Αξιολογήσεις</a></div>
      <div><a href='/colabs_profs'>Ιστορικό δηλώσεων</a></div>
      <div><a href='/help/FAQ_professionals' target='blank'>Συχνές ερωτήσεις</a></div>
    </div>
    <div style={{display:'flex', flexDirection:'column', textAlign:'left', gap:'10px'}}>
    <h2>Πληροφορίες</h2>
      {/* <div>Ανακοινώσεις</div> */}
      <div><a href='/help/conditions' target='blank'>Δήλωση ιδιωτικότητας</a></div>
      <div><a href='/help/conditions' target='blank'>Όροι χρήσης</a></div>


    <div style={{textAlign:'left', verticalAlign:'middle', marginLeft:'0px', marginTop:'50px'}}>
      <div style={{marginTop:'auto', marginBottom:'20px', fontSize:'1.125rem', fontWeight:'600', verticalAlign:'middle'}}>
        <span><img src='/icons/phone.svg' width="32" style={{verticalAlign:'middle', marginRight:'30px'}}/> +30 2103258080 | +30 2103258090</span>
      </div>
      <div style={{marginTop:'auto', marginBottom:'auto', fontSize:'1.125rem', fontWeight:'600'}}>
        <span><img src='/icons/email.svg' width="32" style={{verticalAlign:'middle', marginRight:'30px'}} /> ntantades@yeka.gr</span>
      </div>
    </div>

    </div>
  </div>
  )
}

export default Footer