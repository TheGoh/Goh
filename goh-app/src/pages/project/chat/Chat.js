import React from "react";
import { useParams } from 'react-router-dom';
import { useCollection } from '../../../hooks/useCollection';
import { useDocument } from '../../../hooks/useDocument';
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useState, useEffect } from 'react';
import { useFirestore } from '../../../hooks/useFirestore';

import ScrollToBottom from "react-scroll-to-bottom";
import styles from './Chat.module.css';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import ClearAllIcon from '@mui/icons-material/ClearAll';


export default function Chat() {
    let { projectId } = useParams();
    const { user } = useAuthContext();
    const { documents: projectDtl , error} = useDocument('projects', projectId);
    const { documents: chatLog, error2 } = useCollection(`projects/${projectId}/chats`, null);
    const { sendChatMsg , deleteDocument, error3} = useFirestore();
    const [ MsgList, setMsgList] = useState('');
    //TODO add useCollection

    const [msg, setMsg] = useState('')

    

    const handleSend = () => {
       sendChatMsg(projectId, user.uid, user.displayName, msg);
    }

    const handleDelHistory = () => {
      if (chatLog.length > 0) {
        chatLog.forEach(msg =>{
          deleteDocument(`projects/${projectId}/chats`, msg.id);
        })
      }
      
      
    }

    useEffect(() => {
        if (chatLog) {
            console.log(chatLog);
        }
    }, [chatLog])

    if (error2) {
        return <div> No messages </div>
    }

    if (!chatLog) {
        return <div> Loading ...  </div>
    }

    return (
      <Box sx={{width: '100%', height: '100vh'}}>
        <Paper sx={{padding: '20px', height: '2%'}} className={styles['heading']}>Live Chat
        <Button onClick = {handleDelHistory}><ClearAllIcon/></Button>
        </Paper>
        
        <Box sx={{height: '80%'}} className={styles['scroll-container']}>
          <ScrollToBottom>
            {chatLog.length > 0 && chatLog.map((msg) => {
              return (
                <Box
                  className={user.uid === msg.senderId ? styles['out'] : styles['in']}
                  key = {msg.createAt}
                  elevation={0}
                >
                  <Box sx={{width: '60%'}}>
                    <Box className={styles['meta']}>{msg.senderName}</Box>
                    <Box className={styles['content']}>{msg.message}</Box>
                    <Box className={styles['meta']}>{msg.createAt.toDate().toLocaleString().split(', ')[1]}</Box>
                  </Box>
                </Box>
              )
            })}
          </ScrollToBottom>
        </Box>
        <Box sx={{height: "9%"}}></Box>
        <Box sx={{height: "6%"}} elevation={3}>
          <TextField
            id="outlined-basic"
            variant="standard"
            value={msg}
            onChange={(event) => {
              setMsg(event.target.value);
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter") handleSend();
            }}
            sx={{ ml: 1, flex: 1, width:"80%"}}
          />
          <IconButton onClick={handleSend}><SendIcon/></IconButton>
        </Box>
        
        {/* <div className={styles['chat-window']}>
          <div className={styles['chat-header']}>
            <p>Live Chat</p>
          </div>
          <div className={styles['chat-body']}>
            <ScrollToBottom className={styles['message-container']}>
              {chatLog.length > 0 && chatLog.map((msg) => {
                return (
                  <div
                    className={styles['message']}
                    id={user.uid === msg.senderId ? styles['other'] : styles['you']}
                  >
                    <div>
                      <div className={styles['message-content']}>
                        <p>{msg.message}</p>
                      </div>
                      <div className={styles['message-meta']}>
                        <p id="time">{msg.createAt.toDate().toLocaleString()}: </p>
                        <p id="author">{msg.senderName}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </ScrollToBottom>
          </div>
      <div className={styles['chat-footer']}>
        <input
          type="text"
          value={msg}
          placeholder="Hey..."
          onChange={(event) => {
            setMsg(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && handleSend();
          }}
        />
        <button onClick={handleSend}>&#9658;</button>
      </div>
    </div> */}
    </Box>
    )
}