import "./ProfileComponent.css";
import { useState, useEffect } from "react";
import EyeOpen from "./SVGS/EyeOpen";
import EyeClosed from "./SVGS/EyeClosed";
import EditSVG from "./SVGS/EditSVG";

import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_APP } from '../../config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs, doc, updateDoc  } from 'firebase/firestore'


export default function ProfileComponent({user_data, userId,notif, reload, setReload}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [edit, setEdit] = useState(false);

  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [AMKA, setAMKA] = useState('')
  const [phone, setPhone] = useState('')

  const [address, setAddress] = useState('')
  const [tk, setTk] = useState('')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')

  const [ageError, setAgeError] = useState(false)
  const [AMKAError, setAMKAError] = useState(false)
  const [phoneError, setPhoneError] = useState(false)
  const [tkError, setTkError] = useState(false)
  const [addressError, setAddressError] = useState(false)

  useEffect(() => {
    if (user_data.age) {
      setAge(user_data.age)
    }
    if (user_data.gender) {
      setGender(user_data.gender)
    }
    if (user_data.AMKA) {
      setAMKA(user_data.AMKA)
    }
    if (user_data.phone) {
      setPhone(user_data.phone)
    }
    if (user_data.area) {
      setArea(user_data.area)
    }
    if (user_data.tk) {
      setTk(user_data.tk)
    }
    if (user_data.city) {
      setCity(user_data.city)
    }
    if (user_data.address) {
      setAddress(user_data.address)
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

  const submitChanges = async () => {
    const phone_regex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    let failed = false;
    if ((age < 18 || age > 100) && age) {
      notif("danger", "Μη έγκυρη ηλικία","Καταχωρίστε μια έγκυρη τιμή για την ηλικία σας")
      setAgeError(true)
      failed = true
    }
    if ((AMKA.length !== 11) && AMKA) {
      notif("danger", "Μη έγκυρο ΑΜΚΑ", "Το ΑΜΚΑ σας αποτελείται από 11 ακριβώς ψηφία")
      setAMKAError(true)
      failed = true
    }
    if (!phone_regex.test(phone) && phone) {
      notif("danger", "Μη έγκυρο τηλέφωνο", "Καταχωρίστε έγκυρο αριθμό τηλεφώνου")
      setPhoneError(true)
      failed = true
    }
    if (tk.length !== 5 && tk) {
      notif("danger", "Μη έγκυρος ταχυδρομικός κώδικας", "Καταχωρίστε έγκυρο ταχυδρομικό κώδικα (5 ψηφία)")
      setTkError(true)
      failed = true
    }
    if (!address) {
      notif("danger", "Μη έγκυρος δήμος", "Καταχωρίστε τον δήμο που ανήκετε από τις επιλογές")
      setAddressError(true)
      failed = true
    }
    if (failed)
      return
    try {
      // Create a query against the collection
      const q = query(collection(FIREBASE_DB, 'user_data'), where('uid', '==', userId))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const docRef = doc(FIREBASE_DB, 'user_data', querySnapshot.docs[0].id)

        // Update the document with the new value
        await updateDoc(docRef, {
          age: Number(age),
          gender: gender,
          AMKA: AMKA,
          phone:phone,
          address:address,
          tk:tk,
          area:area,
          city:city
        })
        notif("success", "Επιτυχία!", "Οι αλλαγές σας υποβλήθηκαν επιτυχώς")
        setEdit(false)
        setAMKAError(false)
        setPhoneError(false)
        setAgeError(false)
      } else {
        console.log("No such document found with the specified uid!")
      }
    } catch (error) {
      console.error("Error updating document: ", error)
    }
  }

  return (
    <div className="profile-comp__container">

      <div className="profile-comp-content">
        <CircleWithInitialsProfile name={user_data.name} surname={user_data.surname} />
        <div className="username-section">
          <span>{user_data.name} {user_data.surname }</span>
        </div>
        <form style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
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
              <input type="number" id="age-field" value={age} disabled={edit ? "" : "disabled "} onChange={(e) => {setAgeError(false); setAge(e.target.value)}} style={!ageError ? {} : {borderColor:'#ff0000'}}/>
            </div>
            <div className="input_box">
              <label htmlFor="sex-field">Φύλο</label>
              <select name="cars" id="sex-field" disabled={edit ? "" : "disabled "} value={gender} onChange={e => {setGender(e.target.value)}}>
                <option value="" disabled hidden></option>
                <option value="male">Άντρας</option>
                <option value="female">Γυναίκα</option>
              </select>
            </div>
          </div>
          <div className="input-row">
            <div className="input_box">
              <label htmlFor="amka-field">ΑΜΚΑ</label>
              <input type="number" id="amka-field" disabled={edit ? "" : "disabled "} value={AMKA} onChange={e => {setAMKAError(false); setAMKA(e.target.value)}} style={!AMKAError ? {} : {borderColor:'#ff0000'}}/>
            </div>
            <div className="input_box">
              <label htmlFor="afm-field">ΑΦΜ</label>
              <input type="text" id="afm-field" value={user_data.AFM} disabled="disabled"/>
            </div>
          </div>
          <div className="input-row">
            <div className="input_box">
              <label htmlFor="email-field">Email</label>
              <input type="email" id="email-field" disabled="disabled" value={user_data.email}/>
            </div>
            <div className="input_box">
              <label htmlFor="phone-field">Τηλέφωνο</label>
              <input type="phone" id="phone-field" disabled={edit ? "" : "disabled "} value={phone} onChange={e => {setPhoneError(false); setPhone(e.target.value)}} style={!phoneError ? {} : {borderColor:'#ff0000'}}/>
            </div>
          </div>
          <div className="input-row">

            <div className="input_box">
              <label htmlFor="address-field">Δήμος</label>
              <select name="cars" id="sex-field" disabled={edit ? "" : "disabled "} value={address} onChange={e => {setAddress(e.target.value)}} style={!addressError ? {} : {borderColor:'#ff0000'}}>
                <option value="" disabled="disabled" hidden></option>
                <option value="Athena">Δήμος Αθηναίων</option>
                <option value="Aigina">Δήμος Αίγινας</option>
                <option value="Peristeri">Δήμος Περιστερίου</option>
                <option value="Galatsi">Δήμος Γαλατσίου</option>
                <option value="Zografou">Δήμος Ζωγράφου</option>
                <option value="Irakleiou">Δήμος Ηρακλείου</option>
              </select>
            </div>


            <div className="input_box">
              <label htmlFor="taxidromikos-field">Ταχυδρομικός Κώδικας</label>
              <input type="text" id="taxidromikos-field" disabled={edit ? "" : "disabled "} value={tk} onChange={e => {setTkError(false); setTk(e.target.value)}} style={!tkError ? {} : {borderColor:'#ff0000'}}/>
            </div>
          </div>
          <div className="input-row">
            <div className="input_box">
              <label htmlFor="city-field">Πόλη</label>
              <input type="text" id="city-field" disabled={edit ? "" : "disabled "} value={city} onChange={e => setCity(e.target.value)}/>
            </div>
            <div className="input_box">
              <label htmlFor="area-field">Περιοχή</label>
              <input type="text" id="area-field" disabled={edit ? "" : "disabled "} value={area} onChange={e => setArea(e.target.value)}/>
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
                <img src='/icons/pencil_white.svg' width='28px' style={{ marginRight: '8px' }} />
                <span>Επεξεργασία</span>
              </button>
            </div>
            :
            <div style={{width:'fit-content', marginLeft:'auto', marginRight:'auto'}}>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:'50px', gap:'40px' }}>
              <div style={{ width: 'fit-content'}}>
                <button className='button-40' style={{ display: 'flex', alignItems: 'center' }} onClick={(e) => {e.preventDefault(); submitChanges()}}>
                  <img src='/icons/save.svg' width='28px' style={{ marginRight: '8px' }} />
                  <span>Αποθήκευση</span>
                </button>
              </div>
              <div style={{ width: 'fit-content'}}>
                <button className='persona2-button' style={{ display: 'flex', alignItems: 'center', width:'auto' }} 
                  onClick={(e) => {
                    e.preventDefault();
                    setEdit(false)
                    setAMKAError(false)
                    setPhoneError(false)
                    setAgeError(false)
                    setTkError(false)

                    setAge(user_data.age);
                    setGender(user_data.gender);
                    setAMKA(user_data.AMKA);
                    setPhone(user_data.phone);
                    setAddress(user_data.address);
                    setTk(user_data.tk);
                    setCity(user_data.city);
                    setArea(user_data.area);
                  }}>
                  <img src='/icons/cancel.svg' width='28px' style={{ marginRight: '8px' }} />
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
