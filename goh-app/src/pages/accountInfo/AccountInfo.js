import { 
  getAuth,       
  updatePassword, 
  updateEmail, 
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  EmailAuthCredential,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  EmailAuthProvider
} from "firebase/auth";
import React from "react";
import { useState } from "react";
import styles from './AccountInfo.module.css'



export default function AccountInfo() {
    const auth = getAuth();
    const user = auth.currentUser
    const [ newDisplayName, setDisplayName ] = useState('');
    const [ newEmail, setEmail ] = useState('');
    const [ newPassword, setPassword ] = useState('');
    const [ currPass, setCurrPass ] = useState('');
    
    const updateInfo = (event) => {
      event.preventDefault();
      const credential = EmailAuthProvider.credential(
        user.email, 
        currPass
      );
      reauthenticateWithCredential(user, credential).then((cred) => {
            //user = cred.user;  
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
            <span>Current Password</span>
              <input
                    type = "text"
                    value={currPass}
                    onChange={(e)=>{
                      setCurrPass(e.target.value)
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