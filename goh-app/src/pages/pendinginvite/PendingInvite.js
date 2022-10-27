
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useAuthContext } from '../../hooks/useAuthContext'
import { firedb } from '../../firebase/config';
import { doc, getDoc, onSnapshot,updateDoc } from "firebase/firestore";
import { useFetchProject } from '../../hooks/useFetchProject';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

export default function PendingInvite() {
    const { user } = useAuthContext()
    const [ inviteList, setinviteList ] = useState([])
    const { documents: userDetail } = useFetchProject('users', user.uid )
    const [ assign, setAssign ] = useState('')

    
    useEffect(() => {
        if (userDetail) {
            if (inviteList.length !== Object.keys(userDetail.invitations).length) {
                let result = inviteList;
                Object.keys(userDetail.invitations).forEach(item => {
                    if (!result.some( e => e.value == item)) {
                        result.push({value:item, label: userDetail.invitations[item],  id: item});
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
                const obj = {
                    id: user.uid,
                    displayName: user.displayName
                }
                MemList["members"].push(obj)
                updateDoc(projDocRef, {
                    memberList: MemList
                })

            } else {
                //If project doesnt't exist, simply remove the project from the invitation list.
                updateDoc(doc(firedb, `users`, user.uid), { 
                    invitations:returnList
                })
            }        
        }        
    }

    const handleDecline = (e) => {
        e.preventDefault();
        console.log(assign.id)

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