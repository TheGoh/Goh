import { 
  getAuth,       
  updatePassword, 
  updateEmail, 
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";
import { useState } from "react";
import styles from './AccountInfo.module.css'



export default function AccountInfo() {
    const auth = getAuth();
    const user = auth.getCurrent;
    const [ newDisplayName, setDisplayName ] = useState('');
    const [ newEmail, setEmail ] = useState('');
    const [ newPassword, setPassword ] = useState('');
    
    const updateInfo = (event) => {
      event.preventDefault();
      console.log("HERE");
      auth.onAuthStateChanged((user) => {
        if (user) {
          let check = 0;
          updateEmail(user, newEmail).then(()=>{
            console.log("email update success")
            check = 1
          }).catch((error) => {
            console.log("email update error")
          });
          updatePassword(user, newPassword).then(()=>{
            console.log("pass update success")
            check = 2
          }).catch((error) => {
            console.log("pass update error")
          });
          console.log(check);
          if (check === 2) {
            user.reload();
          }
          //user.reload();
        }
      });
    };
    
    return (
        <div>
          <form className={styles['signup-form']}>
            <h2>Account Information</h2>
            <label>
            <span>Email</span>
              <input
                    type = "text"
                    value={newEmail}
                    onChange={(e)=>{
                      setEmail(e.target.value)
                    }}
              />
              <span>Password</span>
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