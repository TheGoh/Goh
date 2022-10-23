import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth'
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
    const [curUser, setcurUser] = useState('ziyang');
    //current text
    const [curText, setcurText] = useState('');
    //当前的对话框的内容，需要去获取
    //TODO
    const [talkList,settalkList]=useState([])

    //current user list
    const [userData,setUserData]=useState([
      {'userName':'qifei',userId:1,
      'newMessageTime': 12,'readMessageTime': 10},
      {'userName':'ziyang',userId:2,
      'newMessageTime': 12,'readMessageTime': 10}
    ])
    let myUSerId = 1;

    // get project invitations from other user
    const { user } = useAuthContext();
    const { documents: userDetail } = useFetchProject('users', user.uid );
    useEffect(() => {
      let invitationList = {...userDetail?.invitations};
      Object.values(invitationList).forEach(v => {
        let msg = {
          'userName': 'Project Invitation Notice',
          'userId': 1,
          'MessageTime': 12,
          'text': v
        };
        let arr = talkList;
        arr.push(msg);
        settalkList(arr);
      });
    });

    //open dialog box
      const openUserDialog = (userInfo) => {
        setcurUser(userInfo.userId);
        for (let index = 0; index < userData.length; index++) {
          const element = userData[index];
          if(element.userId == userInfo.userId){
            element.readMessageTime =element.newMessageTime;
          }
        }
        console.log(userData)
        setUserData(userData)
        //TODO，获取与该用户的对话记录
      }

      //send text
      const submitText = (e) => {
        let curTextData = {'userName':'qifei',userId:1,
        'newMessageTime': +new Date(),text:curText}
        settalkList(talkList.concat(curTextData))
        //TODO 此处要调用发送到后端的接口信息
        setcurText('');
        e.preventDefault();
        
      }

      const handleChange = function(event) { 
        setcurText( event.target.value); 
        }


    //todo 获取用户列表信息

    return(
        <div class='notify'>
        <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper', visibility: 'hidden' }}>
            {
                userData.map((item,index)=>{

                  if(item.userId != myUSerId){
                    return     ( <React.Fragment> 
                      <ListItem alignItems="flex-start" selected={curUser === item.userId} onClick={(e)=>{openUserDialog(item)}}>
                    <ListItemAvatar>
                      {
                        item.newMessageTime <= item.readMessageTime ? (
                          <Avatar alt={item.userName} src="/static/images/avatar/1.jpg" />
                        ) :(
                          <StyledBadge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                        >
                          <Avatar alt={item.userName} src="/static/images/avatar/1.jpg" />
                        </StyledBadge>
                        )
                      }
                   
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.userName}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" /></React.Fragment>) }
                  }
                   
                )
            }


        </List>
{
  //只有当点击用户时，才会出现对话框
// curUser == ''? '':
    <Box  sx={{ width:'50%'}}   class='notify_box'>
    <div class='notify_box_content'>
    <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {
                talkList.map((item,index)=>{
                  if (item.userName == 'Project Invitation Notice') {
                    return ( <React.Fragment> <ListItem alignItems="flex-start" >
                      <ListItemAvatar sx={{ width:'20',height:'10%'}}>
                        <Avatar alt={item.userName} src="/static/images/avatar/1.jpg" />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.userName}
                        secondary={item.text}
                      />
                      <Link to="/invitation">more operations</Link>
                    </ListItem>
                    </React.Fragment>) 
                  } 

                  return ( <React.Fragment> <ListItem alignItems="flex-start" >
                    <ListItemAvatar sx={{ width:'20',height:'10%'}}>
                      <Avatar alt={item.userName} src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.userName}
                      secondary={item.text}
                    />
                  </ListItem>
                  </React.Fragment>) 
                }
                   
                )
            }
        </List>

    </div>
    <textarea sx={{ visibility: 'hidden' }} class='notify_box_text' value={curText} onChange={handleChange}></textarea>
    <Button sx={{ visibility: 'hidden' }}  onClick={submitText}  className='notify_box_button' sx={{width: '10%'}} variant="contained" type="submit">submit</Button> 
  </Box>
}
        
        </div>
    )

}
