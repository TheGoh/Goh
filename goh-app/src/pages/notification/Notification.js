import { useEffect, useState } from 'react'
import * as React from 'react';
import Select from 'react-select'

import { useDocument } from '../../hooks/useDocument';
import { useAuthContext } from '../../hooks/useAuthContext';
import { firedb } from '../../firebase/config';
import {updateDoc, doc, getDoc } from "firebase/firestore";
import { useFirestore } from '../../hooks/useFirestore';

import styles from './Notification.module.css'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


export default function Notification() {


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
      
      // <div class='notify'>
      //       <ListItem>Message Number: {userDetail.my_message.length}</ListItem>
      //       {
      //         userDetail.my_message.length > 0 && userDetail.my_message.map(msg => (
                
      //           <ListItem className = "notify_box_text" key = {msg.Time}>
      //             <Typography variant="body1" gutterBottom>
      //               {msg.Time.toDate().toString()}<br></br>
      //               Sender: {msg.Sender}<br></br> 
      //               Message:{msg.message}<br></br>
      //               ------------------------------------------------------------------------------------------
                    
      //             </Typography>              
      //           </ListItem>
      //         ))
      //       }
      //       <Button onClick={handleClear}>Clear Messages</Button>
      // </div>
      
      <Box>
        <Box sx={{width:'85%', margin: 'auto', paddingTop:'20px'}}>
          <Grid container columns={4}>
            
            {/* Notifications */}
            <Grid item xs={2}>
              <Grid container columns={1}>
                <Grid item xs={1} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                  <Paper sx={{width:'80%'}} elevation={0}><h1 className={styles['uniheader']}>Inbox</h1></Paper>
                </Grid>
                <Grid item xs={1} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                  <h3 className={styles['uniheader']}>Message received: {userDetail.my_message.length}</h3>
                </Grid>

                {
                  userDetail.my_message.length > 0 && userDetail.my_message.map(msg => (
                    <Grid item xs ={1} sx={{display: 'flex', justifyContent: 'flex-start', marginBottom: '10px'}}>
                      <Paper sx={{ width: "80%"}}>
                        <Grid container columns={1} sx={{width: "95%", p: '15px'}}>
                          <Grid item xs={1} sx={{display: 'flex', justifyContent: 'flex-start'}}>{msg.Time.toDate().toString()}</Grid>
                          <Grid item xs={1} sx={{display: 'flex', justifyContent: 'flex-start'}}>Sender: {msg.Sender}</Grid>
                          <Grid item xs={1} sx={{display: 'flex', justifyContent: 'flex-start'}}>Message:{msg.message}</Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))
                }
              </Grid>
            </Grid>


          </Grid>
        </Box>
      </Box>
    )

}



