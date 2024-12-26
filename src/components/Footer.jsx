
const Footer = () => {
  return (
    <div style={{display:'flex', flexDirection:'row', gap:'80px', justifyContent:'center', backgroundColor:'rgb(245, 245, 245)', paddingBottom:'50px'}}>
    <div style={{display:'flex', flexDirection:'column', width:'20%', gap:'20px', marginTop:'60px'}}>
      <img src='logos/epanadvm_footer_2.png' width="200px" style={{marginLeft:"auto", marginRight:"auto", marginBottom:'60px'}}/>
      <img src='logos/gov_gr_logo.svg' width="200px" style={{marginLeft:"auto", marginRight:"auto"}} />
      <img src='logos/ypeky.png' width="300px" style={{marginLeft:"auto", marginRight:"auto"}}/>
    </div>
    <div style={{display:'flex', flexDirection:'column', textAlign:'left', gap:'10px'}}>
      <h2>Για γονείς</h2>
      <div>Κριτήρια επιλεξιμότητας</div>
      <div>Βοήθεια</div>
      <div>Αναζήτηση επαγγελματία</div>
      <div>Συμφωνητικά</div>
      <div>Πληρωμές</div>
      <div>Ιστορικό δηλώσεων</div>
      <div>Συχνές ερωτήσεις</div>
    </div>
    <div style={{display:'flex', flexDirection:'column', textAlign:'left', gap:'10px'}}>
    <h2>Για επαγγελματίες</h2>
      <div>Κριτήρια επιλεξιμότητας</div>
      <div>Βοήθεια</div>
      <div>Δημιουργία βιογραφικού</div>
      <div>Δημιουργία αγγελίας</div>
      <div>Συμφωνητικά</div>
      <div>Αξιολογήσεις</div>
      <div>Ιστορικό δηλώσεων</div>
      <div>Συχνές ερωτήσεις</div>
    </div>
    <div style={{display:'flex', flexDirection:'column', textAlign:'left', gap:'10px'}}>
    <h2>Πληροφορίες</h2>
      <div>Ανακοινώσεις</div>
      <div>Δήλωση ιδιωτικότητας</div>
      <div>Όροι χρήσης</div>


    <div style={{textAlign:'left', verticalAlign:'middle', marginLeft:'0px', marginTop:'50px'}}>
      <div style={{marginTop:'auto', marginBottom:'20px', fontSize:'1.125rem', fontWeight:'600', verticalAlign:'middle'}}>
        <span><img src='icons/phone.svg' width="32" style={{verticalAlign:'middle', marginRight:'30px'}}/> +30 2103258080 | +30 2103258090</span>
      </div>
      <div style={{marginTop:'auto', marginBottom:'auto', fontSize:'1.125rem', fontWeight:'600'}}>
        <span><img src='icons/email.svg' width="32" style={{verticalAlign:'middle', marginRight:'30px'}} /> ntantades@yeka.gr</span>
      </div>
    </div>

    </div>
  </div>
  )
}

export default Footer