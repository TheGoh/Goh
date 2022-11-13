import React from "react";
import { useParams } from 'react-router-dom';
import { useCollection } from '../../../hooks/useCollection';
import { useDocument } from '../../../hooks/useDocument';
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useState, useEffect } from 'react';
import { useFirestore } from '../../../hooks/useFirestore';


import TextareaAutosize from '@mui/material/TextareaAutosize';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

export default function Chat() {
    let { projectId } = useParams();
    const { user } = useAuthContext();
    const { documents: projectDtl , error} = useDocument('projects', projectId);
    const { documents: chatLog, error2 } = useCollection(`projects/${projectId}/chats`, null);
    const { sendChatMsg , error3} = useFirestore();
    const [ MsgList, setMsgList] = useState('');
    //TODO add useCollection

    const [msg, setMsg] = useState('')

    

    const handleSend = () => {
        //console.log(msg);
        //call firestore function
        //console.log(projectId, user.uid, user.displayName, msg)
       sendChatMsg(projectId, user.uid, user.displayName, msg);
       // setMsg('');
        
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
        return <div> no files </div>
    }

    return (
        
        <div>
            <h2>Chat Room</h2>

            {
                  chatLog.length > 0 && chatLog.map(msg => (
                    <Grid item xs ={1} key = {msg.Time} sx={{display: 'flex', justifyContent: 'flex-start', marginBottom: '10px'}}>
                      <Paper sx={{ width: "80%"}}>
                        <Grid container columns={1} sx={{width: "95%", p: '15px'}}>
                          <Grid item xs={1} sx={{display: 'flex', justifyContent: 'flex-start'}}>{msg.createAt.toDate().toLocaleString()}</Grid>
                          <Grid item xs={1} sx={{display: 'flex', justifyContent: 'flex-start'}}>Sender: {msg.senderName}</Grid>
                          <Grid item xs={1} sx={{display: 'flex', justifyContent: 'flex-start'}}>Message:{msg.message}</Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))
                }
            
            <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            onChange = {(e)=>setMsg(e.target.value)}
            placeholder="send message"
            style={{ width: 200 }}
            />

            <Button variant='contained' onClick={handleSend} endIcon={<SendIcon />} >Send</Button>
        </div>
    )
}