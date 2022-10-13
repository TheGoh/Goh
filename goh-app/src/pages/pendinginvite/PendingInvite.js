
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useAuthContext } from '../../hooks/useAuthContext'
import { firedb } from '../../firebase/config';
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useFetchProject } from '../../hooks/useFetchProject';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';


export default function PendingInvite() {
    const { user } = useAuthContext()
    const [ inviteList, setinviteList ] = useState([])
    const { documents: userDetail } = useFetchProject('users', user.uid )
    
    useEffect(() => {
        if (userDetail) {
            if (inviteList.length !== Object.keys(userDetail.invitations).length) {
                let result = inviteList;
                Object.keys(userDetail.invitations).forEach(item => {
                    if (!result.some( e => e.value == item)) {
                        result.push({value:item, label: userDetail.invitations[item]});
                    }
                })
                
                setinviteList(result)
                console.log("myList: ", inviteList)
            } 
        }
    }, [userDetail, inviteList]);

    const handleAccept = () => {
       
    }
    const handleReject = () => {

    }

    
    return (
        <div> 
            <h1>Here's your invitation from project manager</h1>
            <Button variant="contained" onClick={handleAccept}>Accept</Button>
            <Button variant="contained" onClick={handleReject}>Reject</Button>
            <Select
                options = {inviteList}
            />
        </div>
    )
}