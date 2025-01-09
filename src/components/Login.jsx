import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { FIREBASE_AUTH } from '../config/firebase'
import { collection, addDoc, query, where, getDocs, QuerySnapshot } from 'firebase/firestore'

const Login = () => {
  const [email, setEmail] = useState('')
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [password, setPassword] = useState('')
  const [passErrorMessage, setPassErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState("password")

  // const [wrongCredentials, setWrongCredentials] = useState(false)

  const navigate = useNavigate()

  // Handles the login functionality of the user
  const handleLogin = async (e) => {
    e.preventDefault() // Prevent default form submission
    setLoading(true) // Indicate login is in progress
    
    if (email === '' || password === '') {
      if (email === '') {
        setEmailErrorMessage('Υποχρεωτικό πεδίο')
      }
      if (password === '') {
        setPassErrorMessage('Υποχρεωτικό πεδίο')
      }
      setLoading(false) // Indicate login is in progress
    }
    else { 
      try {
        const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
        console.log("User logged in:", userCredential.user)
        navigate('/') // Navigate to the courses page after successful login
      } catch (error) {
        if (error.code === 'auth/invalid-credential') {
          setEmailErrorMessage('Ελέγξτε το email σας')
          setPassErrorMessage('Ελέγξτε τον κωδικό σας')
        }
        else if (error.code === 'auth/invalid-email') {
          setEmailErrorMessage('Μη έγκυρο email')
        }
        else
          alert(error.code)
      } finally {
        setLoading(false) // Reset the loading state
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
      if (currentUser) {
        navigate('/') // Navigate to /courses if already logged in
      }
    })

    return () => unsubscribe() // Cleanup subscription
  }, [navigate, FIREBASE_AUTH])

  const togglePassVisibility = () => {
    (passwordVisible === "text") ? setPasswordVisible("password") : setPasswordVisible("text")
  }


  // TODO: redirect to home when pressing govgr logo
  return (
    <div>
      <div className='logoDiv' >  
        <a href='/' ><img src='/logos/gov_gr_logo.svg' className='imageLogo' /></a>
      </div>

      <div className='formGrandpa'>
        <div className='formParent'>

          <div>
          <div className='forms'>
            <h1 className='blk'>Σύνδεση</h1>
            <br />  
            <form onSubmit={handleLogin} className='flex-container'>
              <div>
                <input
                  id='mail'
                  type='text'
                  className='form-input'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailErrorMessage('')
                    setPassErrorMessage('')
                  }}
                  style={!emailErrorMessage ? {} : {borderColor:'#ff0000'}}
                  // required
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
                    setPassword(e.target.value)
                    setEmailErrorMessage('')
                    setPassErrorMessage('')
                  }}
                  style={!passErrorMessage ? {} : {borderColor:'#ff0000'}}
                  // required
                />
                <img src={passErrorMessage == "password" ? "/icons/view_24.png" : "/icons/hide_32.png"} onClick={togglePassVisibility} className='eye-icon'/>


              </div>
                <div style={!passErrorMessage ? {display:'none'} : {float:'left', color:'#ff0000', verticalAlign:'middle', position:'relative', marginTop:-20, textAlign:'left'}}>
                  <img src='/icons/warning.png' style={{verticalAlign:'middle'}} />
                  <span style={{verticalAlign:'middle'}}> {passErrorMessage}</span>
                </div>
              <div>
                <button className='button-40' type="submit" disabled={loading}>Σύνδεση</button>
              </div>
              <div>
                <a href='' style={{float:"left"}}>Ξέχασα τον κωδικό μου</a>
                <a href='/register' style={{float:"right"}}>Εγγραφή</a>
              </div>
              {/* <div>
                Δεν έχετε λογαριασμό; <br /> <u><a style={{color:'blue', cursor:'pointer'}}` onClick={() => navigate('/register')}`>Δημιουργία λογαριασμού</a></u>
              </div> */}
            </form>
          </div>
          </div>

        </div>  {/*Form parent */}
      </div>  {/*Form grandpa */}
    </div>
  )
}

export default Login