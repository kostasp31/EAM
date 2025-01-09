import "./ProfileComponent.css";
import { useState, useEffect } from "react";
import EyeOpen from "./SVGS/EyeOpen";
import EyeClosed from "./SVGS/EyeClosed";
import EditSVG from "./SVGS/EditSVG";

export default function ProfileComponent({user_data, notif}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [edit, setEdit] = useState(false);

  const [age, setAge] = useState('')

  useEffect(() => {
    if (user_data.age) {
      setAge(user_data.age)
    }
  }, [])

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const CircleWithInitialsProfile = ({ name, surname }) => {
    let initials = name[0]+surname[0]
    return (
      <div className="circle-profile-bio"  style={{marginLeft:'auto', marginRight:'auto'}}>
        {initials}  
    </div>
    )
  }

  const submitChanges = () => {
    if (age < 18 || age > 100) {
      notif("warning", "Πάνος","Ε τι ειναι αυτο τωρα")
    }
  }

  return (
    <div className="profile-comp__container">

      <div className="profile-comp-content">
        <CircleWithInitialsProfile name={user_data.name} surname={user_data.surname} />
        <div className="username-section">
          <span>{user_data.name} {user_data.surname }</span>
        </div>
        <form>
          <div className="input-row">
            <div className="input_box">
              <label htmlFor="name-field">Όνομα</label>
              <input type="text" id="name-field" value={user_data.name} disabled="disabled"/>
            </div>
            <div className="input_box">
              <label htmlFor="surname-field">Επώνυμο</label>
              <input type="text" id="surname-field" value={user_data.surname} disabled="disabled"/>
            </div>
          </div>
          <div className="input-row">
            <div className="input_box">
              <label htmlFor="age-field">Ηλικία</label>
              <input type="number" id="age-field" value={age} disabled={edit ? "" : "disabled "} onChange={(e) => setAge(e.target.value)}/>
            </div>
            <div className="input_box">
              <label htmlFor="sex-field">Φύλο</label>
              <input type="tel" id="sex-field" />
            </div>
          </div>
          <div className="input-row">
            <div className="input_box">
              <label htmlFor="amka-field">ΑΜΚΑ</label>
              <input type="text" id="amka-field" />
            </div>
            <div className="input_box">
              <label htmlFor="afm-field">ΑΦΜ</label>
              <input type="text" id="afm-field" />
            </div>
          </div>
          <div className="input-row">
            <div className="input_box">
              <label htmlFor="email-field">Email</label>
              <input type="email" id="email-field" />
            </div>
            <div className="input_box">
              <label htmlFor="phone-field">Τηλέφωνο</label>
              <input type="text" id="phone-field" />
            </div>
          </div>
          <div className="input-row">
            <div className="input_box">
              <label htmlFor="address-field">Διεύθυνση</label>
              <input type="text" id="address-field" />
            </div>
            <div className="input_box">
              <label htmlFor="taxidromikos-field">Ταχυδρομικός Κώδικας</label>
              <input type="text" id="taxidromikos-field" />
            </div>
          </div>
          <div className="input-row">
            <div className="input_box">
              <label htmlFor="city-field">Πόλη</label>
              <input type="text" id="city-field" />
            </div>
            <div className="input_box">
              <label htmlFor="area-field">Περιοχή</label>
              <input type="text" id="area-field" />
            </div>
          </div>
          <div className="last-row">
            {/* <label htmlFor="password-field">Κωδικός</label>
            <div className="password-wrapper">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password-field"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility()}
                className="toggle-visibility"
              >
                {!passwordVisible ? <EyeOpen /> : <EyeClosed />}
              </button>
            </div> */}

            {!edit ?
            <div style={{ width: 'fit-content', marginLeft:'auto', marginRight:'auto'}} id="edit-button">
              <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={(e) => {e.preventDefault(); setEdit(!edit)}}>
                <img src='icons/pencil_white.svg' width='28px' style={{ marginRight: '8px' }} />
                <span>Επεξεργασία</span>
              </button>
            </div>
            :
            <div style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'50px', gap:'40px' }}>
              <div style={{ width: 'fit-content'}}>
                <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={(e) => {e.preventDefault(); submitChanges()}}>
                  <img src='icons/save.svg' width='28px' style={{ marginRight: '8px' }} />
                  <span>Αποθήκευση</span>
                </button>
              </div>
              <div style={{ width: 'fit-content'}}>
                <button className='persona2-button' style={{ display: 'flex', alignItems: 'center', width:'auto' }} onClick={(e) => {e.preventDefault(); setEdit(false)}}>
                  <img src='icons/cancel.svg' width='28px' style={{ marginRight: '8px' }} />
                  <span>Ακύρωση</span>
                </button>
              </div>
            </div>
            </div>
            }

          </div>
        </form>
      </div>
    </div>
  );
}
