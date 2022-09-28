import { useState } from 'react'
import { userSignUp } from '../hooks/userSignUp'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {ERROR, signUp} = userSignUp()

  const handleSubmit = (e) => {
    e.preventDefault();
    signUp(email, password);
    
  }
  
  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>email:</span>
          <input
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label>
          <span>password:</span>
          <input
            required
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <button>sign up</button>
        {ERROR && <p>{ERROR}</p>}
      </form>
    </div>
  )
}
