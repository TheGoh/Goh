import React from "react";
import { useParams } from 'react-router-dom';
import { useCollection } from '../../../hooks/useCollection';
import { useDocument } from '../../../hooks/useDocument';
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useState, useEffect } from 'react';
import { useFirestore } from '../../../hooks/useFirestore';

import ScrollToBottom from "react-scroll-to-bottom";
import styles from './Chat.module.css'

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
       sendChatMsg(projectId, user.uid, user.displayName, msg);
        
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
        <div className={styles['chat-window']}>
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
    </div>
    )
}