import { useState } from 'react'

import { 
    doc,
    getDoc,
    setDoc,
    } from "firebase/firestore"
   
import { firedb } from '../firebase/config';
export const useNotification =()=>{
    const[error, setError] = useState('')
    const createNotification = async(
        ReceiverId,
        message
        ) => {
        setError(null)
    }
    return null
}