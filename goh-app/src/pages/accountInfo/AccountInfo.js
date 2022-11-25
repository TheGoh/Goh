import { 
  getAuth,       
  updatePassword, 
  updateEmail, 
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import React from "react";
import TextField from '@mui/material/TextField';
import { useAuthContext } from '../../hooks/useAuthContext'
import { useState } from "react";
import styles from './AccountInfo.module.css'



export default function AccountInfo() {
    const { user } = useAuthContext();
    const [ newDisplayName, setDisplayName ] = useState('');
    const [ newEmail, setEmail ] = useState('');
    const [ newPassword, setPassword ] = useState('');
    const [ currPass, setCurrPass ] = useState('');
    const [ avatar, setAvatar ] = useState(null)
    const [description, setDescription ] = useState('');
    
    const updateInfo = (event) => {
      event.preventDefault();
      const credential = EmailAuthProvider.credential(
        user.email, 
        currPass
      );
      reauthenticateWithCredential(user, credential).then((cred) => {
            //user = cred.user;  
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
            <span>New Email</span>
              <input
                    type = "email"
                    value={newEmail}
                    onChange={(e)=>{
                      setEmail(e.target.value)
                    }}
              />
              <span>New Password</span>
              <input
                    type = "password"
                    value={newPassword}
                    onChange={(e)=>{
                      setPassword(e.target.value)
                    }}
              />
            <span>Update Photo</span>
              <input
                    type = "file"
                    value={currPass}
                    onChange = {(e) => {
                      let selected = e.target.files[0]
                      setAvatar(selected)
                    }}
              />

            <span>Add a Description</span>
              <textarea
                    type = "text"
                    value={description}
                    onChange = {(e) => {
                      setDescription(e.target.value)
                    }}
              />  
              
              <span>Current Password</span>
              <input
                    type = "password"
                    value={currPass}
                    onChange={(e)=>{
                      setCurrPass(e.target.value)
                    }}
              />
            </label>
            
            {<button onClick={updateInfo}>Save</button>}
          </form>
        </div>
      )
}