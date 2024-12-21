import React, { useState } from 'react'
import { FIREBASE_AUTH, FIREBASE_DB } from '../config/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const Register = () => {

  const [email, setEmail] = useState('')
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [password, setPassword] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [passwordVerify, setPasswordVerify] = useState('')
  const [passwordVerifyErrorMessage, setPasswordVerifyErrorMessage] = useState('')
  
  const [name, setName] = useState('')
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [surname, setSurname] = useState('')
  const [surnameErrorMessage, setSurnameErrorMessage] = useState('')
  const [AFM, setAFM] = useState('')
  const [AFMErrorMessage, setAFMErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState('')
  const [passwordVerifyVisible, setPasswordVerifyVisible] = useState("password")

  const navigate = useNavigate()
  let regexAFM = /^[0-9]{9}$/
  let regexPass = /^.{6,}$/
  let regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/


  const SignUp = async (event) => {
    event.preventDefault()
    // setLoading(true)


    let weak = false
    if (!regexAFM.test(AFM)) {
      setAFMErrorMessage('Συμπληρώστε έγκυρο ΑΦΜ')
      weak = true
    }
    if (!regexPass.test(password)) {
      setPasswordErrorMessage('Ο κωδικός πρέπει να περιέχει τουλάχιστον 6 χαρακτήρες')
      setPasswordVerifyErrorMessage('Ο κωδικός πρέπει να περιέχει τουλάχιστον 6 χαρακτήρες')
      weak = true
    }
    if (!regexEmail.test(email)) {
      setEmailErrorMessage('Μη έγκυρο email')
      weak = true
    }
    if (password !== passwordVerify) {
      setPasswordVerifyErrorMessage('Οι κωδικοί δεν ταιριάζουν')
      weak = true
    }

    if (email === '')
      setEmailErrorMessage('Υποχρεωτικό πεδίο')
    if (AFM === '') {
      setAFMErrorMessage('Υποχρεωτικό πεδίο')
      weak = true
    }
    if (name === '') {
      setNameErrorMessage('Υποχρεωτικό πεδίο')
      weak = true
    }
    if (surname === '') {
      setSurnameErrorMessage('Υποχρεωτικό πεδίο')
      weak = true
    }

    if (password === '')
      setPasswordErrorMessage('Υποχρεωτικό πεδίο')
    if (passwordVerify === '')
      setPasswordVerifyErrorMessage('Υποχρεωτικό πεδίο')

    // setLoading(false)

    if (email === '' || password === '' || weak)
      ;
    else {
      console.log("no")
      let res1;
      try {
        res1 = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
        navigate("/profile")
        // console.log("User registered:", res1)
      } catch (error) {
        if (error.code === 'auth/invalid-email') {
          setEmailErrorMessage('Μη έγκυρο email')
        }
        else if (error.code === 'auth/email-already-in-use') {
          setEmailErrorMessage('Email ήδη σε χρήση')
        }
        else 
          alert(error.code)
      }


        // const payload = {
        //   "name":name,
        //   "surname":surname,
        //   "AFM":AFM,
        //   "email":email
        // }

        // try {
        //   const res2 = await addDoc(collection(FIREBASE_DB, 'user_data'), payload)
        //   // window.location.href = "/profile"
        // } catch (error) {
        //   alert(error.message)
        // } finally {
        //   // setLoading(false)
        //   navigate('/profile')
        // }
        // // setLoading(false)


    }

  }

  const togglePassVisibility = () => {
    (passwordVisible === "text") ? setPasswordVisible("password") : setPasswordVisible("text")
  }

  const toggleVerifyPassVisibility = () => {
    (passwordVerifyVisible === "text") ? setPasswordVerifyVisible("password") : setPasswordVerifyVisible("text")
  }

  return (
    <div>
      <div className='logoDiv' >  
        <a href='/' ><img src='/logos/gov_gr_logo.svg' className='imageLogo' /></a>
      </div>

      <div className='formGrandpa'>
        <div className='formParent'>

          <div>
          <div className='forms'>
            <h1 className='blk'>Εγγραφή</h1>
            <br />  
            {/* {error && <p className="error-message">{error}</p>} Display error message */}
            <form onSubmit={SignUp} className='flex-container'>
              {/* <div className='error'>
                {<p className="error-message">Σφάλμα</p>}
              </div> */}
              <div>
                <input
                  id='name'
                  type='text'
                  className='form-input'
                  placeholder='Όνομα'
                  value={name}
                  onChange={(e) => {
                    setNameErrorMessage('')
                    setName(e.target.value)
                  }}
                  // required
                  style={!nameErrorMessage ? {} : {borderColor:'#ff0000'}}
                />
                <div style={!nameErrorMessage ? {display:'none'} : {display:'', float:'left', color:'#ff0000'}}>
                  <span><img src='/icons/warning.png' style={{verticalAlign:'middle'}} /><span style={{verticalAlign:'middle'}}> {nameErrorMessage}</span></span>
                </div>
              </div>
              <div>
                <input
                  id='surname'
                  type='text'
                  className='form-input'
                  placeholder='Επώνυμο'
                  value={surname}
                  onChange={(e) => {
                    setSurnameErrorMessage('')
                    setSurname(e.target.value)
                  }}
                  // required
                  style={!surnameErrorMessage ? {} : {borderColor:'#ff0000'}}
                />
                <div style={!surnameErrorMessage ? {display:'none'} : {display:'', float:'left', color:'#ff0000'}}>
                  <span><img src='/icons/warning.png' style={{verticalAlign:'middle'}} /><span style={{verticalAlign:'middle'}}> {surnameErrorMessage}</span></span>
                </div>
              </div>
              <div>
                <input
                  id='AFM'
                  type='text'
                  className='form-input'
                  placeholder='ΑΦΜ'
                  value={AFM}
                  onChange={(e) => {
                    setAFMErrorMessage('')
                    setAFM(e.target.value)
                  }}
                  // required
                  style={!AFMErrorMessage ? {} : {borderColor:'#ff0000'}}
                />
                <div style={!AFMErrorMessage ? {display:'none'} : {display:'', float:'left', color:'#ff0000'}}>
                  <span><img src='/icons/warning.png' style={{verticalAlign:'middle'}} /><span style={{verticalAlign:'middle'}}> {AFMErrorMessage}</span></span>
                </div>
              </div>
              <div>
                <input
                  id='mail'
                  type='text'
                  className='form-input'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => {
                    setEmailErrorMessage('')
                    setEmail(e.target.value)
                  }}
                  // required
                  style={!emailErrorMessage ? {} : {borderColor:'#ff0000'}}
                  />
                <div style={!emailErrorMessage ? {display:'none'} : {display:'', float:'left', color:'#ff0000'}}>
                  <span><img src='/icons/warning.png' style={{verticalAlign:'middle'}} /><span style={{verticalAlign:'middle'}}> {emailErrorMessage}</span></span>
                </div>
              </div>
              <div className='pass-input-container'>
                  <input
                    id='pass'
                    type={passwordVisible}
                    className='form-input'
                    placeholder='Κωδικός'
                    value={password}
                    onChange={(e) => {
                      setPasswordErrorMessage('')
                      setPassword(e.target.value)
                    }}
                    style={!passwordErrorMessage ? {} : {borderColor:'#ff0000'}}
                    // required
                    />
                  <img src={passwordVisible == "password" ? "/icons/view_24.png" : "/icons/hide_32.png"} onClick={togglePassVisibility} className='eye-icon'/>
              </div>
              <div style={!passwordErrorMessage ? {display:'none'} : {float:'left', color:'#ff0000', verticalAlign:'middle', position:'relative', marginTop:-20, textAlign:'left'}}>
                  <img src='/icons/warning.png' style={{verticalAlign:'middle'}} />
                  <span style={{verticalAlign:'middle'}}> {passwordErrorMessage}</span>
              </div>
              <div className='pass-input-container'>
                  <input
                    id='pass-verify'
                    type={passwordVerifyVisible}
                    className='form-input'
                    placeholder='Επιβεβαίωση κωδικού'
                    value={passwordVerify}
                    onChange={(e) => {
                      setPasswordVerifyErrorMessage('')
                      setPasswordVerify(e.target.value)
                    }}
                    style={!passwordVerifyErrorMessage ? {} : {borderColor:'#ff0000'}}
                    // required
                  />
                  <img src={passwordVerifyVisible == "password" ? "/icons/view_24.png" : "/icons/hide_32.png"} onClick={toggleVerifyPassVisibility} className='eye-icon'/>
              </div>
              <div style={!passwordVerifyErrorMessage ? {display:'none'} : {float:'left', color:'#ff0000', verticalAlign:'middle', position:'relative', marginTop:-20, textAlign:'left'}}>
                  <img src='/icons/warning.png' style={{verticalAlign:'middle'}} />
                  <span style={{verticalAlign:'middle'}}> {passwordVerifyErrorMessage}</span>
              </div>
              <div>
                <button className='button-40' type="submit" disabled={loading}>Εγγραφή</button>
              </div>
              <div>
                <div style={{float:"left"}}>
                  Έχετε ήδη λογαριασμό; <a href='/login'>Σύνδεση</a>
                </div>
              </div>
              {/* <div>
                Δεν έχετε λογαριασμό; <br /> <u><a style={{color:'blue', cursor:'pointer'}} onClick={() => navigate('/register')}>Δημιουργία λογαριασμού</a></u>
              </div> */}
            </form>
          </div>
          </div>

        </div>  {/*Form parent */}
      </div>  {/*Form grandpa */}
    </div>
  )
}

export default Register