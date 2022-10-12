import { useState } from 'react';
import { getAuth } from 'firebase/auth'
import * as React from 'react';
// import firebase from 'firebase/app';
import 'firebase/firestore';
//Functionality
import { firedb } from '../../firebase/config';
import { 
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,query,getFirestore
  } from "firebase/firestore"
  import { useCollection } from '../../hooks/useCollection';

  /* Initialize firebase */
import { initializeApp } from "firebase/app";
 
import { styled } from '@mui/material/styles';
import { useAuthContext } from '../../hooks/useAuthContext'

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
    const [talkList,settalkList]=useState([
      {'userName':'zhangsan',userId:1,
      'MessageTime': 12,'text': '你'},
      {'userName':'qifei',userId:1,
      'MessageTime': 13,'text': '你好'},
      {'userName':'zhangsan',userId:1,
      'MessageTime': 14,'text': '我'},
    ])

    // current user list
    const [userData,setUserData]=useState([
      {'userName':'qifei',userId:1,
      'newMessageTime': 12,'readMessageTime': 10},
      {'userName':'ziyang',userId:2,
      'newMessageTime': 12,'readMessageTime': 10},
      {'userName':'zhangsan',userId:3,
      'newMessageTime': 12,'readMessageTime': 13}
    ])
    let myUSerId = 1;

    const { user } = useAuthContext()
    const auth = getAuth();

    //todo ,获取全部的用户列表
    const fff = useCollection('users',null);

    const {documents: allUsers} = useCollection('users',null);
    console.log(allUsers);

    // const user = getAuth().currentUser;
    // const currUserDoc = doc(firedb, `users`, user.uid);
    console.log(auth)
    let myUser = auth.currentUser;
    // const currUserDoc = query( collection(firedb, `users`));
    // console.log(currUserDoc)



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

      

   

    return(
        <div class='notify'>

        <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {
                !allUsers ? '': allUsers.map((item,index)=>{

                  if(item.userId != myUSerId){
                    return     ( <React.Fragment> 
                      <ListItem alignItems="flex-start" selected={curUser === item.userId} onClick={(e)=>{openUserDialog(item)}}>
                    <ListItemAvatar>
                      {
                        item.newMessageTime <= item.readMessageTime ? (
                          <Avatar alt={item.displayName} src="/static/images/avatar/1.jpg" />
                        ) :(
                          <StyledBadge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                        >
                          <Avatar alt={item.displayName} src="/static/images/avatar/1.jpg" />
                        </StyledBadge>
                        )
                      }
                   
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.displayName}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" /></React.Fragment>) }
                  }
                   
                )
            }


        </List>
{
  //只有当点击用户时，才会出现对话框
 curUser == ''? '':
    <Box  sx={{ width:'50%'}}   class='notify_box'>
    <div class='notify_box_content'>
    <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {
                talkList.map((item,index)=>{
                  
                    return     ( <React.Fragment> <ListItem alignItems="flex-start" >
                    <ListItemAvatar sx={{ width:'20',height:'10%'}}>
                      <Avatar alt={item.userName} src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.userName}
                      secondary={item.text}
                    />
                   
                  </ListItem>
                  </React.Fragment>) }
                   
                )
            }
        </List>

    </div>
    <textarea class='notify_box_text' value={curText} onChange={handleChange}></textarea>
    <Button  onClick={submitText}  className='notify_box_button' sx={{width: '10%'}} variant="contained" type="submit">submit</Button> 
  </Box>
}
        
        </div>
    )

}