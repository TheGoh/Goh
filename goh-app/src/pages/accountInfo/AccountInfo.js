import { getAuth, updatePassword, updateEmail, updateProfile } from "firebase/auth";
import { useState } from "react";
import styles from './AccountInfo.module.css'



export default function AccountInfo() {
    const auth = getAuth();
    const user = auth.currentUser;

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ newDisplayName, setDisplayName ] = useState('');


    function updateInfo() {
      if (user) {
        console.log(user.displayName);
        console.log(newDisplayName);
        updateProfile(user, {displayName: newDisplayName}).then(() => {
          console.log("Display Name updated to", newDisplayName);
        }).catch((error) => {
          console.log(error.message);
        });
        console.log(user.displayName);
      }
    }

    function seeSomething() {
      console.log(user);
    }
    
    return (
        <div>
          <form onSubmit={updateInfo}>
            <h2>Account Information</h2>

            <label>
              <span>Display Name</span>
              <input type = "text"
                        onChange={(e)=>setDisplayName(e.target.value)}
                        value={newDisplayName}
              />
            </label>
            {<button>Save</button>}
          </form>

          {/* Test */}
          <button onClick={seeSomething}>Test</button>
        </div>
      )
}