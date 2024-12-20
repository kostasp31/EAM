import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../config/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const Register = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVerify, setPasswordVerify] = useState('')

  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [AFM, setAFM] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState("password")
  const [passwordVerifyVisible, setPasswordVerifyVisible] = useState("password")

  const SignUp = async (event) => {
    event.preventDefault() // Prevent default form submission

    setLoading(true)
    try {
      const res = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
      console.log("User registered:", res.user)
      window.location.href = "/"
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
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
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  id='surname'
                  type='text'
                  className='form-input'
                  placeholder='Επώνυμο'
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  id='AFM'
                  type='text'
                  className='form-input'
                  placeholder='ΑΦΜ'
                  value={AFM}
                  onChange={(e) => setAFM(e.target.value)}
                  required
                />
              </div>
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
              <div className='pass-input-container'>
                  <input
                    id='pass-verify'
                    type={passwordVerifyVisible}
                    className='form-input'
                    placeholder='Κωδικός'
                    value={passwordVerify}
                    onChange={(e) => setPasswordVerify(e.target.value)}
                    required
                  />
                  <img src={passwordVerifyVisible == "password" ? "/icons/view_24.png" : "/icons/hide_32.png"} onClick={toggleVerifyPassVisibility} className='eye-icon'/>
              </div>
              <div>
                <button className='button-40' type="submit" disabled={loading}>Εγγραφή</button>
              </div>
              <div>
                <a href='' style={{float:"left"}}>Ξέχασα τον κωδικό μου</a>
                <a href='/login' style={{float:"right"}}>Σύνδεση</a>
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