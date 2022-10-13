import { useState } from 'react'

import { 
    doc,
    getDoc,
    setDoc,
    } from "firebase/firestore"
   
import { firedb } from '../firebase/config';


//create task hook
export const useTask = () => {
    const [error, setError] = useState('')

    //takes fields and creates a firebase document for a tASK
    const createTask = async (
        projId, 
        ownerid,
        taskId,
        taskName,
        taskDescr
        ) => {
        setError(null)

        const pid = projId;
        
        const taskDocRef = doc(firedb, `projects/${pid}/tasks`, taskId);
        //const currUserDoc = doc(firedb, `users`, ownerid);
        const taskSnapshot = await getDoc(taskDocRef);
        if (!taskSnapshot.exists()) {
            const createdAt = new Date();
            try {
                await setDoc(taskDocRef, {
                    taskId,
                    projId,
                    ownerid,
                    taskName,
                    taskDescr,
                    createdAt,
                });
            } catch (error) {
                console.log('error creating the task', error.message);
            }
        }
    }

    return { createTask, error }
}