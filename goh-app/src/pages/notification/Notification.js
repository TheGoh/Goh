import { useState, useEffect } from 'react';
import * as React from 'react';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

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
        // userDetail.my_message.forEach(msg => {
        //   console.log(msg.message)
        // })
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
      
      <div className="notify_box">
            <div>Message Number: {userDetail.my_message.length}</div>
            {
              userDetail.my_message.length > 0 && userDetail.my_message.map(msg => (
                <div className = "notify_box_text" key = {msg.Time}> {msg.message} </div>
              ))
            }
            <Button onClick={handleClear}>Clear Messages</Button>
      </div>
      
    )

}



