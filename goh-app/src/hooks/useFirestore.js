import { useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, query, where , collection} from "firebase/firestore"
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
            const roleTags = [];
            try {
                await setDoc(projDocRef, {
                    id: projid,
                    ownerid,
                    projName,
                    projDescr,
                    createdAt,
                    memberList: memberList,
                    roleTags: roleTags,
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

    /* FUNCTION TO SEND A MESSAGE */
    const sendChatMsg = async(projid, senderId, senderName, message) => {
        setError(null)

        const createAt = new Date();
        const chatCollection = doc(firedb, `projects/${projid}/chats`,createAt.toString());
        const chatSnapShot = await getDoc(chatCollection);
        console.log("chat snapshot")
        if (!chatSnapShot.exists()) {
            await setDoc(chatCollection, {
                createAt,
                senderId,
                senderName,
                message
            })
            .then(()=> {console.log("Update messages!!!")})
            .catch(error => {
                console.log(error.message)
                setError(error.message)
            })
        }
    }


    /* *** FUNCTION TO CREATE A NEW TASK IN SPECIFIC PROJECT *** */
    const createTask = async (
        projId,
        ownerid,
        currMemId,
        taskId,
        taskName,
        taskDescr,
        dueDate,
        prio
        ) => {
        setError(null)


        const pid = projId;

        const checkRef = collection(firedb, `projects/${pid}/tasks`);
        const q = query(checkRef, where("taskName", "==", taskName));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size) {
            setError("Duplicated TaskName")
            return;
        }

        const taskDocRef = doc(firedb, `projects/${pid}/tasks`, taskId);
        const taskSnapshot = await getDoc(taskDocRef);

        if (!taskSnapshot.exists()) {
            const createdAt = new Date();
            let taskState = "TODO";
            const currUserId = currMemId;
            const comments = [];
            const attachURL = '';
            if (currUserId !== '') {
                taskState = "IN PROGRESS"
            }
            try {
                await setDoc(taskDocRef, {
                    taskId,
                    projId,
                    ownerid,
                    currUserId,
                    taskName,
                    taskDescr,
                    createdAt,
                    taskState,
                    comments,
                    dueDate,
                    prio,
                    attachURL
                });
            } catch (error) {
                console.log('error creating the task', error.message);
            }

        }
    }




    /* *** FUNCTION TO DELETE A SPECIFIC DOCUMENT IN DATABASE *** */
    const deleteDocument = async(docRef, id) => {
        let ref = doc(firedb, docRef, id);

        await deleteDoc(ref)
            .catch(error => {
                setError(error.message);
            })
    }




    /* *** FUNCTION TO MODIFY A DOCUMENT METADATA *** */
    const modifyDocument = (docRef, id, projName, projDescr) => {
        let ref = doc(firedb, docRef, id)
        updateDoc(ref, {projName: projName }).catch(error => {
            setError(error.message);
        })
        updateDoc(ref, {projDescr: projDescr}).catch(error => {
            setError(error.message)
        });

    }



    /* *** FUNCTION TO MODIFY A TASK METADATA *** */
    const modifyTask = (docRef, id, taskName, taskDescr, prio) => {
        let ref = doc(firedb, docRef, id);
        updateDoc(ref, {taskName: taskName }).catch(error => {
            setError(error.message);
        });
        updateDoc(ref, {taskDescr: taskDescr}).catch(error => {
            setError(error.message);
        })
        updateDoc(ref, {prio: prio}).catch(error => {
            setError(error.message);
        })

    }

    const sendMsg = async (recv_id, message) => {
        const ref = doc(firedb, `users`, recv_id);
        await getDoc(ref)
            .then(async (doc) => {
                let msg_temp_list = doc.data().my_message;
                msg_temp_list.push(message);
                await updateDoc(ref, {
                    my_message: msg_temp_list
                });
            })
    }

    /*
        NOTICE：

        Add more function if needed, and also add the function name into the "return"


    */

    return { createProject, createTask , deleteDocument, modifyDocument, modifyTask, sendMsg, sendChatMsg, error}
}