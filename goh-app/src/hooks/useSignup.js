import { useState } from 'react'
import { auth } from '../firebase/config'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()
  
    const signup = async (email, password, userid) => {
      setError(null)
      setIsPending(true)
    
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // dispatch login function
            dispatch({ type: 'LOGIN', payload: user})
      
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