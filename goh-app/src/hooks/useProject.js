import { useState } from 'react'

import { 
    doc,
    getDoc,
    setDoc,
    updateDoc
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
        const currUserDoc = doc(firedb, `users`, ownerid);
        const projSnapshot = await getDoc(projDocRef);

        if (!projSnapshot.exists()) {
            const createdAt = new Date();
            try {
                await setDoc(projDocRef, {
                    id: projid,
                    ownerid,
                    projName,
                    projDescr,
                    createdAt
                });
            } catch (error) {
                console.log('error creating the project', error.message);
            }
        }

        
        getDoc(currUserDoc)
            .then ((doc) => {
                let tempOwnedProjects = doc.data().ownedProjects;
                tempOwnedProjects.push(projid);
                
                updateDoc(currUserDoc, {
                    ownedProjects: tempOwnedProjects
                })
                .then(() => {
                    console.log("update successfully!!!",doc.data().ownedProjects)
                })
            })

    }

    return { createProject, error }
}