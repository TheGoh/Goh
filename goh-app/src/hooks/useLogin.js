import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

//firebase imports
import { auth } from '../firebase/config'
import { signInWithEmailAndPassword } from "firebase/auth";


export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()
    
    const login = (email, password) => {
      setError(null)
      setIsPending(true)
    
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // dispatch login function
            dispatch({ type: 'LOGIN', payload: user})
        })
        .catch((error) => {
            setIsPending(false)
            setError(error.message)

        });
    }
  
    return { login, error, isPending }
  }