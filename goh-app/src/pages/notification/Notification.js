import { useState, useEffect } from 'react';
import * as React from 'react';

import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';

import { useDocument } from '../../hooks/useDocument';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';



export default function Notification() {
    //current text
    const [curText, setcurText] = useState('');
 
    const [talkList,settalkList]=useState([])

    //current user list
    const [userData,setUserData]=useState([])
    let myUSerId = 1;

    // get task status
    const { user } = useAuthContext();
    const { documents: userDetail } = useDocument('users', user.uid );
    
    useEffect(() => {
      if(userDetail){
        console.log(userDetail.my_message);
      }
    });
    // const handleNotification = async(e) => {
    //   e.preventDefault();


    // }

    return(
        <div class='notify'>      
        </div>
    )

}



