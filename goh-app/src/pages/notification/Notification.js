import { useState, useEffect } from 'react';
import * as React from 'react';

import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { useDocument } from '../../hooks/useDocument';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { firedb } from '../../firebase/config';
import {updateDoc, doc} from "firebase/firestore";


export default function Notification() {
    //current text
    const [curText, setcurText] = useState('');
 
    const [talkList,settalkList]=useState([])

    //current user list
    const [userData,setUserData]=useState([])

    // get task status
    const { user } = useAuthContext();
    const { documents: userDetail } = useDocument('users', user.uid );
    useEffect(() => {
      if(userDetail){
        console.log(userDetail.my_message);
      }
    });

    const handleClear = async(e) => {
      e.preventDefault();
      if (userDetail){
        let clear = [];
        await updateDoc(doc(firedb, `users`, user.uid),{
          my_message:clear
        })
        
      }

    }

    return(
      <Grid container sx={{marginTop: '200px'}} columns={1}>
            <Button onClick={handleClear}>Clear Messages</Button>
      </Grid>
      
    )

}



