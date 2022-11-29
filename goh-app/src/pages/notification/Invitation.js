import { useEffect, useState, useRef } from 'react'
import * as React from 'react';

import { useDocument } from '../../hooks/useDocument';
import { useAuthContext } from '../../hooks/useAuthContext';
import { firedb } from '../../firebase/config';
import {updateDoc, doc, getDoc } from "firebase/firestore";
import { useFirestore } from '../../hooks/useFirestore';

import styles from './Notification.module.css';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import RsvpIcon from '@mui/icons-material/Rsvp';


export default function Invitation() {
    const { user } = useAuthContext();
    const { documents: userDetail } = useDocument('users', user.uid );
    const [ inviteList, setinviteList ] = useState('');
    const { sendMsg } = useFirestore();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    // Menu controls
    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };
    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
  
      setOpen(false);
    };
    function handleListKeyDown(event) {
      if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
      } else if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
      if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
      }
  
      prevOpen.current = open;
    }, [open]);

    useEffect(() => {
        if (userDetail) {
          let result = []
            Object.keys(userDetail.invitations).forEach(item => {           
              result.push({label: userDetail.invitations[item].projName,  id: item, role: userDetail.invitations[item].roleTag});        
            })
            setinviteList(result)
            //console.log("myList: ", inviteList)
        }
    },[userDetail]);

    const handleAccept = async(assign) => {
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
  
    const handleDecline = async(assign) => {
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

    if (!userDetail) {
        return <div> Loading... </div>
    }
    return (
        
            <Button
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? 'composition-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <RsvpIcon/>
                
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    placement="bottom-start"
                    transition
                    disablePortal
                    className={styles['paper-container']}
                >
                    {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                        transformOrigin:
                            placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}
                    >
                        <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                            <MenuList
                            autoFocusItem={open}
                            id="composition-menu"
                            aria-labelledby="composition-button"
                            onKeyDown={handleListKeyDown}
                            >
                            {
                                inviteList.length > 0 && inviteList.map((invitation) => 
                                    <MenuItem sx={{textTransform: "none"}}>
                                        From Project: {invitation.label} |   Your Role: {invitation.role}
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <ButtonGroup>
                                            <Button onClick={() => {handleAccept(invitation)}} color="success"><CheckIcon/></Button> 
                                            <Button onClick={() => {handleDecline(invitation)}} color="error"><CloseIcon/></Button>   
                                        </ButtonGroup>   
                                    </MenuItem>
                                )
                            }
                            </MenuList>
                        </ClickAwayListener>
                        </Paper>
                    </Grow>
                    )}
                </Popper>
            </Button>
            
        
        
        
    )

}