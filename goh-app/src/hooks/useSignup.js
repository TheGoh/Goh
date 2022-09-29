import { useState } from 'react'
import { auth } from '../firebase/config'
import { createUserWithEmailAndPassword } from "firebase/auth";

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
  
    const signup = async (email, password, userid) => {
      setError(null)
      setIsPending(true)
    
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            //TODO add console log for printing error
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
    }
  
    return { signup, error, isPending }
  }