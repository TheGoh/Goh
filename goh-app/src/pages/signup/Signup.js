//import { useAuthContext } from '../../hooks/useAuthContext'
import { useState } from 'react'
// styles
import styles from './Signup.module.css'

// components

export default function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userid, setUserid] = useState('')
    //const [signup, isPending, error] = useSignup()

  //const { user } = useAuthContext()
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(userid, email, password)
    }

  return (
        <form onSubmit={handleSubmit} className={styles['signup-form']}>        <h2>Signup</h2>

        {/* Email field */}
        <label> 
            <span>Email:</span>
                <input type = "email"
                        onChange={(e)=>setEmail(e.target.value)}
                        value={email}
                />
        </label>

        {/* userid field */}
        <label> 
            <span>Username:</span>
                <input type = "username"
                        onChange={(e)=>setUserid(e.target.value)}
                        value={userid}
                />
        </label>

        {/* Password field */}
        <label> 
            <span>Password:</span>
                <input type = "Password"
                        onChange={(e)=>setPassword(e.target.value)}
                        value={password}
                />
        </label>
        <button className="btn">Signup</button>
    </form>
  )
}