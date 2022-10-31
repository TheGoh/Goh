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
    //current text
    const [curText, setcurText] = useState('');
 
    const [talkList,settalkList]=useState([])

    //current user list
    const [userData,setUserData]=useState([])
    let myUSerId = 1;

    // get task status
    const { user } = useAuthContext();
    const { documents: userDetail } = useDocument('users', user.uid );
    let { documents: task_collections } = useCollection(`projects/${userDetail?.ownedProjects[0].id}/tasks`, null);

    // if (task_collections && task_collections.length > 0) {
    //   let arr = talkList;
    //   task_collections.forEach((t, i) => {
    //     let curTextData = {
    //       userName: t.taskName,
    //       userId: i+1,
    //       newMessageTime: new Date().toLocaleTimeString(),
    //       text: t.taskState
    //     };
    //     arr.push(curTextData);
    //   });
    //   settalkList(arr);
    // }
    
    useEffect(() => {
      // get project invitations from other user
      // let invitationList = {...userDetail?.invitations};
      // Object.values(invitationList).forEach(v => {
      //   let msg = {
      //     'userName': 'Project Invitation Notice',
      //     'userId': userDetail.my_message.Sender,
      //     'MessageTime': userDetail.my_message.Time,
      //     'text': userDetail.my_message.message
      //   };
      //   let arr = talkList;
      //   arr.push(msg);
      //   settalkList(arr);
      // });
      if(userDetail){
        console.log(userDetail.my_message);
      }
    });

    return(
        <div class='notify'>
        <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper', visibility: 'hidden' }}>
            {
                userData.map((item,index)=>{

                  if(item.userId != myUSerId){
                    return     ( <React.Fragment> 
                    <ListItemText
                      primary={item.userName}
                    />
                  
                  <Divider variant="inset" component="li" /></React.Fragment>) }
                  }
                   
                )
            }
        </List>        
        </div>
    )

}



