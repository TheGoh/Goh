//import { useAuthContext } from '../../hooks/useAuthContext'
import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'
// styles
import styles from './Signup.module.css'

// components

export default function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userid, setUserid] = useState('')
    const {signup, isPending, error} = useSignup()

  //const { user } = useAuthContext()
    const handleSubmit = (e) => {
        e.preventDefault()
        signup(email, password, userid)
    }

  return (
    <form onSubmit={handleSubmit} className={styles['signup-form']}>        
        <h2>Welcome to the Goh App</h2>
        <p>Register your account</p>

        {/* Email field */}
        <label> 
            <span>Email</span>
                <input type = "email"
                        onChange={(e)=>setEmail(e.target.value)}
                        value={email}
                />
        </label>

        {/* userid field */}
        <label> 
            <span>Username</span>
                <input type = "username"
                        onChange={(e)=>setUserid(e.target.value)}
                        value={userid}
                />
        </label>

        {/* Password field */}
        <label> 
            <span>Password</span>
                <input type = "Password"
                        onChange={(e)=>setPassword(e.target.value)}
                        value={password}
                />
        </label>
    
        {!isPending && <button className="btn" >Create account</button>}
        {isPending && <button className="btn" disabled>loading</button>}
        {error && <p> {error} </p>}
    </form>
  )
}