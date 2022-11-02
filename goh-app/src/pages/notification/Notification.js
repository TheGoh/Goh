import { useEffect } from 'react';
import * as React from 'react';

import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


import { useDocument } from '../../hooks/useDocument';
import { useAuthContext } from '../../hooks/useAuthContext';
import { firedb } from '../../firebase/config';
import {updateDoc, doc} from "firebase/firestore";



export default function Notification() {
    //current text

    // get task status
    const { user } = useAuthContext();
    const { documents: userDetail } = useDocument('users', user.uid );
    useEffect(() => {
      if(userDetail){
        console.log(userDetail.my_message)
      }
    },[userDetail]);

    const handleClear = async(e) => {
      e.preventDefault();
      if (userDetail){
        let clear = [];
        await updateDoc(doc(firedb, `users`, user.uid),{
          my_message:clear
        })
        
      }

    }

    if (!userDetail) {
      return <div> Loading... </div>
    }

    return(
      
      <div class='notify'>
            <ListItem>Message Number: {userDetail.my_message.length}</ListItem>
            {
              userDetail.my_message.length > 0 && userDetail.my_message.map(msg => (
                
                <ListItem className = "notify_box_text" key = {msg.Time}>
                  <Typography variant="body1" gutterBottom>
                    {msg.Time.toDate().toString()}<br></br>
                    Sender: {msg.Sender}<br></br> 
                    Message:{msg.message}<br></br>
                    ------------------------------------------------------------------------------------------
                    
                  </Typography>              
                </ListItem>
              ))
            }
            <Button onClick={handleClear}>Clear Messages</Button>
      </div>
      
    )

}



