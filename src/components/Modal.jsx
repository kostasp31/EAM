import "../modal.css"

const Modal = ({text}) => {
  return (

<div className='formGrandpa'>
  <div className='formParent'>
    <div className="box" id="box">
      <div>
        <div id='dlg-wrap'>
          <label id="dlg-close" for="dialog_state"><i className="icon ion-ios-close-empty"></i></label>
          <h2 id='dlg-header'>Are you sure?</h2>
          <div id='dlg-content'>You are about to kill a puppy, that's some serious shit. Have you really thought this through?</div>
          <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'40px', gap:'40px' }}>

            <div style={{ width: 'fit-content'}}>
              <button className='button-40' style={{ display: 'flex', alignItems: 'center' }}>
                <img src='icons/save.svg' width='28px' style={{ marginRight: '8px' }} />
                <span>Αποθήκευση</span>
              </button>
            </div>
            <div style={{ width: 'fit-content'}}>
              <button className='persona2-button' style={{ display: 'flex', alignItems: 'center', width:'auto' }}>
                <img src='icons/cancel.svg' width='28px' style={{ marginRight: '8px' }} />
                <span>Ακύρωση</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default Modal