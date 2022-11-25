import { useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, query, where , collection} from "firebase/firestore"
import { useAuthContext } from '../hooks/useAuthContext'
import { firedb } from '../firebase/config';


export const useProjectActions = () => {
    const { user } = useAuthContext();
    const [error, setError] = useState('');

    const projectDelete = async(projectId, projectDtl) => {
        const ref = doc(firedb, `users`, user.uid)

        await getDoc(ref)
            .then (async(doc) => {
                let tempOwnedProjects = doc.data().ownedProjects;
                let tempList = tempOwnedProjects.filter((project) => {
                    if (projectId !== project) return project;
                })
                await updateDoc(ref, {
                     ownedProjects: tempList
                })
            })
        
        /* Delete project id from member project id list */
        projectDtl.memberList["members"].forEach(async(member) => {
        const ref2 = doc(firedb, `users`, member.id)
        //remove from user's project id entry
        await getDoc(ref2)
            .then (async (doc) => {
                let tempOwnedProjects = doc.data().ownedProjects;
                let tempList = tempOwnedProjects.filter((project) => {
                    if (projectId !== project) return project;
                })
                await updateDoc(ref2, {
                        ownedProjects: tempList
                })
            })
        })
    }

    const inviteUser = async( projectId, projectDtl, invite, roleTag) => {
        setError('')
        const size = projectDtl.memberList.members.length;
        if(projectDtl.membersLimit){
            const memberLimit = projectDtl.membersLimit;
            if(size >= memberLimit - 1){
                alert("members exceeds the limitation");
            }
        }

        let ref = collection (firedb, 'users')
        if (invite) {
            ref = query(ref, where("email", "==", invite));
        }

        await getDocs(ref)
            .then((snapshot) => {
                let result = [];
                snapshot.docs.forEach(doc => {
                    result.push({...doc.data(), id: doc.id});
                });

                const receiver_uid = result[0].id;
                const currUserDoc = doc(firedb, `users`, receiver_uid);

                //update user's invitation list
                getDoc(currUserDoc)
                    .then ((doc) => {
                        let invite_list = doc.data().invitations;

                        if (!invite_list[projectId] && !doc.data().ownedProjects.includes(projectId)) {

                            let tempRole = roleTag
                            if (!roleTag) {
                                tempRole = "member"
                            }

                            invite_list[projectId] = {
                                projName: projectDtl.projName,
                                roleTag: tempRole
                            }

                            //notification
                            let message_list = doc.data().my_message;
                            const time = new Date();
                            const message = user.displayName + "invite you to join " + projectDtl.projName;
                            const new_message = {
                                Sender: user.displayName,
                                Time: time,
                                message: message
                            }
                            message_list.push(new_message)

                            //update user metadata
                            updateDoc(currUserDoc, {
                                invitations: invite_list,
                                my_message: message_list
                                }
                            );
                        }
                        else {
                            setError("already in this group")
                        }
                    })
            })
            .catch((err) => {
                setError("Invalid User");
            });

    }


    const getUserInfo = async(userId) => {
        setError('')

        let ref = doc (firedb, 'users', userId)
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
            console.log(snapshot.data())
            return snapshot.data();
        } else {
            setError("INVALID")
        }
    }

    return {projectDelete, inviteUser, getUserInfo, error}
}