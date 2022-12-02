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
import ClearAllIcon from '@mui/icons-material/ClearAll';
import IconButton from '@mui/material/IconButton';
import Popper from '@mui/material/Popper';
import ButtonGroup from '@mui/material/ButtonGroup';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

export default function Notification() {
    const { user } = useAuthContext();
    const { documents: userDetail } = useDocument('users', user.uid );
    const [ inviteList, setinviteList ] = useState('');
    const { sendMsg } = useFirestore();

    // Notification menu controls
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
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

    // Invitation menu controls

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
      
      <Button
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="inherit"
      >
        {userDetail.my_message.length > 0 ? <NotificationsActiveIcon/> : <NotificationsNoneIcon/>}


        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
          className={styles['paper-container']}
          sx={{height: "400px", overflowY: "scroll"}}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper elevation={3}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    {userDetail.my_message.length > 0 && userDetail.my_message.map(msg => (
                      <MenuItem sx={{textAlign: "left"}} onClick={handleClose}>
                      {msg.Time.toDate().toLocaleString()}<br></br>
                      Sender: {msg.Sender}<br></br>
                      {msg.message}
                      </MenuItem>
                    ))}

                    {userDetail.my_message.length !== 0 ?
                      <MenuItem onClick={handleClear} >
                        <Button onClick={handleClear} variant="contained" endicon={<ClearAllIcon/>} sx={{textTransform: "none"}}>
                          Clear all messages
                        </Button>
                      </MenuItem>
                      :
                      <MenuItem onClick={handleClose}>Empty notification</MenuItem>
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



