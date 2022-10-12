import { useState } from 'react'

import { 
    doc,
    getDoc,
    setDoc,
    updateDoc
    } from "firebase/firestore"
   
import { firedb } from '../firebase/config';
import { v4 as uuid } from 'uuid';


//create task hook
export const useTask = () => {
    const [error, setError] = useState('')

    //takes fields and creates a firebase document for a tASK
    const createTask = async (parentId, ownerid, taskName, taskDescr) => {
        setError(null)

        const taskid = uuid();
        const taskDocRef = doc(firedb, `tasks`, taskid);
        const currUserDoc = doc(firedb, `users`, ownerid);
        const taskSnapshot = await getDoc(taskDocRef);

        if (!taskSnapshot.exists()) {
            const createdAt = new Date();
            try {
                await setDoc(taskDocRef, {
                    id: taskid,
                    parentId,
                    ownerid,
                    taskName,
                    taskDescr,
                    createdAt
                });
            } catch (error) {
                console.log('error creating the taskect', error.message);
            }
        }

        


    }

    return { createTask, error }
}