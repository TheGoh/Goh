import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useAuthContext } from '../../hooks/useAuthContext'
import { firedb } from '../../firebase/config';
import { doc, getDoc, onSnapshot,updateDoc } from "firebase/firestore";
import { useDocument } from '../../hooks/useDocument';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useFirestore } from '../../hooks/useFirestore';

export default function PendingInvite() {
    const { user } = useAuthContext()
    const [ inviteList, setinviteList ] = useState([])
    const { documents: userDetail } = useDocument('users', user.uid )
    const [ assign, setAssign ] = useState('')
    const {sendMsg} = useFirestore();
    useEffect(() => {
        if (userDetail) {
            if (inviteList.length !== Object.keys(userDetail.invitations).length) {
                let result = inviteList;
                Object.keys(userDetail.invitations).forEach(item => {
                    if (!result.some( e => e.value == item)) {
                        result.push({value:item, label: userDetail.invitations[item].projName,  id: item, role: userDetail.invitations[item].roleTag});
                    }
                })
                
                setinviteList(result)
                console.log("myList: ", inviteList)
            } 
        }
    }, [userDetail, inviteList]);

    const handleAccept = async(e) => {
        e.preventDefault()
        console.log(assign.id)
        //extract current project and invitations
        let tempList = {};
        let returnList = {};
        if (userDetail) {
            let tempOwnedProjects = userDetail.ownedProjects;
            tempList = {...userDetail.invitations}
            
            Object.keys(tempList).forEach(item => {
                
                if (item != assign.id) {
                    console.log(item)
                    returnList[item] = tempList[item]
                }
            })

            //fetch the target project from database
            const projDocRef = doc(firedb, `projects`, assign.id);
            const projSnapshot = await getDoc(projDocRef);

            //Check if the database has this project
            if (projSnapshot.exists()) {

                //STEP1: push the project id into user ownproject list
                tempOwnedProjects.push(assign.id);
                updateDoc(doc(firedb, `users`, user.uid), { 
                    ownedProjects: tempOwnedProjects,
                    invitations:returnList
                })

                //STEP2: add user id into project memberList
                let MemList = {...projSnapshot.data().memberList}
                let tempRoleList = projSnapshot.data().roleTags;
                if (!tempRoleList.includes(assign.id)) {
                    tempRoleList.push(assign.role);
                }
                const obj = {
                    id: user.uid,
                    displayName: user.displayName,
                    RoleTag: assign.role
                }

                MemList["members"].push(obj)
                updateDoc(projDocRef, {
                    memberList: MemList,
                    roleTags: tempRoleList
                })

            } else {
                //If project doesnt't exist, simply remove the project from the invitation list.
                updateDoc(doc(firedb, `users`, user.uid), { 
                    invitations:returnList
                })
            }
            //notification
            const time = new Date();
            const message = "user " + user.displayName + " accept to join " + projSnapshot.data().projName
            const new_message = {
                Sender: user.displayName,
                Time: time,
                message: message
            }
            sendMsg(projSnapshot.data().ownerid, new_message);        
        }        
    }

    const handleDecline = async(e) => {
        e.preventDefault();
        console.log(assign.id)

        const projDocRef = doc(firedb, `projects`, assign.id);
        const projSnapshot = await getDoc(projDocRef);

        let returnList = {};
        if (userDetail) {
            let tempList = {...userDetail.invitations}

            Object.keys(tempList).forEach(item => {        
                if (item != assign.id) {
                    console.log(item)
                    returnList[item] = tempList[item]
                }
            })
    
            updateDoc(doc(firedb, `users`, user.uid), { invitations:returnList});
            const time = new Date();
            const message = "user " + user.displayName + " reject to join " + projSnapshot.data().projName
            const new_message = {
                Sender: user.displayName,
                Time: time,
                message: message
            }
            sendMsg(projSnapshot.data().ownerid, new_message);  
        }

        
    }
    
    return (
        <div>           
            <form>                
               <h1>Here's your invitation from project manager</h1>
                <Select
                        onChange={(option) => setAssign(option)}
                        options = {inviteList}    
                    />
                <button className = "btn" onClick = {handleAccept}>Accept</button>
                <button className = "btn" onClick = {handleDecline}>Decline</button>
                
            </form>           
        </div>
    )
}