
import { useState } from 'react'
import { doc, getDoc, setDoc} from "firebase/firestore"
import { firedb } from '../firebase/config';

export const useAddDoc = () => {
    const [error, setError] = useState(null)

    const addDoc = async (ref, id, struct) => {
        setError(null)

        const docRef = doc(firedb, ref, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) {
            try {
                await setDoc(docRef, {
                    struct
                });
            } catch (error) {
                console.log('error creating collection', error.message)
            }
        } 
    }
    return {addDoc, error}
}
