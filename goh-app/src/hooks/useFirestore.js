import { useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { useAuthContext } from '../hooks/useAuthContext'
import { firedb } from '../firebase/config';

export const useFirestore = () => {
    const [error, setError] = useState(null);
    const { user } = useAuthContext();



    /* *** FUNCTION TO CREATE A NEW PROJECT INTO PROJECTS COLLECTION *** */
    const createProject = async (ownerid, projid, projName, projDescr) => {
        setError(null)
        const projDocRef = doc(firedb, `projects`, projid);
        const currUserDoc = doc(firedb, `users`, ownerid);
        const projSnapshot = await getDoc(projDocRef);

        if (!projSnapshot.exists()) {
            const createdAt = new Date();
            const obj = {
                id: ownerid,
                displayName: user.displayName
            }
            const memberList = { "owner": [obj], "members":[] };
            try {
                await setDoc(projDocRef, {
                    id: projid,
                    ownerid,
                    projName,
                    projDescr,
                    createdAt,
                    memberList: memberList,
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




    /* *** FUNCTION TO CREATE A NEW TASK IN SPECIFIC PROJECT *** */
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
            const taskState = "TODO";
            const currUserId = "";
            try {
                await setDoc(taskDocRef, {
                    taskId,
                    projId,
                    ownerid,
                    currUserId,
                    taskName,
                    taskDescr,
                    createdAt,
                    taskState
                });
            } catch (error) {
                console.log('error creating the task', error.message);
            }
        }
    }
    



    /* *** FUNCTION TO DELETE A SPECIFIC DOCUMENT IN DATABASE *** */
    const deleteDocument = async(docRef, id) => {
        let ref = doc(firedb, docRef, id)

        await deleteDoc(ref)
            .catch(error => {
                setError(error.message)
            })
    }




    /* *** FUNCTION TO MODIFY A DOCUMENT METADATA *** */
    const modifyDocument = (docRef, id, projName, projDescr) => {
        let ref = doc(firedb, docRef, id)
        updateDoc(ref, {projName: projName }).catch(error => {
                setError(error.message)
            })
        updateDoc(ref, {projDescr: projDescr}).catch(error => {
                setError(error.message)
            })
        
    }



    /* *** FUNCTION TO MODIFY A TASK METADATA *** */
    const modifyTask = (docRef, id, taskName, taskDescr) => {
        let ref = doc(firedb, docRef, id)
        updateDoc(ref, {taskName: taskName }).catch(error => {
                setError(error.message)
            })
        updateDoc(ref, {taskDescr: taskDescr}).catch(error => {
                setError(error.message)
            })
        
    }

    /* 
        NOTICE：
        
        Add more function if needed, and also add the function name into the "return"
    
    
    */


    return { createProject, createTask , deleteDocument, modifyDocument, modifyTask, error}
}