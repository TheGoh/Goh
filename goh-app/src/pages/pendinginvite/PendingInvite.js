
import { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { firedb } from '../../firebase/config';
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useFetchProject } from '../../hooks/useFetchProject';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';





export default function PendingInvite() {
    const { user } = useAuthContext()
    const [ inviteList, setinviteList ] = useState([])
    const { documents: userDetail } = useFetchProject('users', user.uid );
    const [ selected, setSelected ] = useState('');
    const [ invite_ids, setInviteIds ] = useState('');
    const [ invite_dict, setInviteDict ] = useState('');
    
    useEffect(() => {
        if (userDetail) {
            if (inviteList.length !== Object.keys(userDetail.invitations).length) {
                let result = inviteList;
                Object.keys(userDetail.invitations).forEach(item => {
                    if (!result.some( e => e.value == item)) {
                        result.push({value:item, label: userDetail.invitations[item]});
                    }
                })
                
                setinviteList(result);
                console.log("myList: ", inviteList);

                let temp_ids = [];
                let temp_dict = {};
                inviteList.forEach(obj => {
                    temp_ids.push(obj.value);
                    temp_dict[obj.value] = obj.label;
                });
                setInviteIds(temp_ids);
                setInviteDict(temp_dict);
            } 
        }
    }, [userDetail, inviteList]);

    const handleAccept = () => {
       
    }
    const handleReject = () => {

    }
    const handleOption = (e) => {
        console.log(e.target.value);
        setSelected(e.target.value);
    }

    if (inviteList === undefined || inviteList === null) {
        return (<div>Loading...</div>);
    }
    return (
        <div> 
            <h1>Here's your invitation from project manager</h1>
            <Button variant="contained" onClick={handleAccept}>Accept</Button>
            <Button variant="contained" onClick={handleReject}>Reject</Button>
            <Select 
                value={selected}
                label="invitations"
                sx={{width: '400px'}}
                onChange={handleOption}
            >
                {invite_ids.length > 0 && invite_ids.map((id) => 
                    <MenuItem value={id}>{invite_dict[id]}</MenuItem>
                )}
            </Select>
        </div>
    )
}