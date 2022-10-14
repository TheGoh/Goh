import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

//firebase imports
import { auth, createUserDocumentFromAuth } from '../firebase/config'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";


export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()
  
    const signup = (email, password, userid) => {
      setError(null)
      setIsPending(true)

      if (userid.length === 0) {
        setError("Invalid User ID");
        setIsPending(false)
        return;
      }
    
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            updateProfile(user,{displayName:userid})
            createUserDocumentFromAuth(user, userid);
            // dispatch login function
            dispatch({ type: 'LOGIN', payload: user})      
        })
        .catch((error) => {
            //TODO add console log for printing error
            setIsPending(false);
            setError(error.message)

        });
      
    }
  
    return { signup, error, isPending }
  }