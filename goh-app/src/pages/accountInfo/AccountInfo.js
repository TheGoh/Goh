import { getAuth } from "firebase/auth";

export default function AccountInfo() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user !== null) {
        console.log(user.email);
    }
    
    return (
        <div>
          Account Info
        </div>
      )
}