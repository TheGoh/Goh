import { getAuth } from "firebase/auth";
import styles from './AccountInfo.module.css'



export default function AccountInfo() {
    const auth = getAuth();
    const user = auth.currentUser;

    function getUser() {
      if (user !== null) {
        console.log(user.email);
        console.log(user.displayName);
      }
    }
    
    return (
        <div>
          <h1>Account Info</h1>
          <button onClick={getUser}>User</button>
        </div>
      )
}