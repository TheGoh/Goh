import { useState } from 'react'

import { 
    doc,
    getDoc,
    setDoc
    } from "firebase/firestore"
   
import { firedb } from '../firebase/config';
import { v4 as uuid } from 'uuid';
//create project hook
export const useProject = () => {
    const [error, setError] = useState('')

    //takes fields and creates a firebase document for a project
    const createProject = async (ownerid, projName, projDescr) => {
        setError(null)

        const projid = uuid();
        const projDocRef = doc(firedb, `projects`, projid);
        const userProjRef = doc(firedb, `users/${ownerid}/tokens`, projid);
        const projSnapshot = await getDoc(projDocRef);
        const userSnapshot = await getDoc(userProjRef);
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

        if (!userSnapshot.exists()) {
            try {
                await setDoc(userProjRef, {
                    projid
                });
            } catch (error) {
                console.log('error creating project token', error.message);
            }
        }

    }

    return { createProject, error }
}