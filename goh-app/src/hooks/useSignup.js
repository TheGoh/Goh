import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

//firebase imports
import { auth, createUserDocumentFromAuth } from '../firebase/config'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()
  
    const signup = async (email, password, userid, avatar) => {
      setError(null)
      setIsPending(true)

        if (userid.length === 0) {
          setError("Invalid User ID");
          setIsPending(false)
          return;
        }
  
        if (avatar && !avatar.type.includes('image')) {
          setError('Please select a image')
          setIsPending(false)
          return;
        }
  
        if (avatar && avatar.size > 100000) {
          setError('Invalid File Size')
          setIsPending(false)
          return;
        }
      
        await createUserWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
              // Signed in 
              const user = userCredential.user;
              const path = (avatar) ? `UserProfileImage/${user.uid}/${avatar.name}` : `UserProfileImage/defaultImg.png`;
              const storageRef = ref(storage, path);
              if (avatar) {
                await uploadBytes(storageRef, avatar)
              } 
              const imgURL = await getDownloadURL(storageRef);
              await updateProfile(user,{
                displayName:userid,
                photoURL: imgURL
              })
              createUserDocumentFromAuth(user, userid, imgURL);
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