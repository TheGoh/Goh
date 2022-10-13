import { useState } from 'react'

import { 
    doc,
    getDoc,
    setDoc,
    updateDoc
    } from "firebase/firestore"
   
import { firedb } from '../firebase/config';


//create project hook
export const useProject = () => {
    const [error, setError] = useState('')

    //takes fields and creates a firebase document for a project
    const createProject = async (ownerid, projid, projName, projDescr) => {
        setError(null)
        const projDocRef = doc(firedb, `projects`, projid);
        const currUserDoc = doc(firedb, `users`, ownerid);
        const projSnapshot = await getDoc(projDocRef);

        if (!projSnapshot.exists()) {
            const createdAt = new Date();
            const memberList = [ownerid];
            try {
                await setDoc(projDocRef, {
                    id: projid,
                    ownerid,
                    projName,
                    projDescr,
                    createdAt,
                    memberList
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
                //console.log("update successfully!!!",doc.data().ownedProjects)
                
            })
        })

    }

    return { createProject, error }
}