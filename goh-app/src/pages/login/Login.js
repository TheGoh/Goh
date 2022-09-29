//import firebase lib
import { useState } from "react";
import { useLogin } from '../../hooks/useLogin'

// styles
import styles from './Login.module.css'

export default function Login() {
  
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const { login, error ,isPending } = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className={styles['signup-form']}>        
        <h2>Welcome to the Goh App</h2>
        <p>Login to your account</p>

        {/* Email field */}
        <label> 
            <span>Email</span>
                <input type = "email"
                        onChange={(e)=>setEmail(e.target.value)}
                        value={email}
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

        {!isPending && <button className="btn" >Login In</button>}
        {isPending && <button className="btn" disabled>loading</button>}
        {error && <p> {error} </p>}
    </form>
  )
}