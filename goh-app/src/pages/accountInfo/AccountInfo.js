import { getAuth, updatePassword, updateEmail, updateProfile } from "firebase/auth";
import { useState } from "react";
import styles from './AccountInfo.module.css'



export default function AccountInfo() {
    const auth = getAuth();
    const user = auth.currentUser;
    const [ newDisplayName, setDisplayName ] = useState('');

    async function updateInfo() {
      console.log('Updating');
      if (user) {
        updateProfile(user, {displayName: newDisplayName})
        .then(() => {
          console.log(user.displayName);
        })
        .catch((error) => {
          console.log(error.message);
        });
        await user.reload();
        user = auth.currentUser;
      }
    }

    function seeSomething() {
      console.log(user.displayName);
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


            {<button>Save</button>}
          </form>
          <button onClick={seeSomething}>Test</button>
        </div>
      )
}