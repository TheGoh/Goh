import {
  updateProfile,
  updatePassword, 
  updateEmail, 
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import React from "react";
import { useAuthContext } from '../../hooks/useAuthContext'
import { useState } from "react";
import styles from './AccountInfo.module.css'
import { storage, firedb } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, query, where , collection} from "firebase/firestore"



export default function AccountInfo() {
    const { user } = useAuthContext();
    const [ newEmail, setEmail ] = useState(user.email);
    const [ newPassword, setPassword ] = useState('');
    const [ currPass, setCurrPass ] = useState('');
    const [ avatar, setAvatar ] = useState(null)
    const [ description, setDescription ] = useState('');
    
    const updateInfo = async (event) => {
      event.preventDefault();
      const credential = EmailAuthProvider.credential(user.email, currPass);
      reauthenticateWithCredential(user, credential).then(async () => {
        const tempEmail = user.email;
        updateEmail(user, newEmail)
        .catch((error) => {
          return alert(error.message)
        });
        await updatePassword(user, newPassword)
        .catch((error) => {
          updateEmail(user, tempEmail)
          return alert(error.message)
        });    
      })
      .catch((error) => {
        return alert("INVALID PASSWORD")
      })
      let imgURL = user.photoURL;
      if (avatar) {
        if (!avatar.type.includes('image')) {
          alert("Please select a image")
          return;
        } else if (avatar.size > 100000) {
          alert("Invalid File Size")
          return;
        } else {
          const path = `UserProfileImage/${user.uid}/${avatar.name}`
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, avatar)
          imgURL = await getDownloadURL(storageRef);
        }       
      }

      const ref = doc(firedb, `users`, user.uid)
      await updateDoc(ref, {
        email: newEmail,
        photoURL: imgURL
      })

      await updateProfile(user, {
        photoURL: imgURL
      })
    }

    if (!user) return <div> loading...</div>
    
    return (
        <div>
          <form className={styles['signup-form']}>
            <h2>{user.displayName} Account Settings</h2>
            <label>
            <span>Email</span>
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
                    value={avatar}
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
            
            <button onClick={updateInfo}>Save</button>
          </form>
        </div>
      )
}