import { 
  getAuth,       
  updatePassword, 
  updateEmail, 
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword
} from "firebase/auth";
import { useState } from "react";
import styles from './AccountInfo.module.css'



export default function AccountInfo() {
    const auth = getAuth();
    let user = auth.currentUser
    const [ newDisplayName, setDisplayName ] = useState('');
    const [ newEmail, setEmail ] = useState('');
    const [ currEmail, setCurrEmail ] = useState('');
    const [ newPassword, setPassword ] = useState('');
    const [ currPass, setCurrPass ] = useState('');
    
    const updateInfo = (event) => {
      event.preventDefault();
      signInWithEmailAndPassword(auth, currEmail, currPass).then((cred) => {
            user = cred.user;  
            console.log("HERE");
            console.log("email:" + newEmail)
            updateEmail(user, newEmail).then(()=>{
              console.log("email update success")
            }).catch((error) => {
              console.log("email update error")
            });
            updatePassword(user, newPassword).then(()=>{
              console.log("pass update success")
            }).catch((error) => {
              console.log("pass update error")
            });
      })
    };
    
    return (
        <div>
          <form className={styles['signup-form']}>
            <h2>Account Information</h2>
            <label>
            <span>Current Email</span>
              <input
                    type = "text"
                    value={currEmail}
                    onChange={(e)=>{
                      setCurrEmail(e.target.value)
                    }}
              />
            <span>New Email</span>
              <input
                    type = "text"
                    value={newEmail}
                    onChange={(e)=>{
                      setEmail(e.target.value)
                    }}
              />
              <span>Current Password</span>
              <input
                    type = "text"
                    value={currPass}
                    onChange={(e)=>{
                      setCurrPass(e.target.value)
                    }}
              />
              <span>New Password</span>
              <input
                    type = "text"
                    value={newPassword}
                    onChange={(e)=>{
                      setPassword(e.target.value)
                    }}
              />
            </label>
            
            {<button onClick={updateInfo}>Save</button>}
          </form>
        </div>
      )
}