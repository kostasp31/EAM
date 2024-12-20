import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { FIREBASE_AUTH } from '../config/firebase'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordVisible, setPasswordVisible] = useState("password")

  const navigate = useNavigate()

  // Handles the login functionality of the user
  const handleLogin = async (e) => {
    e.preventDefault() // Prevent default form submission
    setLoading(true) // Indicate login is in progress
    setError('') // Clear previous error

    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
      console.log("User logged in:", userCredential.user)
      navigate('/profile') // Navigate to the courses page after successful login
    } catch (error) {
      setError(error.message) // Display the error message
    } finally {
      setLoading(false) // Reset the loading state
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
      if (currentUser) {
        navigate('/profile') // Navigate to /courses if already logged in
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
            {/* {error && <p className  ="error-message">{error}</p>} Display error message */}
            <form onSubmit={handleLogin} className='flex-container'>
              <div>
                <input
                  id='mail'
                  type='email'
                  className='form-input'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className='pass-input-container'>
                  <input
                    id='pass'
                    type={passwordVisible}
                    className='form-input'
                    placeholder='Κωδικός'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <img src={passwordVisible == "password" ? "/icons/view_24.png" : "/icons/hide_32.png"} onClick={togglePassVisibility} className='eye-icon'/>
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