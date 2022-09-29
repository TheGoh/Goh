//import { useAuthContext } from '../../hooks/useAuthContext'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

// styles
import styles from './Login.module.css'



export default function Login() {
  //const { user } = useAuthContext()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
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
        <button>login</button>
    
        {/* {!isPending && <button className="btn" >Login In</button>}
        {isPending && <button className="btn" disabled>loading</button>}
        {error && <p> {error} </p>} */}
    </form>
  )
}