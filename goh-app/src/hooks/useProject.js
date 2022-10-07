import React, { useState } from 'react'
import { useAuthContext } from './useAuthContext'
//create project hook
export const useProject = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext();
    //takes fields and creates a firebase document for a project
    const createProj = async (ownerid, projName, projDescr) => {
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

    return {createProj, error, isPending}
}