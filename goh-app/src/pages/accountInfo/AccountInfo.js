import { 
  getAuth,       
  updatePassword, 
  updateEmail, 
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";
import { useState } from "react";
import styles from './AccountInfo.module.css';


export default function AccountInfo() {
    const auth = getAuth();
    const user = auth.currentUser;
    const [ newDisplayName, setDisplayName ] = useState('');
    const [ newEmail, setEmail ] = useState('');

    function updateInfo() {
      console.log('Updating');
      if (user) {
        //Update displayName and photo
        if (user.displayName !== newDisplayName) {
          updateProfile(user, {displayName: newDisplayName}).then(() => {}).catch((error) => {console.log(error.message);});
        }

        //TODO: update more attributes in account

        user.reload();
      }
    }

    function resetPassword() {
      //TODO OPTIONAL: update password reset page UI
      sendPasswordResetEmail(auth, user.email).then(() => {}).catch((error) => {console.log(error.message);})
    }
    
    return (
        <div>
          <form onSubmit={updateInfo} className={styles['signup-form']}>
            <h2>Account Information</h2>

            <label>
              <span>Display Name</span>
              <input
                    type = "text"
                    onChange={(e)=>{
                      setDisplayName(e.target.value)
                    }}
                    value={newDisplayName}
              />
            </label>
            
            <label>
              <span>Email</span>
              <input
                    type = "text"
                    onChange={(e)=>{
                      setEmail(e.target.value)
                    }}
                    value={newEmail}
              />
            </label>
            {<button>Save</button>}
          </form>
          <div className={styles['passwd']}>
            <button onClick={resetPassword}>Forgot Password?</button>
          </div>
          {/* <button onClick={seeSomething}>Test</button> */}
        </div>
      )
}