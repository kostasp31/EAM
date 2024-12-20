import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { FIREBASE_AUTH } from '../config/firebase'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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


  return (
    <div>
      <div className='logoDiv' >
        <a href='/' ><img src='../name.png' className='imageLogo' /></a>
      </div>

      <div className='formGrandpa'>
        <div className='formParent'>

          <div className='forms' >
            <h2 className='blk'>Σύνδεση</h2>
            {error && <p className="error-message">{error}</p>} {/* Display error message */}
            <form onSubmit={handleLogin}>
              <div >
                <input
                  id='mail'
                  type='email'
                  className='loginInput'
                  placeholder='example@mail.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  id='pass'
                  type='password'
                  className='loginInput'
                  placeholder='your_password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <a href=''>Ξέχασα τον κωδικό μου</a>
              </div>
              <br />
              <div>
                <button className='button-67' type="submit" disabled={loading}>Σύνδεση</button>
              </div>
              <br />
              <div>
                Δεν έχετε λογαριασμό; <br /> <u><a style={{color:'blue', cursor:'pointer'}} onClick={() => navigate('/register')}>Δημιουργία λογαριασμού</a></u>
              </div>
              <br />
            </form>
          </div>

        </div>  {/*Form parent */}
      </div>  {/*Form grandpa */}
    </div>
  )
}

export default Login