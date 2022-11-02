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
import Button from '@mui/material/Button';
import ClearAllIcon from '@mui/icons-material/ClearAll';


export default function Notification() {
    const { user } = useAuthContext();
    const { documents: userDetail } = useDocument('users', user.uid );
    const [ inviteList, setinviteList ] = useState([]);
    const [ assign, setAssign ] = useState('');
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
    },[userDetail, inviteList]);

    const handleClear = async(e) => {
      e.preventDefault();
      if (userDetail){
        let clear = [];
        await updateDoc(doc(firedb, `users`, user.uid),{
          my_message:clear
        }) 
      }
    }

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
          setAssign('')
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
                    <Grid item xs ={1} key = {msg.Time} sx={{display: 'flex', justifyContent: 'flex-start', marginBottom: '10px'}}>
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

                <Grid item xs={1} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                  <Button onClick={handleClear} variant="contained" endIcon={<ClearAllIcon/>}>Clear messages</Button>
                </Grid>
              </Grid>
            </Grid>

            {/* Invitations */}
            <Grid item xs={2}>
              <Grid container columns={2}>
                <Grid item xs={2} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                  <Paper sx={{width:'80%'}} elevation={0}><h1 className={styles['uniheader']}>Invitations</h1></Paper>
                </Grid>

                <Grid item xs={2}>
                  <Select
                    onChange={(option) => setAssign(option)}
                    options = {inviteList}    
                  />
                </Grid>

                <Grid item xs={1} sx={{marginTop: '20px'}}>
                  <Button onClick={handleAccept}>Accept</Button>
                </Grid>
                <Grid item xs={1} sx={{marginTop: '20px'}}>
                  <Button onClick={handleDecline}>Decline</Button>
                </Grid>

              </Grid>
            </Grid>

          </Grid>
        </Box>
      </Box>
    )

}



