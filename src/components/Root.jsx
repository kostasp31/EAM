import { useNavigate } from 'react-router-dom'

const Root = () => {
  const navigate = useNavigate()

  return (
    <div>
      <button  onClick={() => navigate('/register')}>Εγγραφή</button>
      <button  onClick={() => navigate('/login')}>Σύνδεση</button>
    </div>
  )
}

export default Root