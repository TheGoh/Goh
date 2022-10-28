import { useState, useEffect } from 'react';
import * as React from 'react';
import { styled } from '@mui/material/styles';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
// styles
import styles from './notification_box.css'

import { useFetchProject } from '../../hooks/useFetchProject';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Link } from "react-router-dom";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));


export default function Notification() {
  //current user
    const [curUser, setcurUser] = useState('');
    //current text
    const [curText, setcurText] = useState('');
    //当前的对话框的内容，需要去获取
    //TODO
    const [talkList,settalkList]=useState([])

    //current user list
    const [userData,setUserData]=useState([
    ])
    let myUSerId = 1;

    // get project invitations from other user
    const { user } = useAuthContext();
    const { documents: userDetail } = useFetchProject('users', user.uid );
    useEffect(() => {
      if(userDetail){
        console.log(userDetail.my_message);
      }

    });




      const handleChange = function(event) { 
        setcurText( event.target.value); 
        }

    return(
        <div class='notify'>
        <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {
                userData.map((item,index)=>{

                  if(item.userId != myUSerId){
                    return     ( <React.Fragment> 
                      <ListItem alignItems="flex-start" selected={curUser === item.userId}>
                    <ListItemText
                      primary={item.userName}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" /></React.Fragment>) }
                  }
                   
                )
            }


        </List>
      </div>
    )
}
