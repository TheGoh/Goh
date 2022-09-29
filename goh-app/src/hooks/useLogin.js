import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

//firebase imports
import { auth } from '../firebase/config'
import { signInWithEmailAndPassword } from "firebase/auth";


export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    
    const login = (email, password) => {
      setError(null)
      setIsPending(true)
    
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // dispatch login function
            console.log('login function is working!')  
        })
        .catch((error) => {
            //TODO add console log for printing error
            setError(error.message)

        });
    }
  
    return { login, error, isPending }
  }