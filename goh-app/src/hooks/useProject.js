import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { 
    getFirestore,
    doc,
    getDoc,
    setDoc
    } from "firebase/firestore"
   
import { firedb } from '../firebase/config';
import { v4 as uuid } from 'uuid';
//create project hook
export const useProject = () => {
    const [error, setError] = useState('')
    const [isPending, setIsPending] = useState('')
    const { dispatch } = useAuthContext();
    //takes fields and creates a firebase document for a project
    const createProject = async (ownerid, projName, projDescr) => {
        setError(null)
        setIsPending(true);
        const projid = uuid();
        const projDocRef = doc(firedb, 'projects', projid);
        const projSnapshot = await getDoc(projDocRef);
        if (!projSnapshot.exists()) {
            const createdAt = new Date();
            try {
                await setDoc(projDocRef, {
                    ownerid,
                    projName,
                    projDescr,
                    createdAt
                });
            } catch (error) {
                console.log('error creating the project', error.message);
            }
        }
    }

    return {createProject, error, isPending}
}